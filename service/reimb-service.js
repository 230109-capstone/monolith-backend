const uuid = require('uuid');
const { fromBuffer } = require('file-type-cjs');

const reimbDao = require('../dao/reimb-dao');
const s3Dao = require('../dao/s3-dao');

const ReimbursementError = require('../errors/reimbursement-error');

async function addReimbursement(username, reimbursement) {
  const errors = [];
  // Make sure reimbursement amount > 0
  if (reimbursement.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (reimbursement.description.trim().length === 0) {
    errors.push("Description must be provided");
  }

  const base64String = reimbursement.image;
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');
  const { ext } = await fromBuffer(imageBuffer);

  if (ext !== 'png' && ext !== 'jpg') {
    errors.push('Only png and jpeg images are supported');
  }

  if (errors.length > 0) {
    throw new ReimbursementError(errors);
  }

  const reimbId = uuid.v4();
  await reimbDao.addReimbursement(reimbId, reimbursement.amount, reimbursement.description, "pending", username);
  await s3Dao.addReimbursementImage(reimbId, imageBuffer, ext)
}

async function retrieveReimbursements(payload) {
  if (payload.role === 'finance_manager') {
    const data = await reimbDao.retrieveAllReimbursements();
    return data.Items;
  } else if (payload.role === 'employee') {
    const data = await reimbDao.retrieveAllReimbursementsByUsername(payload.username);
    return data.Items;
  }
}

async function approveDenyReimbursements(id, status) {
  const data = await reimbDao.retrieveReimbursementById(id);

  const errors = [];
  if (!data.Item) {
    errors.push(`Reimbursement with id ${id} does not exist`);
  } else if (data.Item.status !== 'pending') {
    errors.push(`Reimbursement must be pending in order to be approved or denied`);
  }

  if (!(status === 'approved' || status === 'denied')) {
    errors.push('Updated status must be either approved or denied');
  }

  if (errors.length > 0) {
    throw new ReimbursementError(errors);
  }

  await reimbDao.updateReimbursementStatus(id, status);
}

module.exports = {
  addReimbursement,
  retrieveReimbursements,
  approveDenyReimbursements
}
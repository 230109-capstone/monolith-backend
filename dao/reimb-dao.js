const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-east-1"
});

const documentClient = new AWS.DynamoDB.DocumentClient();

function addReimbursement(reimbId, amount, description, status, submitter) {
  return documentClient.put({
    TableName: 'reimbursements',
    Item: {
      id: reimbId,
      amount: amount,
      description: description,
      status: status,
      submitter: submitter
    }
  }).promise();
}

function retrieveAllReimbursements() {
  return documentClient.scan({
    TableName: 'reimbursements'
  }).promise();
}

function retrieveAllReimbursementsByUsername(username) {
  return documentClient.query({
    TableName: 'reimbursements',
    IndexName: 'submitter-index',
    KeyConditionExpression: '#s = :user',
    ExpressionAttributeNames: {
      '#s': 'submitter'
    },
    ExpressionAttributeValues: {
      ':user': username
    }
  }).promise();
}

function retrieveReimbursementById(id) {
  return documentClient.get({
    TableName: 'reimbursements',
    Key: {
      id: id
    }
  }).promise();
}

function updateReimbursementStatus(id, status) {
  return documentClient.update({
    TableName: 'reimbursements',
    Key: {
      id: id
    },
    UpdateExpression: 'set #s = :val',
    ExpressionAttributeNames: {
      '#s': 'status'
    },
    ExpressionAttributeValues: {
      ':val': status
    }
  }).promise();
}

module.exports = {
  addReimbursement,
  retrieveAllReimbursements,
  retrieveAllReimbursementsByUsername,
  retrieveReimbursementById,
  updateReimbursementStatus
};
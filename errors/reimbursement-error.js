module.exports = class ReimbursementError extends Error {
  constructor(errors) {
    super('Reimbursement Error');
    this.errors = errors;
  }
}
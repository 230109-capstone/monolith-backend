module.exports = class AuthorizationError extends Error {
  constructor(errors) {
    super("Authorization Error");
    this.errors = errors;
  }
}
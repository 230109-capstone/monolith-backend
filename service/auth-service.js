const bcrypt = require('bcrypt');
const { retrieveUserByUsername } = require('../dao/user-dao');

const jwtUtil = require('../utility/jwt-utility');
const userDao = require('../dao/user-dao');

const RegistrationError = require('../errors/registration-error');
const LoginError = require('../errors/login-error')
const AuthorizationError = require('../errors/authorization-error');
const { JsonWebTokenError } = require('jsonwebtoken');

async function login(username, password) {
  const data = await userDao.retrieveUserByUsername(username);

  const errors = [];
  if (!data.Item) {
    errors.push("Invalid username");
  } else if (!(await bcrypt.compare(password, data.Item.password))) {
    errors.push("Invalid password");
  }

  if (errors.length > 0) {
    throw new LoginError(errors);
  }

  return jwtUtil.createToken(data.Item.username, data.Item.role);
}

async function register(username, password) {
  const errorMessages = [];
  // Check if username meets validation requirements
  if (!(username.length >= 2 && username.length <= 20)) {
    errorMessages.push('Username must be between 2 and 20 (inclusive)');
  }

  // Check if password meets validation requirements
  if (!(password.length >= 2 && password.length <= 20)) {
    errorMessages.push('Password must be between 2 and 20 (inclusive)');
  }

  // Check if username is already taken
  const data = await userDao.retrieveUserByUsername(username);
  if (data.Item) {
    errorMessages.push('Username is already taken');
  }

  if (errorMessages.length > 0) {
    throw new RegistrationError(errorMessages);
  }

  // Add user to DB
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await userDao.addUser({
    "username": username,
    "password": hash,
    "role": "employee"
  });
}

async function authorizeEmployee(authorizationHeader) {
  if(!authorizationHeader) {
    throw new JsonWebTokenError("Token not provided");
  }

  const token = authorizationHeader.split(" ")[1];
  const payload = await jwtUtil.verifyTokenAndReturnPayload(token);

  if (payload.role !== 'employee') {
    throw new AuthorizationError(["Employee role required"]);
  }

  return payload;
}

async function authorizeFinanceManager(authorizationHeader) {
  if(!authorizationHeader) {
    throw new JsonWebTokenError("Token not provided");
  }

  const token = authorizationHeader.split(" ")[1];
  const payload = await jwtUtil.verifyTokenAndReturnPayload(token);

  if (payload.role !== 'finance_manager') {
    throw new AuthorizationError(["Finance manager role required"]);
  }

  return payload;
}

async function authorizeEmployeeOrFinanceManager(authorizationHeader) {
  if(!authorizationHeader) {
    throw new JsonWebTokenError("Token not provided");
  }

  const token = authorizationHeader.split(" ")[1];
  const payload = await jwtUtil.verifyTokenAndReturnPayload(token);

  if (!(payload.role == 'employee' || payload.role == 'finance_manager')) {
    throw new AuthorizationError(["Employee or Finance manager role required"]);
  }

  return payload;
}


module.exports = {
  register,
  login,
  authorizeEmployee,
  authorizeFinanceManager,
  authorizeEmployeeOrFinanceManager
};
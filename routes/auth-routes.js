const express = require('express');

const authRouter = express.Router();

const authService = require('../service/auth-service');

const RegistrationError = require('../errors/registration-error');
const LoginError = require('../errors/login-error');

authRouter.post('/login', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      throw new Error('Username and/or password not provided');
    }

    const token = await authService.login(username, password);

    return res.send({
      "message": "Login successful",
      "token": token
    });
  } catch(err) {
    if (err instanceof LoginError) {
      return res.status(400).send({
        "errors": err.errors
      })
    }

    return res.status(500).send({
      "errors": [ err.message ]
    });
  }
});

authRouter.post('/users', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      throw new Error('Username and/or password not provided');
    }

    await authService.register(username, password);

    return res.send({
      "message": "User successfully registered"
    });
  } catch(err) {
    if (err instanceof RegistrationError) {
      return res.status(400).send({
        "errors": err.errors
      });
    }

    return res.status(500).send({
      "errors": [ err.message ]
    });
  }
});

module.exports = authRouter;
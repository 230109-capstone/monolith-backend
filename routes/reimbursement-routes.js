const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const ReimbursementError = require('../errors/reimbursement-error');
const AuthorizationError = require('../errors/authorization-error');

const reimbursementRouter = express.Router();

const authService = require('../service/auth-service');
const reimbService = require('../service/reimb-service');

reimbursementRouter.post('/reimbursements', async (req, res) => {
  try {
    const payload = await authService.authorizeEmployee(req.headers.authorization);

    await reimbService.addReimbursement(payload.username, req.body);

    return res.send({
      "message": "Reimbursement successfully added!"
    });

  } catch(err) {
    if (err instanceof JsonWebTokenError) {
      return res.status(401).send({
        "errors": [ err.message ]
      });
    }

    if (err instanceof AuthorizationError) {
      return res.status(401).send({
        "errors": err.errors
      });
    }

    if (err instanceof ReimbursementError) {
      return res.status(400).send({
        "errors": err.errors
      });
    }

    return res.status(500).send({
      "errors": [ err.message ]
    });
  }
  
});

reimbursementRouter.get('/reimbursements', async (req, res) => {
  try {
    const payload = await authService.authorizeEmployeeOrFinanceManager(req.headers.authorization);

    const reimbursements = await reimbService.retrieveReimbursements(payload);

    return res.send({
      "message": "Reimbursements successfully retrieved",
      "data": reimbursements
    });
  } catch(err) {
    if (err instanceof JsonWebTokenError) {
      return res.status(401).send({
        "errors": [ err.message ]
      });
    }

    if (err instanceof AuthorizationError) {
      return res.status(401).send({
        "errors": err.errors
      });
    }

    return res.status(500).send({
      "errors": [ err.message ]
    });
  }
});

reimbursementRouter.patch('/reimbursements/:id/status', async (req, res) => {
  try {
    await authService.authorizeFinanceManager(req.headers.authorization);

    await reimbService.approveDenyReimbursements(req.params.id, req.body.status);

    return res.send({
      "message": "Reimbursement status updated"
    });
  } catch(err) {
    if (err instanceof JsonWebTokenError) {
      return res.status(401).send({
        "errors": [ err.message ]
      });
    }

    if (err instanceof ReimbursementError) {
      return res.status(400).send({
        "errors": err.errors
      });
    }

    if (err instanceof AuthorizationError) {
      return res.status(401).send({
        "errors": err.errors
      });
    }

    return res.status(500).send({
      "errors": [ err.message ]
    });
  }
});

module.exports = reimbursementRouter;
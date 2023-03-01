require('dotenv').config();
const express = require('express');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const app = express();
const bodyParser = require('body-parser');

// Router imports
const authRouter = require('./routes/auth-routes');
const reimbursementRouter = require('./routes/reimbursement-routes');

app.use(bodyParser.json());

app.get('/health', (req, res) => {
  return res.send({ 
    "uptime": process.uptime(),
    "message": "OK",
    "timestamp": Date.now()
  });
});

app.use(authRouter);
app.use(reimbursementRouter);

app.listen(8080, () => {
  console.log('Listening on port 8080');
});
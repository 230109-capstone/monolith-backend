const jwt = require('jsonwebtoken');

function createToken(username, role) {
  return jwt.sign({
    username: username,
    role: role
  }, process.env.JWT_SIGNING_SECRET)
}

function verifyTokenAndReturnPayload(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SIGNING_SECRET, (err, data) => {
      if(err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
}

//verifyTokenAndReturnPayload("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRhIiwicm9sZSI6ImVtcGxveWVlIiwiaWF0IjoxNjc3NTMxNzEyfQ.IwPjkE_bVwk-IxLEu7lYc2OJ_8dD2MPLe8HW12HU0lo")

module.exports = {
  createToken,
  verifyTokenAndReturnPayload
};
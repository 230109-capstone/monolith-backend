const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-east-1"
});

const documentClient = new AWS.DynamoDB.DocumentClient();

function retrieveUserByUsername(username) {
  return documentClient.get({
    TableName: 'users',
    Key: {
      username: username
    }
  }).promise();
}

function addUser(userObj) {
  return documentClient.put({
    TableName: 'users',
    Item: userObj
  }).promise();
}

module.exports = {
  retrieveUserByUsername,
  addUser
};
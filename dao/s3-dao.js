const AWS = require('aws-sdk');

AWS.config.update({
  "region": "us-east-1"
});

const s3Client = new AWS.S3();

function addReimbursementImage(reimbId, imageBuffer, extension) {
    return s3Client.putObject({
        Bucket: process.env.RECEIPTS_BUCKET_NAME,
        Key: `${reimbId}.${extension}`,
        Body: imageBuffer
    }).promise();
}

module.exports = {
  addReimbursementImage
}
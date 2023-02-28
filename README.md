# Monolith Employee Reimbursement System Backend

# Endpoints
* GET /health
* POST /users
* POST /login
* POST /reimbursements
* GET /reimbursements
* PATCH /reimbursements/:id/status

# Startup
## DynamoDB Schema
Tables
* users
    * Primary Key
        * username (partition key) (S)
    * Attributes
        * password (S)
        * role (S)
* reimbursements
    * Primary Key
        * id (partition key) (S)
    * Attributes
        * amount (N)
        * description (S)
        * status (S)
    * Global Secondary Indices
        * submitter-index
            * submitter (partition key) (S)

## S3 Bucket
An S3 bucket is also required to be created for storing .png and .jpg images corresponding to reimbursement receipts

## .env Setup
The following environment variables should have values assigned in a `.env` file
```text
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
JWT_SIGNING_SECRET=...
RECEIPTS_BUCKET_NAME=...
```

## Run Application
The application can be ran after
1. Running `npm install` to install required dependencies
2. Running `npm run start` (which will use a nodemon dev server with live reloading)
    - `node index.js` also works as well

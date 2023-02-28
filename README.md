# Monolith Employee Reimbursement System Backend

# Endpoints
* GET /health
* POST /users
* POST /login
* POST /reimbursements
* GET /reimbursements
* PATCH /reimbursements/:id/status

# Run
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

# Fintech_bank_Api
### 🏦 Digital Banking API
A backend API for a digital banking system built with Node.js, Express, MongoDB, and Mongoose.
This system supports customer onboarding (KYC), account management, and transaction processing including interbank transfers.

### 🚀 Features
* Customer onboarding (BVN/NIN verification)
* JWT-based authentication (passwordless)
* Account creation
* Balance retrieval
* Intra-bank transfers
* Inter-bank transfers (via NIBSS integration)
* Transaction history
* Transaction status tracking
* Centralized error handling

### Tech Stack
* Backend: Node.js, Express
* Database: MongoDB (Mongoose)
* Authentication: JWT
* External API: NIBSS (for identity verification & transfers)

### 📁 Project Structure
```
src/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── accountController.js
│   └── transactionController.js
│
├── models/
│   ├── customerModel.js
│   ├── accountModel.js
│   └── transactionModel.js
│
├── routes/
│   ├── authRoute.js
│   ├── accountRoute.js
│   └── transactionRoute.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
│
├── integrations/
│   └── nibss.js
│
└── server.js
```


📌 API Endpoints
🧑 Auth
Method	Endpoint	Description
POST	/api/auth/onboard	Register user (BVN or NIN required)
💳 Accounts
Method	Endpoint	Description
POST	/api/accounts	Create account
GET	/api/accounts/balance	Get account balance
🔁 Transactions
Method	Endpoint	Description
POST	/api/transactions/transfer	Intra-bank transfer
POST	/api/transactions/interbank	Inter-bank transfer
GET	/api/transactions/history	Transaction history
GET	/api/transactions/status/:reference	Transaction status
🧠 Business Logic Highlights
Users must provide either BVN or NIN
Identity is verified via NIBSS API
Each user can have only one account
Default account balance: ₦15,000
Transactions are recorded with:
type (INTRA or INTER)
status (SUCCESS, FAILED, PENDING)
⚠️ Error Handling

All errors are handled through a centralized middleware:

{
  "message": "Error description"
}
🔒 Security Notes
JWT used for authentication
Passwordless system (relies on identity verification)
Sensitive operations require authentication token

⚠️ Note: For production, consider adding:

OTP authentication
Rate limiting
Data encryption for BVN/NIN
🚀 Future Improvements
🔐 OTP-based login system
💳 Deposit & withdrawal endpoints
📊 Transaction analytics
🧾 Account statements (PDF/CSV)
⚡ Retry & queue system for transfers
🛡️ Role-based access control
👨‍💻 Author

Ifeanyi Osirike
Backend Engineer | Fintech Enthusiast


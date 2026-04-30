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
**src/
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
**

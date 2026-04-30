const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  transfer,
  interBankTransfer,
  getTransactionHistory,
  getTransactionStatus
} = require("../controllers/transactionController");

const router = express.Router();

router.post("/transfer", auth, transfer);
router.post("/interbank", auth, interBankTransfer);
router.get("/history", auth, getTransactionHistory);
router.get("/status/:reference", auth, getTransactionStatus);

module.exports = router;
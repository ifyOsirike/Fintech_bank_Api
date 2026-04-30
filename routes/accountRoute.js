const express = require("express");
const auth = require("../middleware/authMiddleware");
const { createAccount, getBalance } = require("../controllers/accountController");

const router = express.Router();

router.post("/", auth, createAccount);
router.get("/balance", auth, getBalance);

module.exports = router;
const express = require("express");
const { onboard, login } = require("../controllers/authController");

const router = express.Router();


router.post("/onboard", onboard);
router.post("/login", login);

module.exports = router;
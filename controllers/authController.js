const Customer = require("../models/customerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyIdentity } = require("../integrations/nibss");

/* =========================
   ONBOARD (REGISTER)
========================= */
const onboard = async (req, res, next) => {
  try {
    const { firstName, lastName, email, bvn, nin } = req.body;

    // Validation
    if (!firstName || !lastName || !email) {
      throw { statusCode: 400, message: "Missing required fields" };
    }

    if (!bvn && !nin) {
      throw { statusCode: 400, message: "BVN or NIN required" };
    }

    // Check if user already exists
    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      throw { statusCode: 409, message: "User already exists" };
    }

    // Identity verification
    const verify = await verifyIdentity({ bvn, nin });

    if (!verify || !verify.success) {
      throw { statusCode: 400, message: "Identity verification failed" };
    }

    const user = await Customer.create({
      firstName,
      lastName,
      email,
      bvn,
      nin,
      isVerified: true
    });

    // Better token security
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      token
    });

  } catch (err) {
    next(err);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw { statusCode: 400, message: "Email and password required" };
    }

    const user = await Customer.findOne({ email });

    if (!user) {
      throw { statusCode: 400, message: "Invalid credentials" };
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw { statusCode: 400, message: "Invalid credentials" };
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  onboard,
  login
};
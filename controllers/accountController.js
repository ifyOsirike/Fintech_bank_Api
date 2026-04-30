const Account = require("../models/accountModel");
const generateAccountNumber = () =>
  Math.floor(1000000000 + Math.random() * 9000000000).toString();


const createAccount = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      throw { statusCode: 401, message: "Unauthorized" };
    }

    const existing = await Account.findOne({ customerId: req.user.id });

    if (existing) {
      throw { statusCode: 400, message: "Account already exists" };
    }

    let accountNumber;
    let isUnique = false;

    while (!isUnique) {
      accountNumber = generateAccountNumber();
      const exists = await Account.findOne({ accountNumber });
      if (!exists) isUnique = true;
    }

    const account = await Account.create({
      customerId: req.user.id,
      accountNumber,
      balance: 0 
    });

    res.status(201).json({
      success: true,
      data: account
    });

  } catch (err) {
    next(err);
  }
};

const getBalance = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      throw { statusCode: 401, message: "Unauthorized" };
    }

    const acc = await Account.findOne({ customerId: req.user.id });

    if (!acc) {
      throw { statusCode: 404, message: "Account not found" };
    }

    res.json({
      success: true,
      balance: acc.balance
    });

  } catch (err) {
    next(err);
  }
};


module.exports = {
  createAccount,
  getBalance
};
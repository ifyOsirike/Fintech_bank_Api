const mongoose = require("mongoose");
const Account = require("../models/accountModel");
const Transaction = require("../models/transactionModel");
const { initiateTransfer } = require("../integrations/nibss");
const crypto = require("crypto");

/* =========================
   INTRA-BANK TRANSFER
========================= */
const transfer = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { receiverAccount, amount } = req.body;

    // Validation
    if (!receiverAccount || !amount) {
      throw { statusCode: 400, message: "Missing fields" };
    }

    if (amount <= 0) {
      throw { statusCode: 400, message: "Invalid amount" };
    }

    const sender = await Account.findOne({ customerId: req.user.id }).session(session);
    const receiver = await Account.findOne({ accountNumber: receiverAccount }).session(session);

    if (!sender) throw { statusCode: 404, message: "Sender account not found" };
    if (!receiver) throw { statusCode: 404, message: "Receiver not found" };

    if (sender.balance < amount) {
      throw { statusCode: 400, message: "Insufficient funds" };
    }

    // Update balances atomically
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    const transaction = await Transaction.create(
      [
        {
          senderAccount: sender.accountNumber,
          receiverAccount: receiver.accountNumber,
          amount,
          type: "INTRA",
          status: "SUCCESS",
          reference: crypto.randomUUID()
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      data: transaction[0]
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

/* =========================
   TRANSACTION HISTORY
========================= */
const getTransactionHistory = async (req, res, next) => {
  try {
    const account = await Account.findOne({ customerId: req.user.id });

    if (!account) {
      throw { statusCode: 404, message: "Account not found" };
    }

    const tx = await Transaction.find({
      $or: [
        { senderAccount: account.accountNumber },
        { receiverAccount: account.accountNumber }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: tx
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   TRANSACTION STATUS
========================= */
const getTransactionStatus = async (req, res, next) => {
  try {
    const { reference } = req.params;

    const transaction = await Transaction.findOne({ reference });

    if (!transaction) {
      throw { statusCode: 404, message: "Transaction not found" };
    }

    const account = await Account.findOne({ customerId: req.user.id });

    if (
      transaction.senderAccount !== account.accountNumber &&
      transaction.receiverAccount !== account.accountNumber
    ) {
      throw { statusCode: 403, message: "Unauthorized" };
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   INTER-BANK TRANSFER
========================= */
const interBankTransfer = async (req, res, next) => {
  try {
    const { receiverAccount, bankCode, amount } = req.body;

    if (!receiverAccount || !bankCode || !amount) {
      throw { statusCode: 400, message: "Missing fields" };
    }

    if (amount <= 0) {
      throw { statusCode: 400, message: "Invalid amount" };
    }

    const sender = await Account.findOne({ customerId: req.user.id });

    if (!sender) {
      throw { statusCode: 404, message: "Account not found" };
    }

    if (sender.balance < amount) {
      throw { statusCode: 400, message: "Insufficient funds" };
    }

    // Call external API first
    const response = await initiateTransfer({
      receiverAccount,
      bankCode,
      amount
    });

    if (!response || !response.success) {
      throw { statusCode: 400, message: "External transfer failed" };
    }

    // Deduct only after success
    sender.balance -= amount;
    await sender.save();

    const transaction = await Transaction.create({
      senderAccount: sender.accountNumber,
      receiverAccount,
      amount,
      type: "INTER",
      status: "SUCCESS",
      reference: crypto.randomUUID()
    });

    res.json({
      success: true,
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   EXPORTS
========================= */
module.exports = {
  transfer,
  getTransactionHistory,
  getTransactionStatus,
  interBankTransfer
};
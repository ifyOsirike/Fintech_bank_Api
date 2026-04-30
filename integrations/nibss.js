const axios = require("axios");

/* =========================
   VERIFY IDENTITY
========================= */
const verifyIdentity = async (data) => {
  try {
    if (!process.env.NIBSS_BASE_URL || !process.env.NIBSS_API_KEY) {
      throw new Error("NIBSS environment variables not configured");
    }

    const res = await axios.post(
      `${process.env.NIBSS_BASE_URL}/verify`,
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.NIBSS_API_KEY}`
        },
        timeout: 10000
      }
    );

    return res.data;
  } catch (err) {
    console.error("Identity verification failed:", err.message);
    return { success: false };
  }
};

/* =========================
   INITIATE TRANSFER
========================= */
const initiateTransfer = async (data) => {
  try {
    if (!process.env.NIBSS_BASE_URL || !process.env.NIBSS_API_KEY) {
      throw new Error("NIBSS environment variables not configured");
    }

    const res = await axios.post(
      `${process.env.NIBSS_BASE_URL}/transfer`,
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.NIBSS_API_KEY}`
        },
        timeout: 10000
      }
    );

    return res.data;
  } catch (err) {
    console.error("Transfer initiation failed:", err.message);
    return { success: false };
  }
};

/* =========================
   EXPORTS
========================= */
module.exports = {
  verifyIdentity,
  initiateTransfer
};
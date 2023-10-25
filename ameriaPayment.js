const axios = require("axios");

// payment with ameria bank
async function onlinePayment(paymentData) {
  try {
    // Calculate the hash (replace with your actual hash calculation method)
    const hash = Date.now();

    // Add the hash to the payment data
    paymentData.Hash = hash;

    // Define the Ameriabank's InitPayment API endpoint
    const apiUrl =
      "https://servicestest.ameriabank.am/VPOS/api/VPOS/InitPayment";

    // Send the payment initiation request
    const res = await axios.post(apiUrl, paymentData);

    return res.data;
  } catch {
    return {};
  }
}

module.exports = onlinePayment;

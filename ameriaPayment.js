const axios = require("axios");

// payment with ameria bank
function onlinePayment(paymentData) {
  // Calculate the hash (replace with your actual hash calculation method)
  const hash = "your_hash_calculation";

  // Add the hash to the payment data
  paymentData.Hash = hash;

  // Define the Ameriabank's InitPayment API endpoint
  const apiUrl = "https://servicestest.ameriabank.am/VPOS/api/VPOS/InitPayment";

  // Send the payment initiation request
  axios
    .post(apiUrl, paymentData)
    .then((response) => {
      // Handle the response here
      console.log("Payment initiation response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

module.exports = onlinePayment;

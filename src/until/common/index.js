import axios from "axios";
import api from "../../Config/api";

function generateRandomNumber() {
  const timestamp = Date.now().toString();
  const randomValue = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return parseInt(timestamp.slice(-11) + randomValue);
}

async function createUrLPayment(amount, id, method = "VISA") {
  
  // [FIX] Sử dụng window.location.origin để lấy domain hiện tại (tự động nhận localhost hoặc adayroilaptop.com)
  const baseUrl = window.location.origin;

  const paymentData = {
    orderCode: generateRandomNumber(),
    amount: Math.round(amount),
    description: String(id),
    cancelUrl: `${baseUrl}/account/order`,      // Sửa dòng này
    returnUrl: `${baseUrl}/payment/success`,    // Sửa dòng này
    expiredAt: Math.floor(Date.now() / 1000) + 3600,
  };

  try {
    const response = await api.post(
      `/api/payment/create-payos`,
      paymentData
    );

    return response.data.checkoutUrl;

  } catch (error) {
    console.error("Error creating payment URL via backend:", error);
    throw error;
  }
}

async function getInfoPayment(id) {
  try {
    const response = await api.get(
      `/api/payment/payos-info/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting payment info via backend:", error);
    throw error;
  }
}

export { createUrLPayment, getInfoPayment };
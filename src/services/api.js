const BASE_URL = "https://cafe-backend-28q0.onrender.com";

// Saare endpoints ek object me
export const API_URLS = {
  LOGIN: `${BASE_URL}/api/entry`,
 UNIT: `${BASE_URL}/api/unit`,
  QR: `${BASE_URL}/api/qr`, 
  MENU: `${BASE_URL}/api/menu`,
  ORDER: `${BASE_URL}/api/order`,
  PAYMENT: `${BASE_URL}/api/payment`,
    DASHBOARD: `${BASE_URL}/api/dashboard`,
 MANUALLYPAY: `${BASE_URL}/api/manpayment`,
  INVOICE_CONFIG: `${BASE_URL}/api/invoice-config`,
};

export default API_URLS;

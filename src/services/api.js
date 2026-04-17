// services/api.js
// Real API — https://take-home-test-api.nutech-integrasi.com
// Docs   — https://api-doc-tht.nutech-integrasi.com

const BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

const getToken = () => localStorage.getItem('token');

/**
 * Generic JSON request.
 * Throws with the API's `message` string on any non-zero status.
 */
const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();

  // API returns status:0 for success, non-zero for errors
  if (data.status !== 0) {
    throw new Error(data.message || 'Terjadi kesalahan');
  }

  return data; // { status, message, data }
};

// ─── Module Membership ────────────────────────────────────────────────────────

/**
 * POST /registration
 * Body: { email, first_name, last_name, password }
 * Response data: null (just status + message)
 */
export const apiRegister = ({ email, first_name, last_name, password }) =>
  request('/registration', {
    method: 'POST',
    body: JSON.stringify({ email, first_name, last_name, password }),
  });

/**
 * POST /login
 * Body: { email, password }
 * Response data: { token }
 */
export const apiLogin = ({ email, password }) =>
  request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

/**
 * GET /profile  (Bearer token required)
 * Response data: { email, first_name, last_name, profile_image }
 */
export const apiGetProfile = () => request('/profile');

/**
 * PUT /profile/update  (Bearer token required)
 * Body: { first_name, last_name }
 * Response data: { email, first_name, last_name, profile_image }
 */
export const apiUpdateProfile = ({ first_name, last_name }) =>
  request('/profile/update', {
    method: 'PUT',
    body: JSON.stringify({ first_name, last_name }),
  });

/**
 * PUT /profile/image  (Bearer token required)
 * Body: multipart/form-data  field name = "file"  (JPEG or PNG, max 100 KB)
 * Response data: { email, first_name, last_name, profile_image }
 */
export const apiUpdateProfileImage = (formData) => {
  const token = getToken();
  return fetch(`${BASE_URL}/profile/image`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData, // let browser set Content-Type multipart boundary
  }).then(async (res) => {
    const data = await res.json();
    if (data.status !== 0) throw new Error(data.message || 'Upload gagal');
    return data;
  });
};

// ─── Module Information ───────────────────────────────────────────────────────

/**
 * GET /banner  (Bearer token required)
 * Response data: [{ banner_name, banner_image, description }]
 */
export const apiGetBanners = () => request('/banner');

/**
 * GET /services  (Bearer token required)
 * Response data: [{ service_code, service_name, service_icon, service_tariff }]
 */
export const apiGetServices = () => request('/services');

// ─── Module Transaction ───────────────────────────────────────────────────────

/**
 * GET /balance  (Bearer token required)
 * Response data: { balance }
 */
export const apiGetBalance = () => request('/balance');

/**
 * POST /topup  (Bearer token required)
 * Body: { top_up_amount }   — integer, min 10000, max 1000000
 * Response data: { balance }
 */
export const apiTopUp = (top_up_amount) =>
  request('/topup', {
    method: 'POST',
    body: JSON.stringify({ top_up_amount: Number(top_up_amount) }),
  });

/**
 * POST /transaction  (Bearer token required)
 * Body: { service_code }
 * Response data: { invoice_number, service_code, service_name, transaction_type, total_amount, created_on }
 */
export const apiTransaction = (service_code) =>
  request('/transaction', {
    method: 'POST',
    body: JSON.stringify({ service_code }),
  });

/**
 * GET /transaction/history  (Bearer token required)
 * Query: offset (default 0), limit (default 5)
 * Response data: { offset, limit, records: [...] }
 */
export const apiGetTransactionHistory = (offset = 0, limit = 5) =>
  request(`/transaction/history?offset=${offset}&limit=${limit}`);
import mockData from '../data/mockData.json';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// Helpers matching real API shape
const ok   = (message, data)  => ({ status: 0, message, data });
const fail = (message)        => { throw new Error(message); };

// In-memory state (survives page navigation, resets on hard refresh)
const state = {
  users: [
    {
      email:         'user@nutech-integrasi.com',
      password:      'abcdef1234',
      first_name:    'User',
      last_name:     'Nutech',
      profile_image: null,
    },
  ],
  balance:      mockData.balance,
  transactions: [...mockData.transactions],
};

// Decode our fake JWT to get the current user's email
const currentEmail = () => {
  const token = localStorage.getItem('token');
  if (!token) fail('Token tidak valid atau kadaluarsa');
  try { return JSON.parse(atob(token)).email; }
  catch { fail('Token tidak valid atau kadaluarsa'); }
};

const findUser = (email) => state.users.find((u) => u.email === email);

// ─── Module Membership ────────────────────────────────────────────────────────

/**
 * POST /registration
 * Body: { email, first_name, last_name, password }
 */
export const mockRegister = async ({ email, first_name, last_name, password }) => {
  await delay();
  if (!email || !first_name || !last_name || !password)
    fail('Semua field wajib diisi');
  if (!/\S+@\S+\.\S+/.test(email))
    fail('Parameter email tidak sesuai format');
  if (state.users.find((u) => u.email === email))
    fail('Email sudah terdaftar');
  state.users.push({ email, first_name, last_name, password, profile_image: null });
  return ok('Registrasi berhasil silahkan login', null);
};

/**
 * POST /login
 * Body: { email, password }
 * Returns: { token }
 */
export const mockLogin = async ({ email, password }) => {
  await delay();
  if (!email || !password) fail('Email atau password tidak boleh kosong');
  const user = state.users.find((u) => u.email === email && u.password === password);
  if (!user) fail('Username atau password salah');
  // Fake JWT: base64(JSON) — good enough for mock
  const token = btoa(JSON.stringify({ email, exp: Date.now() + 3_600_000 }));
  return ok('Login Sukses', { token });
};

/**
 * GET /profile
 * Returns: { email, first_name, last_name, profile_image }
 */
export const mockGetProfile = async () => {
  await delay(200);
  const email = currentEmail();
  const user = findUser(email);
  if (!user) fail('User tidak ditemukan');
  return ok('Sukses', {
    email:         user.email,
    first_name:    user.first_name,
    last_name:     user.last_name,
    profile_image: user.profile_image,
  });
};

/**
 * PUT /profile/update
 * Body: { first_name, last_name }
 * Returns: { email, first_name, last_name, profile_image }
 */
export const mockUpdateProfile = async ({ first_name, last_name }) => {
  await delay();
  if (!first_name || !last_name) fail('first_name dan last_name wajib diisi');
  const email = currentEmail();
  const user = findUser(email);
  if (!user) fail('User tidak ditemukan');
  user.first_name = first_name;
  user.last_name  = last_name;
  return ok('Update Profile berhasil', {
    email:         user.email,
    first_name:    user.first_name,
    last_name:     user.last_name,
    profile_image: user.profile_image,
  });
};

/**
 * PUT /profile/image
 * Body: FormData — field "file" (JPEG/PNG, max 100 KB)
 * Returns: { email, first_name, last_name, profile_image }
 */
export const mockUpdateProfileImage = async (formData) => {
  await delay(600);
  const file = formData.get('file');
  if (!file) fail('File tidak ditemukan');
  if (!['image/jpeg', 'image/png'].includes(file.type))
    fail('Format Image tidak sesuai');
  if (file.size > 102_400)
    fail('Ukuran file maksimal 100 KB');
  const email = currentEmail();
  const user  = findUser(email);
  if (!user) fail('User tidak ditemukan');
  user.profile_image = URL.createObjectURL(file);
  return ok('Update Profile Image berhasil', {
    email:         user.email,
    first_name:    user.first_name,
    last_name:     user.last_name,
    profile_image: user.profile_image,
  });
};

// ─── Module Information ───────────────────────────────────────────────────────

/**
 * GET /banner
 * Returns: [{ banner_name, banner_image, description }]
 */
export const mockGetBanners = async () => {
  await delay(300);
  return ok('Sukses', mockData.banners);
};

/**
 * GET /services
 * Returns: [{ service_code, service_name, service_icon, service_tariff }]
 */
export const mockGetServices = async () => {
  await delay(300);
  return ok('Sukses', mockData.services);
};

// ─── Module Transaction ───────────────────────────────────────────────────────

/**
 * GET /balance
 * Returns: { balance }
 */
export const mockGetBalance = async () => {
  await delay(200);
  return ok('Get Balance Berhasil', { balance: state.balance });
};

/**
 * POST /topup
 * Body: { top_up_amount }  — integer, min 10 000, max 1 000 000
 * Returns: { balance }
 */
export const mockTopUp = async (top_up_amount) => {
  await delay();
  const amount = Number(top_up_amount);
  if (!amount || amount < 10_000)   fail('Paramter amount harus diantara 10.000 - 1.000.000');
  if (amount > 1_000_000)           fail('Paramter amount harus diantara 10.000 - 1.000.000');
  state.balance += amount;
  // Record in history
  state.transactions.unshift({
    invoice_number:   `INV${Date.now()}-TOPUP`,
    transaction_type: 'TOPUP',
    description:      'Top Up balance',
    total_amount:     amount,
    created_on:       new Date().toISOString(),
  });
  return ok('Top Up Balance berhasil', { balance: state.balance });
};

/**
 * POST /transaction
 * Body: { service_code }
 * Returns: { invoice_number, service_code, service_name, transaction_type, total_amount, created_on }
 */
export const mockTransaction = async (service_code) => {
  await delay();
  const service = mockData.services.find((s) => s.service_code === service_code);
  if (!service) fail('Service ataus Layanan tidak ditemukan');
  if (state.balance < service.service_tariff) fail('Saldo tidak mencukupi');
  state.balance -= service.service_tariff;
  const record = {
    invoice_number:   `INV${Date.now()}`,
    service_code:     service.service_code,
    service_name:     service.service_name,
    transaction_type: 'PAYMENT',
    description:      service.service_name,
    total_amount:     service.service_tariff,
    created_on:       new Date().toISOString(),
  };
  state.transactions.unshift(record);
  return ok('Transaksi berhasil', record);
};

/**
 * GET /transaction/history?offset=0&limit=5
 * Returns: { offset, limit, records: [...] }
 */
export const mockGetTransactionHistory = async (offset = 0, limit = 5) => {
  await delay(300);
  const records = state.transactions.slice(offset, offset + limit);
  return ok('Get History Berhasil', { offset, limit, records });
};
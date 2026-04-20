// services/index.js
// ─────────────────────────────────────────────────────────────────────────────
// SERVICE FACADE
// Set USE_MOCK = true  → uses local mockService.js (no network needed)
// Set USE_MOCK = false → calls the real API at take-home-test-api.nutech-integrasi.com
// ─────────────────────────────────────────────────────────────────────────────
// ← flip to true for offline development

import * as real from './api';
import * as mock from './mockService';

export const USE_MOCK = false; 

export const register              = USE_MOCK ? mock.mockRegister              : real.apiRegister;
export const login                 = USE_MOCK ? mock.mockLogin                 : real.apiLogin;
export const getProfile            = USE_MOCK ? mock.mockGetProfile            : real.apiGetProfile;
export const updateProfile         = USE_MOCK ? mock.mockUpdateProfile         : real.apiUpdateProfile;
export const updateProfileImage    = USE_MOCK ? mock.mockUpdateProfileImage    : real.apiUpdateProfileImage;
export const getBalance            = USE_MOCK ? mock.mockGetBalance            : real.apiGetBalance;
export const topUp                 = USE_MOCK ? mock.mockTopUp                 : real.apiTopUp;
export const getServices           = USE_MOCK ? mock.mockGetServices           : real.apiGetServices;
export const getBanners            = USE_MOCK ? mock.mockGetBanners            : real.apiGetBanners;
export const transaction           = USE_MOCK ? mock.mockTransaction           : real.apiTransaction;
export const getTransactionHistory = USE_MOCK ? mock.mockGetTransactionHistory : real.apiGetTransactionHistory;
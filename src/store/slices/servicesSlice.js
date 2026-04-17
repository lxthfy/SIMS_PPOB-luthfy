// store/slices/servicesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getServices, getBanners, transaction } from '../../services';

export const fetchServices = createAsyncThunk('services/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await getServices();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchBanners = createAsyncThunk('services/banners', async (_, { rejectWithValue }) => {
  try {
    const res = await getBanners();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const doTransaction = createAsyncThunk('services/transaction', async (service_code, { rejectWithValue }) => {
  try {
    const res = await transaction(service_code);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    list: [],
    banners: [],
    loading: false,
    transactionLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearServiceMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => { state.loading = true; })
      .addCase(fetchServices.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchServices.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchBanners.fulfilled, (state, action) => { state.banners = action.payload; })

      .addCase(doTransaction.pending, (state) => { state.transactionLoading = true; state.error = null; state.successMessage = null; })
      .addCase(doTransaction.fulfilled, (state, action) => {
        state.transactionLoading = false;
        state.successMessage = `Pembayaran ${action.payload.description} berhasil!`;
      })
      .addCase(doTransaction.rejected, (state, action) => {
        state.transactionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearServiceMessages } = servicesSlice.actions;
export default servicesSlice.reducer;
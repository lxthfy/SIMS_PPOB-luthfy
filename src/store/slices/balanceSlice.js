// store/slices/balanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBalance, topUp } from '../../services';

export const fetchBalance = createAsyncThunk('balance/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await getBalance();
    return res.data.balance;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const doTopUp = createAsyncThunk('balance/topup', async (amount, { rejectWithValue }) => {
  try {
    const res = await topUp(amount);
    return res.data.balance;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const balanceSlice = createSlice({
  name: 'balance',
  initialState: {
    amount: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearBalanceMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => { state.loading = true; })
      .addCase(fetchBalance.fulfilled, (state, action) => { state.loading = false; state.amount = action.payload; })
      .addCase(fetchBalance.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(doTopUp.pending, (state) => { state.loading = true; state.error = null; state.successMessage = null; })
      .addCase(doTopUp.fulfilled, (state, action) => {
        state.loading = false;
        state.amount = action.payload;
        state.successMessage = 'Top Up berhasil!';
      })
      .addCase(doTopUp.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearBalanceMessages } = balanceSlice.actions;
export default balanceSlice.reducer;
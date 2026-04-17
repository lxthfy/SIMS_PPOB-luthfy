// store/slices/transactionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTransactionHistory } from '../../services';

const LIMIT = 5;

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (offset, { rejectWithValue }) => {
    try {
      const res = await getTransactionHistory(offset, LIMIT);
      return { records: res.data.records, offset };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    records: [],
    offset: 0,
    hasMore: true,
    loading: false,
    error: null,
  },
  reducers: {
    resetTransactions(state) {
      state.records = [];
      state.offset = 0;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        const { records, offset } = action.payload;
        if (offset === 0) {
          state.records = records;
        } else {
          state.records = [...state.records, ...records];
        }
        state.offset = offset + LIMIT;
        state.hasMore = records.length === LIMIT;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
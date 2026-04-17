// store/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, updateProfile, updateProfileImage } from '../../services';

export const fetchProfile = createAsyncThunk('profile/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await getProfile();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const saveProfile = createAsyncThunk('profile/update', async (payload, { rejectWithValue }) => {
  try {
    const res = await updateProfile(payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const uploadProfileImage = createAsyncThunk('profile/image', async (formData, { rejectWithValue }) => {
  try {
    const res = await updateProfileImage(formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearProfileMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(saveProfile.pending, (state) => { state.loading = true; state.successMessage = null; })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.successMessage = 'Profil berhasil diperbarui!';
      })
      .addCase(saveProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(uploadProfileImage.pending, (state) => { state.loading = true; })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) state.data.profile_image = action.payload.profile_image;
        state.successMessage = 'Foto profil berhasil diperbarui!';
      })
      .addCase(uploadProfileImage.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearProfileMessages } = profileSlice.actions;
export default profileSlice.reducer;
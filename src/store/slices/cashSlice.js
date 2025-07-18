import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCash, updateCash } from "../../lib/appwrite";

export const fetchCashData = createAsyncThunk(
  "cash/fetchCashData",
  async (ownerId, { rejectWithValue }) => {
    try {
      const data = await getCash(ownerId);
      if (!data) throw new Error("No data returned from Appwrite");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch cash data");
    }
  }
);

export const updateCashData = createAsyncThunk(
  "cash/updateCashData",
  async ({ data, documentId, ownerId }, { rejectWithValue }) => {
    try {
      const updatedData = await updateCash(data, documentId, ownerId);
      if (!updatedData) throw new Error("Failed to update cash");
      return updatedData;
    } catch (err) {
      return rejectWithValue(err.message || "Update failed");
    }
  }
);

export const selectTotalCash = (state) =>
  state.cash.data.reduce((sum, item) => sum + parseFloat(item.balance || 0), 0);

const cashSlice = createSlice({
  name: "cash",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch cash data
      .addCase(fetchCashData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCashData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchCashData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })

      // Handle update cash data
      .addCase(updateCashData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCashData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(updateCashData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const {} = cashSlice.actions;
export default cashSlice.reducer;

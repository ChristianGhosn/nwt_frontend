import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import { fetchCashAPI, updateCashAPI } from "../../api/cash";

export const fetchCashData = createAsyncThunk(
  "cash/fetchCashData",
  async (ownerId, { rejectWithValue }) => {
    const res = await fetchCashAPI(ownerId);
    if (!res.success) return rejectWithValue(res.message);
    return res.data; // { entries, total }
  }
);

export const updateCashData = createAsyncThunk(
  "cash/updateCashData",
  async ({ data, documentId, ownerId }, { rejectWithValue }) => {
    const res = await updateCashAPI(data, documentId, ownerId);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

export const selectTotalCash = createSelector(
  (state) => state.cash.data,
  (data) => {
    if (!Array.isArray(data)) return null;

    return data.find((item) => item.bank === "Total Balance") || null;
  }
);

const cashSlice = createSlice({
  name: "cash",
  initialState: {
    entries: [],
    total: null,
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
        const { entries, total } = action.payload;
        state.entries = entries;
        state.total = total;
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

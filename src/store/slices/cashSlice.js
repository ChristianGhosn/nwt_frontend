import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createCashAPI, fetchCashAPI, updateCashAPI } from "../../api/cash";

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

export const createCashData = createAsyncThunk(
  "cash/createCashData",
  async ({ data, ownerId }, { rejectWithValue }) => {
    const res = await createCashAPI(data, ownerId);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
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

      // Handle create cash data
      .addCase(createCashData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCashData.fulfilled, (state, action) => {
        state.entries.push(action.payload);
        const newTotal = state.entries.reduce(
          (acc, item) => acc + Number(item.balance || 0),
          0
        );
        if (state.total) {
          state.total.balance = Number(newTotal.toFixed(2));
        }
        state.loading = false;
      })
      .addCase(createCashData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })

      // Handle update cash data
      .addCase(updateCashData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCashData.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        if (!state.entries || !Array.isArray(state.entries)) return;

        const index = state.entries.findIndex(
          (item) => item.$id === updatedItem.$id
        );
        if (index !== -1) {
          state.entries[index] = updatedItem;
        }
        const newTotal = state.entries.reduce(
          (acc, item) => acc + Number(item.balance || 0),
          0
        );
        if (state.total) {
          state.total.balance = Number(newTotal.toFixed(2));
        }

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

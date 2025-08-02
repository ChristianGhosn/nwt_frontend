import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { handleApiError } from "../../constants/handleApiError";
import { getAuthHeaders } from "../../utils/getAuthHeaders";
import { apiCallWithToast } from "../../utils/apiCallWithToast";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/cash`;

export const fetchCashData = createAsyncThunk(
  "cash/fetchCashData",
  async (getAccessTokenSilently, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);
      const response = await axios.get(API_BASE_URL, { headers });
      const backendResponse = response.data;

      // 1. Validate the structure expected from the backend
      if (
        !backendResponse ||
        !Array.isArray(backendResponse.entries) ||
        !backendResponse.total
      ) {
        return rejectWithValue(
          "Received invalid data format from backend. Expected 'entries' list and 'total' object."
        );
      }

      return {
        entries: backendResponse.entries,
        total: backendResponse.total,
      };
    } catch (error) {
      // Catch specific error from authentication function check
      if (error.message.includes("Authentication function")) {
        return rejectWithValue(error.message);
      }
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to fetch cash account data"
      );
    }
  }
);

export const createCashData = createAsyncThunk(
  "cash/createCashData",
  // Pass both the data to create and getAccessTokenSilently
  async ({ data, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);

      const res = await apiCallWithToast(
        axios.post(API_BASE_URL, data, { headers }),
        {
          loading: "Creating cash account...",
          success: "New cash account created successfully!",
          error: "Failed to create cash account",
        }
      );

      // Assuming your backend POST /api/cash returns the newly created item
      return res.data; // This will be the new entry added to state.entries
    } catch (error) {
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to create cash account"
      );
    }
  }
);

export const updateCashData = createAsyncThunk(
  "cash/updateCashData",
  async ({ data, documentId, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);

      const res = await apiCallWithToast(
        // toast.promise handles showing success/error messages
        axios.put(`${API_BASE_URL}/${documentId}`, data, {
          headers,
        }),
        {
          loading: "Updating cash account...",
          success: "Cash Account updated successfully!",
          error: "Failed to update cash account",
        }
      );

      return res.data; // Assuming your backend PUT /api/cash/:id returns the updated item
    } catch (error) {
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to update cash account"
      );
    }
  }
);

export const deleteCashData = createAsyncThunk(
  "cash/deleteCashData",
  // Pass documentId and getAccessTokenSilently
  async ({ documentId, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);

      const res = await apiCallWithToast(
        axios.delete(`${API_BASE_URL}/${documentId}`, { headers }),
        {
          loading: "Deleting cash account...",
          success: "cash account deleted successfully!",
          error: "Failed to delete cash account",
        }
      );

      return documentId;
    } catch (error) {
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to delete cash account"
      );
    }
  }
);

const cashSlice = createSlice({
  name: "cash",
  initialState: {
    entries: [],
    total: 0,
    loading: false,
    hasFetched: false,
    error: null,
    validationErrors: {},
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
        state.hasFetched = true;
        const updatedItem = action.payload;
        if (!state.entries || !Array.isArray(state.entries)) return;

        const index = state.entries.findIndex(
          (item) => item._id === updatedItem._id
        );
        if (index !== -1) {
          state.entries[index] = updatedItem;
        }
        // Recalculate total if balance might have changed
        const newTotal = state.entries.reduce(
          (acc, item) => acc + Number(item.balance || 0),
          0
        );
        if (state.total) {
          state.total.balance = Number(newTotal.toFixed(2));
        }

        state.loading = false;
        state.error = null;
        const { entries, total } = action.payload; // Payload should now directly match this structure
        state.entries = entries;
        state.total = total;
        state.loading = false;
      })
      .addCase(fetchCashData.rejected, (state, action) => {
        state.loading = false;
        state.hasFetched = true;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to update bank account due to validation.";
      })

      // Handle create cash data
      .addCase(createCashData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(createCashData.fulfilled, (state, action) => {
        // action.payload is the new entry returned from the backend
        state.entries.push(action.payload);
        const newTotal = state.entries.reduce(
          (acc, item) => acc + Number(item.balance || 0),
          0
        );
        if (state.total) {
          state.total.balance = Number(newTotal.toFixed(2));
        }
        state.loading = false;
        state.validationErrors = {};
      })
      .addCase(createCashData.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
        // Check if the payload is the structured error array from backend validation
        if (
          Array.isArray(action.payload) &&
          action.payload.every(
            (item) =>
              typeof item === "object" &&
              Object.keys(item).length === 1 &&
              Array.isArray(Object.values(item)[0])
          )
        ) {
          // Transform [{bank: ["msg"]}, {balance: ["msg"]}] into {bank: ["msg"], balance: ["msg"]}
          state.validationErrors = action.payload.reduce(
            (acc, currentErrorObj) => {
              const fieldName = Object.keys(currentErrorObj)[0]; // e.g., 'bank'
              acc[fieldName] = currentErrorObj[fieldName]; // Assign the array of messages
              return acc;
            },
            {}
          );
        } else {
          // It's a generic error message (string) or an unexpected payload
          state.error = action.payload || "Unknown error occurred.";
          state.validationErrors = {}; // Clear any previous structured errors
        }
      })

      // Handle update cash data
      .addCase(updateCashData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCashData.fulfilled, (state, action) => {
        const updatedItem = action.payload; // Payload is the updated item from the backend
        if (!state.entries || !Array.isArray(state.entries)) return;

        const index = state.entries.findIndex(
          (item) => item._id === updatedItem._id // Assuming _id from MongoDB
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
      })

      // Handle delete cash data
      .addCase(deleteCashData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCashData.fulfilled, (state, action) => {
        const deletedId = action.payload; // Payload is the ID of the deleted item

        // Filter out the deleted entry using its database ID
        state.entries = state.entries.filter((item) => item._id !== deletedId); // Assuming _id from MongoDB

        // Recalculate the total balance
        const newTotal = state.entries.reduce(
          (acc, item) => acc + Number(item.balance || 0),
          0
        );

        if (state.total) {
          state.total.balance = Number(newTotal.toFixed(2));
        }

        state.loading = false;
      })
      .addCase(deleteCashData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const {} = cashSlice.actions;
export default cashSlice.reducer;

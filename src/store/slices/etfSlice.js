import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { handleApiError } from "../../constants/handleApiError";
import { getAuthHeaders } from "../../utils/getAuthHeaders";
import { apiCallWithToast } from "../../utils/apiCallWithToast";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/etfs`;

export const fetchTrackedETFs = createAsyncThunk(
  "etf/fetchTrackedETFs",
  async (getAccessTokenSilently, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);
      const response = await axios.get(API_BASE_URL, { headers });

      if (!Array.isArray(response.data)) {
        return rejectWithValue(
          "Received invalid data format from backend. Expected an array of ETFs."
        );
      }
      return { trackedETFs: response.data };
    } catch (error) {
      if (error.message.includes("Authentication function")) {
        return rejectWithValue(error.message);
      }
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to fetch tracked ETFs."
      );
    }
  }
);

export const createTrackedETF = createAsyncThunk(
  "etf/createTrackedETFs",
  async ({ data, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);
      const res = await apiCallWithToast(
        axios.post(API_BASE_URL, data, { headers }),
        {
          loading: "Creating tracked ETF...",
          success: "Tracked ETF created successfully!",
          error: "Failed to create tracked ETF",
        }
      );

      return res.data;
    } catch (error) {
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to create tracked ETF"
      );
    }
  }
);

export const updateTrackedETF = createAsyncThunk(
  "etf/updateTrackedETF",
  async ({ data, documentId, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);
      const res = await apiCallWithToast(
        axios.put(`${API_BASE_URL}/${documentId}`, data, { headers }),
        {
          loading: "Updating tracked ETF...",
          success: "Tracked ETF updated successfully!",
          error: "Failed to update tracked ETF",
        }
      );

      return res.data;
    } catch (error) {
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to update tracked ETF."
      );
    }
  }
);

export const deleteTrackedETF = createAsyncThunk(
  "etf/deleteTrackedETF",
  async ({ documentId, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);
      await apiCallWithToast(
        axios.delete(`${API_BASE_URL}/${documentId}`, { headers }),
        {
          loading: "Deleting tracked ETF...",
          fulfilled: "Tracked ETF deleted successfully",
          rejected: "Failed to delete tracked ETF.",
        }
      );

      return documentId;
    } catch (error) {
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to delete tracked ETF"
      );
    }
  }
);

export const fetchEtfTransactions = createAsyncThunk(
  "etfs/fetchEtfTransactions",
  async (getAccessTokenSilently, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);

      const response = await axios.get(`${API_BASE_URL}/transactions`, {
        headers,
      });

      if (!Array.isArray(response.data)) {
        return rejectWithValue(
          "Received invalid data format from backend. Expected an array of ETFs."
        );
      }

      return response.data;
    } catch (error) {
      handleApiError(
        error,
        rejectWithValue,
        "Failed to fetch ETF transactions."
      );
    }
  }
);

export const createEtfTransaction = createAsyncThunk(
  "etfs/createEtfTransaction",
  async ({ data, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);

      const res = await apiCallWithToast(
        axios.post(`${API_BASE_URL}/transactions`, data, {
          headers,
        }),
        {
          loading: "Creating ETF transaction...",
          success: "New ETF transaction created successfully!",
          error: "Failed to create ETF transaction",
        }
      );

      return res.data;
    } catch (error) {
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to create ETF transaction."
      );
    }
  }
);

const etfSlice = createSlice({
  name: "etf",
  initialState: {
    trackedETFs: {
      data: [],
      loading: false,
      error: null,
    },
    etfTransactions: {
      data: [],
      loading: false,
      error: null,
    },
    validationErrors: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- FETCH TRACKED ETFs ---
      .addCase(fetchTrackedETFs.pending, (state) => {
        state.trackedETFs.loading = true;
        state.trackedETFs.error = null;
      })
      .addCase(fetchTrackedETFs.fulfilled, (state, action) => {
        state.trackedETFs.loading = false;
        state.trackedETFs.error = null;
        state.trackedETFs.data = action.payload.trackedETFs;
        state.validationErrors = {};
      })
      .addCase(fetchTrackedETFs.rejected, (state, action) => {
        state.trackedETFs.loading = false;
        if (
          action.payload &&
          typeof action.payload === "object" &&
          action.payload.validationErrors
        ) {
          state.trackedETFs.error =
            action.payload.message || "Failed to fetch ETFs due to validation.";
          state.validationErrors = action.payload.validationErrors;
        } else {
          state.trackedETFs.error =
            typeof action.payload === "string"
              ? action.payload
              : "Failed to fetch ETFs.";
          state.validationErrors = {};
        }
      })

      // --- CREATE TRACKED ETF ---
      .addCase(createTrackedETF.pending, (state) => {
        state.trackedETFs.loading = true;
        state.trackedETFs.error = null;
        state.validationErrors = {};
      })
      .addCase(createTrackedETF.fulfilled, (state, action) => {
        state.trackedETFs.loading = false;
        state.trackedETFs.error = null;
        // push the new ETF item to the data array
        state.trackedETFs.data.push(action.payload);
        state.validationErrors = {};
      })
      .addCase(createTrackedETF.rejected, (state, action) => {
        state.trackedETFs.loading = false;
        if (
          Array.isArray(action.payload) &&
          action.payload.every(
            (item) =>
              typeof item === "object" &&
              Object.keys(item).length === 1 &&
              Array.isArray(Object.values(item)[0])
          )
        ) {
          state.validationErrors = action.payload.reduce(
            (acc, currentErrorObj) => {
              const fieldName = Object.keys(currentErrorObj)[0];
              acc[fieldName] = currentErrorObj[fieldName];
              return acc;
            },
            {}
          );
          state.trackedETFs.error = null;
        } else {
          state.trackedETFs.error = action.payload || "Unknown error occurred.";
          state.validationErrors = {};
        }
      })

      // --- UPDATE TRACKED ETF ---
      .addCase(updateTrackedETF.pending, (state) => {
        state.trackedETFs.loading = true;
        state.trackedETFs.error = null;
      })
      .addCase(updateTrackedETF.fulfilled, (state, action) => {
        state.trackedETFs.loading = false;
        state.trackedETFs.error = null;

        const updatedItem = action.payload;
        if (!Array.isArray(state.trackedETFs.data)) return;

        const index = state.trackedETFs.data.findIndex(
          (item) => item._id === updatedItem._id
        );
        if (index !== -1) {
          state.trackedETFs.data[index] = updatedItem;
        }
      })
      .addCase(updateTrackedETF.rejected, (state, action) => {
        state.trackedETFs.loading = false;
        state.trackedETFs.error = action.payload || "Unknown error occurred.";
      })

      // --- DELETE TRACKED ETF ---
      .addCase(deleteTrackedETF.pending, (state) => {
        state.trackedETFs.loading = true;
        state.trackedETFs.error = null;
      })
      .addCase(deleteTrackedETF.fulfilled, (state, action) => {
        state.trackedETFs.loading = false;
        state.trackedETFs.error = null;

        const deletedId = action.payload;
        if (Array.isArray(state.trackedETFs.data)) {
          state.trackedETFs.data = state.trackedETFs.data.filter(
            (item) => item._id !== deletedId
          );
        }
      })
      .addCase(deleteTrackedETF.rejected, (state, action) => {
        state.trackedETFs.loading = false;
        state.trackedETFs.error = action.payload || "Unknown error occurred.";
      })

      // --- FETCH ETF TRANSACTIONS ---
      .addCase(fetchEtfTransactions.pending, (state) => {
        state.etfTransactions.loading = true;
        state.etfTransactions.error = null;
      })
      .addCase(fetchEtfTransactions.fulfilled, (state, action) => {
        state.etfTransactions.loading = false;
        state.etfTransactions.error = null;
        state.etfTransactions.data = action.payload;
        state.validationErrors = {};
      })
      .addCase(fetchEtfTransactions.rejected, (state, action) => {
        state.etfTransactions.loading = false;
        if (
          Array.isArray(action.payload) &&
          action.payload.every(
            (item) =>
              typeof item === "object" &&
              Object.keys(item).length === 1 &&
              Array.isArray(Object.values(item)[0])
          )
        ) {
          state.validationErrors = action.payload.reduce(
            (acc, currentErrorObj) => {
              const fieldName = Object.keys(currentErrorObj)[0];
              acc[fieldName] = currentErrorObj[fieldName];
              return acc;
            },
            {}
          );
          state.etfTransactions.error = null;
        } else {
          state.etfTransactions.error =
            action.payload || "Unknown error occurred.";
          state.validationErrors = {};
        }
      })

      // --- CREATE ETF TRANSACTION ---
      .addCase(createEtfTransaction.pending, (state) => {
        state.etfTransactions.loading = true;
        state.etfTransactions.error = null;
      })
      .addCase(createEtfTransaction.fulfilled, (state, action) => {
        state.etfTransactions.loading = false;
        state.etfTransactions.error = null;
        // push new transaction to data array
        state.etfTransactions.data.push(action.payload);
        state.validationErrors = {};
      })
      .addCase(createEtfTransaction.rejected, (state, action) => {
        state.etfTransactions.loading = false;
        state.etfTransactions.error =
          action.payload || "Unknown error occurred.";
      });
  },
});

export const {} = etfSlice;
export default etfSlice.reducer;

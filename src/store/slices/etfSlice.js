import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { handleApiError } from "../../constants/handleApiError";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/etfs`;

export const fetchTrackedETFs = createAsyncThunk(
  "etf/fetchTrackedETFs",
  async (getAccessTokenSilently, { rejectWithValue }) => {
    try {
      if (
        !getAccessTokenSilently ||
        typeof getAccessTokenSilently !== "function"
      ) {
        throw new Error(
          "Authentication function (getAccessTokenSilently) not provided to fetchTrackedETFs."
        );
      }

      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      const response = await axios.get(API_BASE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const backendResponse = response.data;

      // 1. Validate the structure expected from the backend
      if (!Array.isArray(backendResponse)) {
        console.error(
          "Unexpected backend response format for fetchTrackedETFs: Expected an array.",
          backendResponse
        );
        return rejectWithValue(
          "Received invalid data format from backend. Expected an array of ETFs."
        );
      }

      // 2. Directly use the data provided by the backend
      const trackedETFs = backendResponse;

      return {
        trackedETFs: trackedETFs,
      };
    } catch (error) {
      // Catch specific error from authentication function check
      if (
        error instanceof Error &&
        error.message.includes("Authentication function")
      ) {
        return rejectWithValue(error.message);
      }
      return handleApiError(error, rejectWithValue, "Failed to fetch etf data");
    }
  }
);

export const createTrackedETF = createAsyncThunk(
  "etf/createTrackedETFs",
  async ({ data, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      if (
        !getAccessTokenSilently ||
        typeof getAccessTokenSilently !== "function"
      ) {
        throw new Error(
          "Authentication function (getAccessTokenSilently) not provided to createTrackedETF."
        );
      }

      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      const res = await toast.promise(
        axios.post(API_BASE_URL, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        {
          loading: "Created tracked ETF...",
          fulfilled: "Tracked ETF created successfully!",
          rejected: "Failed to create tracked etf",
        },
        {
          style: {
            minWidth: "250px",
          },
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
      if (
        !getAccessTokenSilently ||
        typeof getAccessTokenSilently !== "function"
      ) {
        throw new Error(
          "Authentication function (getAccessTokenSilently) not provided to updateCashData."
        );
      }

      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      const res = await toast.promise(
        axios.put(`${API_BASE_URL}/${documentId}`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        {
          loading: "Updating tracked ETF...",
          success: "Tracked ETF updated successfully!",
          error: "Failed to update tracked ETF",
        },
        {
          style: {
            minWidth: "250px",
          },
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
      if (
        !getAccessTokenSilently ||
        typeof getAccessTokenSilently !== "function"
      ) {
        throw new Error(
          "Authentication function (getAccessTokenSilently) not provided to deleteTrackedETF."
        );
      }
      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      await toast.promise(
        axios.delete(`${API_BASE_URL}/${documentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        {
          loading: "Deleting tracked ETF...",
          fulfilled: "Tracked ETF deleted successfully",
          rejected: "Failed to delete tracked ETF.",
        },
        {
          style: {
            minWidth: "250px",
          },
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

const etfSlice = createSlice({
  name: "etf",
  initialState: {
    trackedETFs: [],
    loading: false,
    error: null,
    validationErrors: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch tracked ETF data
      .addCase(fetchTrackedETFs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrackedETFs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.trackedETFs = action.payload.trackedETFs;
        state.validationErrors = {};
      })
      .addCase(fetchTrackedETFs.rejected, (state, action) => {
        state.loading = false;
        if (
          action.payload &&
          typeof action.payload === "object" &&
          action.payload.validationErrors
        ) {
          state.error =
            action.payload.message || "Failed to fetch ETFs due to validation.";
          state.validationErrors = action.payload.validationErrors;
        } else {
          state.error =
            typeof action.payload === "string"
              ? action.payload
              : "Failed to fetch ETFs."; // Generic fallback for other errors
          state.validationErrors = {}; // Clear validation errors if not a validation specific rejection
        }
      })

      // Handle create tracked ETF data
      .addCase(createTrackedETF.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(createTrackedETF.fulfilled, (state, action) => {
        state.trackedETFs.push(action.payload);
        state.loading = false;
        state.validationErrors = {};
      })
      .addCase(createTrackedETF.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
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
        } else {
          state.error = action.payload || "Unkown error occured.";
          state.validationErrors = {};
        }
      })

      // Handle update tracked ETF data
      .addCase(updateTrackedETF.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrackedETF.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        if (!state.trackedETFs || !Array.isArray(state.trackedETFs)) return;

        const index = state.trackedETFs.findIndex(
          (item) => item._id === updatedItem._id
        );

        if (index !== -1) {
          state.trackedETFs[index] = updatedItem;
        }

        state.loading = false;
      })
      .addCase(updateTrackedETF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unkown error";
      })

      // Handle delete tracked ETF data
      .addCase(deleteTrackedETF.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrackedETF.fulfilled, (state, action) => {
        const deletedId = action.payload;

        state.trackedETFs = state.trackedETFs.filter(
          (item) => item._id !== deletedId
        );

        state.loading = false;
      })
      .addCase(deleteTrackedETF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const {} = etfSlice;
export default etfSlice.reducer;

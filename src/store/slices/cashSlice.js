import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api/cash";

// Helper function for consistent error handling
const handleApiError = (error, rejectWithValue, defaultMessage) => {
  console.error("API call failed:", error);
  // Axios error structure
  if (error.response) {
    // Server responded with a status other than 2xx
    return rejectWithValue(error.response.data.message || defaultMessage);
  } else if (error.request) {
    // Request was made but no response received
    return rejectWithValue(
      "No response from server. Check network connection."
    );
  } else {
    // Something else happened in setting up the request
    return rejectWithValue(error.message || defaultMessage);
  }
};

export const fetchCashData = createAsyncThunk(
  "cash/fetchCashData",
  // getAccessTokenSilently is passed from the component dispatching this thunk
  async (getAccessTokenSilently, { rejectWithValue }) => {
    try {
      if (
        !getAccessTokenSilently ||
        typeof getAccessTokenSilently !== "function"
      ) {
        throw new Error(
          "Authentication function (getAccessTokenSilently) not provided to fetchCashData."
        );
      }

      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        // scope: 'read:cash', // If your API requires specific read scopes
      });

      const response = await axios.get(API_BASE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const backendResponse = response.data;

      // 1. Validate the structure expected from the backend
      if (
        !backendResponse ||
        !Array.isArray(backendResponse.entries) ||
        !backendResponse.total
      ) {
        console.error(
          "Unexpected backend response format for fetchCashData:",
          backendResponse
        );
        return rejectWithValue(
          "Received invalid data format from backend. Expected 'entries' array and 'total' object."
        );
      }

      // 2. Directly use the data provided by the backend
      const cashEntries = backendResponse.entries;
      const totalSummary = backendResponse.total; // Use the total object from backend

      return {
        entries: cashEntries,
        total: totalSummary,
      };
    } catch (error) {
      // Catch specific error from authentication function check
      if (
        error instanceof Error &&
        error.message.includes("Authentication function")
      ) {
        return rejectWithValue(error.message);
      }
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to fetch cash data"
      );
    }
  }
);

export const createCashData = createAsyncThunk(
  "cash/createCashData",
  // Pass both the data to create and getAccessTokenSilently
  async ({ data, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      if (
        !getAccessTokenSilently ||
        typeof getAccessTokenSilently !== "function"
      ) {
        throw new Error(
          "Authentication function (getAccessTokenSilently) not provided to createCashData."
        );
      }

      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      const res = await toast.promise(
        axios.post(
          API_BASE_URL,
          data, // Data to send in the request body
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        {
          loading: "Creating bank account...",
          success: "New Bank Account created successfully!",
          error: "Failed to create bank account",
        },
        {
          style: {
            minWidth: "250px",
          },
        }
      );

      // Assuming your backend POST /api/cash returns the newly created item
      return res.data; // This will be the new entry added to state.entries
    } catch (error) {
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to create bank account"
      );
    }
  }
);

export const updateCashData = createAsyncThunk(
  "cash/updateCashData",
  // Pass data, documentId, and getAccessTokenSilently
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
        axios.put(
          `${API_BASE_URL}/${documentId}`, // PUT request to specific ID
          data, // Data to send in the request body
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        {
          loading: "Updating bank account...",
          success: "Bank Account updated successfully!",
          error: "Failed to update bank account",
        },
        {
          style: {
            minWidth: "250px",
          },
        }
      );

      // Assuming your backend PUT /api/cash/:id returns the updated item
      return res.data; // This will be the updated entry
    } catch (error) {
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to update bank account"
      );
    }
  }
);

export const deleteCashData = createAsyncThunk(
  "cash/deleteCashData",
  // Pass documentId and getAccessTokenSilently
  async ({ documentId, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      if (
        !getAccessTokenSilently ||
        typeof getAccessTokenSilently !== "function"
      ) {
        throw new Error(
          "Authentication function (getAccessTokenSilently) not provided to deleteCashData."
        );
      }

      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      const res = await toast.promise(
        axios.delete(
          `${API_BASE_URL}/${documentId}`, // DELETE request to specific ID
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        {
          loading: "Deleting bank account...",
          success: "Bank Account deleted successfully!",
          error: "Failed to delete bank account",
        },
        {
          style: {
            minWidth: "250px",
          },
        }
      );

      // If the deletion was successful, return the documentId so the reducer can remove it from state
      return documentId;
    } catch (error) {
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to delete bank account"
      );
    }
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
        const { entries, total } = action.payload; // Payload should now directly match this structure
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

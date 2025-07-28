import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { handleApiError } from "../../constants/handleApiError";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/cash`;

export const fetchCashData = createAsyncThunk(
  "cash/fetchCashData",
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
        axios.post(API_BASE_URL, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
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
        // toast.promise handles showing success/error messages
        axios.put(`${API_BASE_URL}/${documentId}`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        {
          loading: "Updating bank account...",
          success: "Bank Account updated successfully!",
          error: "Failed to update bank account", // <--- This is the generic toast for any error
        },
        {
          style: {
            minWidth: "250px",
          },
        }
      );

      return res.data; // Assuming your backend PUT /api/cash/:id returns the updated item
    } catch (error) {
      // handleApiError will now return either the structured errors array (for 400)
      // or a generic message string. toast.promise handles the message.
      // We don't need to explicitly return the structured errors to the Redux state for update.
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
    total: 0,
    loading: false,
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

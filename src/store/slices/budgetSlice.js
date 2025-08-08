import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { handleApiError } from "../../constants/handleApiError";
import { getAuthHeaders } from "../../utils/getAuthHeaders";
import { apiCallWithToast } from "../../utils/apiCallWithToast";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/budget`;

export const fetchBudgetData = createAsyncThunk(
  "budget/fetchBudgetData",
  async (getAccessTokenSilently, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);
      const res = await apiCallWithToast(axios.get(API_BASE_URL, { headers }), {
        loading: "Fetching budget...",
        success: "Budget fetched successfully!",
        error: "Failed to fetch budget",
      });
      const resData = res.data;

      return resData;
    } catch (error) {
      if (error.message.includes("Authentication function")) {
        return rejectWithValue(error.message);
      }
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to fetch budget data"
      );
    }
  }
);

export const createBudgetItem = createAsyncThunk(
  "budget/createBudgetItem",
  async ({ getAccessTokenSilently, data }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);
      const res = await apiCallWithToast(
        axios.post(API_BASE_URL, data, { headers }),
        {
          loading: "Creating budget item...",
          success: "Budget item created successfully!",
          error: "Failed to create budget item",
        }
      );

      return res.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue, "Failed to create tab");
    }
  }
);

export const updateBudgetItem = createAsyncThunk(
  "budget/updateBudgetItem",
  async ({ getAccessTokenSilently, data, id }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);
      const res = await apiCallWithToast(
        axios.put(`${API_BASE_URL}/${id}`, data, { headers }),
        {
          loading: "Updating budget item...",
          success: "Budget item updated successfully!",
          error: "Failed to update budget item.",
        }
      );

      return res.data;
    } catch (err) {
      console.log(err.response.data.message);
      return handleApiError(
        err,
        rejectWithValue,
        "Failed to update budget item"
      );
    }
  }
);

export const deleteBudgetItem = createAsyncThunk(
  "budget/deleteBudgetItem",
  async ({ getAccessTokenSilently, documentId }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);
      const res = await apiCallWithToast(
        axios.delete(`${API_BASE_URL}/${documentId}`, { headers }),
        {
          loading: "Deleting budget item...",
          success: "Budget item deleted successfuly!",
          error: "Failed to delete budget item",
        }
      );

      return res.data;
    } catch (err) {
      return handleApiError(
        err,
        rejectWithValue,
        "Failed to delete budget item"
      );
    }
  }
);

export const createBudgetTab = createAsyncThunk(
  "budget/createBudgetTab",
  async ({ getAccessTokenSilently, tabName }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);
      const res = await apiCallWithToast(
        axios.post(`${API_BASE_URL}/tabs`, { tabName }, { headers }),
        {
          loading: "Adding budget tab...",
          success: "Budget tab added successfully!",
          error: "Failed to add budget tab",
        }
      );

      return {
        newTab: res.data.newTab,
        newSummaryItem: res.data.newSummaryItem,
      };
    } catch (error) {
      return handleApiError(
        error,
        rejectWithValue,
        "Failed to create budget tab"
      );
    }
  }
);

export const renameBudgetTab = createAsyncThunk(
  "budget/renameBudgetTab",
  async ({ getAccessTokenSilently, data, id }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);
      const res = await apiCallWithToast(
        axios.put(`${API_BASE_URL}/tabs/${id}`, data, { headers }),
        {
          loading: "Renaming budget tab...",
          success: "Budget tab renamed successfully!",
          error: "Failed to rename budget tab",
        }
      );

      return res.data;
    } catch (err) {
      return handleApiError(
        err,
        rejectWithValue,
        "Failed to update budget tab name"
      );
    }
  }
);

export const deleteBudgetTab = createAsyncThunk(
  "budget/deleteBudgetTab",
  async ({ getAccessTokenSilently, id }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders(getAccessTokenSilently);
      const res = await apiCallWithToast(
        axios.delete(`${API_BASE_URL}/tabs/${id}`, { headers }),
        {
          loading: "Deleting budget tab...",
          success: "Budget tab deleted successfully!",
          error: "Failed to delete budget tab",
        }
      );

      return res.data;
    } catch (err) {
      return handleApiError(
        err,
        rejectWithValue,
        "Failed to delete budget tab"
      );
    }
  }
);

const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    budget: {
      tabs: [],
    },
    loading: false,
    hasFetched: false,
    error: null,
    validationErrors: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch budget data
      .addCase(fetchBudgetData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetData.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = true;
        state.error = null;
        state.budget = action.payload;
      })
      .addCase(fetchBudgetData.rejected, (state, action) => {
        state.loading = false;
        state.hasFetched = true;
        state.error = action.payload || "Something went wrong.";
      })

      // Handle add budget item
      .addCase(createBudgetItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBudgetItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const { item, summaryItem } = action.payload;
        // 1. Add new item to the correct source tab
        const sourceTab = state.budget.tabs.find(
          (tab) => tab._id === item.sourceTab
        );
        if (sourceTab) {
          sourceTab.items.push(item);
        }

        // 2. Update existing summary item in Main tab (if applicable)
        if (summaryItem) {
          const mainTab = state.budget.tabs.find((tab) => tab.name === "Main");
          if (mainTab) {
            const index = mainTab.items.findIndex(
              (i) => i._id === summaryItem._id
            );
            if (index !== -1) {
              mainTab.items[index] = summaryItem;
            } else {
              // If not found for some reason, optionally push it in
              mainTab.items.push(summaryItem);
            }
          }
        }
      })
      .addCase(createBudgetItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      })

      // Handle update budget item
      .addCase(updateBudgetItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBudgetItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const { updatedItem, updatedSummaryItem } = action.payload;

        // Update the main item
        for (const tab of state.budget.tabs) {
          const itemIndex = tab.items.findIndex(
            (item) => item._id === updatedItem._id
          );
          if (itemIndex !== -1) {
            tab.items[itemIndex] = updatedItem;
            break;
          }
        }

        // If summary item is returned, update it too
        if (updatedSummaryItem) {
          for (const tab of state.budget.tabs) {
            const itemIndex = tab.items.findIndex(
              (item) => item._id === updatedSummaryItem._id
            );
            if (itemIndex !== -1) {
              tab.items[itemIndex] = updatedSummaryItem;
              break;
            }
          }
        }
      })
      .addCase(updateBudgetItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      })

      // Handle delete budget item
      .addCase(deleteBudgetItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBudgetItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        const { deletedItemId, updatedSummaryItem } = action.payload;

        // Loop through tabs to find the one that has the item to delete
        for (const tab of state.budget.tabs) {
          const itemIndex = tab.items.findIndex(
            (item) => item._id === deletedItemId
          );

          if (itemIndex !== -1) {
            // Remove the item
            tab.items.splice(itemIndex, 1);
            break;
          }
        }

        // If there is an updated summary item, replace the existing one in the "Main" tab
        if (updatedSummaryItem) {
          const mainTab = state.budget.tabs.find((tab) => tab.name === "Main");

          if (mainTab) {
            const summaryIndex = mainTab.items.findIndex(
              (item) =>
                item.isSummary &&
                item.sourceTab === updatedSummaryItem.sourceTab
            );

            if (summaryIndex !== -1) {
              mainTab.items[summaryIndex] = updatedSummaryItem;
            }
          }
        }
      })
      .addCase(deleteBudgetItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      })

      // Handle creating a budget tab
      .addCase(createBudgetTab.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(createBudgetTab.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        const { newTab, newSummaryItem } = action.payload;

        // Add new tab
        state.budget.tabs.push(newTab);

        // Add new summary item to Main tab
        const mainTab = state.budget.tabs[0];
        if (mainTab) mainTab.items.push(newSummaryItem);
      })
      .addCase(createBudgetTab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      })

      // Handle rename a budget tab
      .addCase(renameBudgetTab.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(renameBudgetTab.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;

        const { renamedTab, renamedSummaryItem } = action.payload;

        // Update tab name
        state.budget.tabs = state.budget.tabs.map((tab) => {
          if (tab._id.toString() === renamedTab._id.toString()) {
            return { ...tab, name: renamedTab.name };
          }
          return tab;
        });

        // Update summary item name
        const mainTab = state.budget.tabs[0];
        mainTab.items = mainTab.items.map((item) => {
          if (item._id.toString() === renamedSummaryItem._id.toString()) {
            return { ...item, item: renamedSummaryItem.item };
          }
          return item;
        });
      })
      .addCase(renameBudgetTab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      })

      // Handle deleting a budget tab
      .addCase(deleteBudgetTab.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteBudgetTab.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;

        const { deletedTabId, deletedSummaryItemId } = action.payload;

        // Delete tab
        state.budget.tabs = state.budget.tabs.filter(
          (tab) => tab._id !== deletedTabId
        );

        // Delete summary item from Main tab
        const mainTab = state.budget.tabs[0];
        if (mainTab)
          mainTab.items = mainTab.items.filter(
            (item) => item._id.toString() !== deletedSummaryItemId
          );
      })
      .addCase(deleteBudgetTab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      });
  },
});

export const {} = budgetSlice.actions;
export default budgetSlice.reducer;

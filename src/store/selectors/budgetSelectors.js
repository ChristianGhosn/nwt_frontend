import { createSelector } from "@reduxjs/toolkit";

const selectBudgetState = (state) => state.budget;

export const selectBudgetData = createSelector(
  [selectBudgetState],
  (budget) => ({
    data: budget.budget,
    loading: budget.loading,
    hasFetched: budget.hasFetched,
    error: budget.error,
  })
);

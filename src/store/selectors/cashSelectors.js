import { createSelector } from "@reduxjs/toolkit";

const selectCashState = (state) => state.cash;

export const selectCashData = createSelector([selectCashState], (cash) => ({
  data: cash.entries,
  total: cash.total,
  loading: cash.loading,
  hasFetched: cash.hasFetched,
  error: cash.error,
}));

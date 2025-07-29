import { createSelector } from "@reduxjs/toolkit";

const selectEtfState = (state) => state.etf;

export const selectTrackedEtfs = createSelector([selectEtfState], (etf) => ({
  data: etf.trackedETFs.data,
  loading: etf.trackedETFs.loading,
  hasFetched: etf.trackedETFs.hasFetched,
  error: etf.trackedETFs.error,
}));

export const selectEtfTransactions = createSelector(
  [selectEtfState],
  (etf) => ({
    data: etf.etfTransactions.data,
    loading: etf.etfTransactions.loading,
    hasFetched: etf.etfTransactions.hasFetched,
    error: etf.etfTransactions.error,
  })
);

export const selectEtfValidationErrors = createSelector(
  [selectEtfState],
  (etf) => etf.validationErrors
);

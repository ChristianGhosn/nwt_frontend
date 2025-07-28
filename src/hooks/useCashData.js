import { useAuthenticatedFetchSlice } from "./useAuthenticatedFetchSlice";
import { fetchCashData } from "../store/slices/cashSlice";

export const useCashData = () =>
  useAuthenticatedFetchSlice(fetchCashData, (state) => ({
    data: state.cash.entries,
    total: state.cash.total,
    loading: state.cash.loading,
    error: state.cash.error,
  }));

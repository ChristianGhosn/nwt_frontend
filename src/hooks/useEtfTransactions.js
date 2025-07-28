import { useAuthenticatedFetchSlice } from "./useAuthenticatedFetchSlice";
import { fetchEtfTransactions } from "../store/slices/etfSlice";

export const useEtfTransactions = () =>
  useAuthenticatedFetchSlice(fetchEtfTransactions, (state) => ({
    data: state.etf.etfTransactions.data,
    loading: state.etf.loading,
    error: state.etf.error,
  }));

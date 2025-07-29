import { useAuthenticatedFetchSlice } from "./useAuthenticatedFetchSlice";
import { fetchEtfTransactions } from "../store/slices/etfSlice";
import { selectEtfTransactions } from "../store/selectors/etfSelectors";

export const useEtfTransactions = () =>
  useAuthenticatedFetchSlice(fetchEtfTransactions, selectEtfTransactions);

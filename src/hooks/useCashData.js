import { useAuthenticatedFetchSlice } from "./useAuthenticatedFetchSlice";
import { fetchCashData } from "../store/slices/cashSlice";
import { selectCashData } from "../store/selectors/cashSelectors";

export const useCashData = () =>
  useAuthenticatedFetchSlice(fetchCashData, selectCashData);

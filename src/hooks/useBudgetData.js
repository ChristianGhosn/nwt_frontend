import { useAuthenticatedFetchSlice } from "./useAuthenticatedFetchSlice";
import { fetchBudgetData } from "../store/slices/budgetSlice";
import { selectBudgetData } from "../store/selectors/budgetSelectors";

export const useBudgetData = () =>
  useAuthenticatedFetchSlice(fetchBudgetData, selectBudgetData);

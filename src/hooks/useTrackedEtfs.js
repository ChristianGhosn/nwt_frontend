import { useAuthenticatedFetchSlice } from "./useAuthenticatedFetchSlice";
import { fetchTrackedETFs } from "../store/slices/etfSlice";

import { selectTrackedEtfs } from "../store/selectors/etfSelectors";

export const useTrackedEtfs = () =>
  useAuthenticatedFetchSlice(fetchTrackedETFs, selectTrackedEtfs);

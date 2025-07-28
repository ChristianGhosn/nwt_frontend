import { useAuthenticatedFetchSlice } from "./useAuthenticatedFetchSlice";
import { fetchTrackedETFs } from "../store/slices/etfSlice";

export const useTrackedEtfs = () =>
  useAuthenticatedFetchSlice(fetchTrackedETFs, (state) => ({
    data: state.etf.trackedETFs.data,
    loading: state.etf.loading,
    error: state.etf.error,
  }));

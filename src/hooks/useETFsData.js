import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import { fetchTrackedETFs } from "../store/slices/etfSlice";

export const useETFsData = () => {
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const { trackedETFs, loading, error } = useSelector((state) => state.etf);

  useEffect(() => {
    if (
      trackedETFs.length === 0 &&
      !loading &&
      !error &&
      getAccessTokenSilently
    ) {
      dispatch(fetchTrackedETFs(getAccessTokenSilently));
    }
  }, [dispatch, trackedETFs.length, loading, error, getAccessTokenSilently]);

  return { trackedETFs, loading, error };
};

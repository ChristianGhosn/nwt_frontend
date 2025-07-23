import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import { fetchCashData } from "../store/slices/cashSlice";

export const useCashData = () => {
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const { entries, total, loading, error } = useSelector((state) => state.cash);

  useEffect(() => {
    if (entries.length === 0 && !loading && !error && getAccessTokenSilently) {
      dispatch(fetchCashData(getAccessTokenSilently));
    }
  }, [dispatch, entries.length, loading, error, getAccessTokenSilently]);

  return { entries, total, loading, error };
};

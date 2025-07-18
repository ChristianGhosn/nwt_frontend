import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import { fetchCashData } from "../store/slices/cashSlice";

export const useCashData = () => {
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const { data: cashData, loading, error } = useSelector((state) => state.cash);

  useEffect(() => {
    if (user?.sub && cashData.length === 0 && !loading) {
      dispatch(fetchCashData(user.sub));
    }
  }, [dispatch, user, cashData, loading]);

  return { cashData, loading, error };
};

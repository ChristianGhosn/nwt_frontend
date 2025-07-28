import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * A generic hook to dispatch Redux async actions with Auth0 token.
 *
 * @param {Function} fetchAction - The thunk to dispatch.
 * @param {Function} selector - Function that selects data slice from store.
 */

export const useAuthenticatedFetchSlice = (fetchAction, selector) => {
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();

  const sliceData = useSelector(selector);
  const { loading, error } = sliceData;

  useEffect(() => {
    if (
      !loading &&
      !error &&
      getAccessTokenSilently &&
      (Array.isArray(sliceData?.data)
        ? sliceData.data.length === 0
        : !sliceData?.data)
    ) {
      dispatch(fetchAction(getAccessTokenSilently));
    }
  }, [
    dispatch,
    sliceData?.data?.length,
    loading,
    error,
    getAccessTokenSilently,
  ]);

  return sliceData;
};

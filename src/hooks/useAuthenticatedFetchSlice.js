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
      !sliceData?.hasFetched &&
      !loading &&
      !error &&
      getAccessTokenSilently
    ) {
      dispatch(fetchAction(getAccessTokenSilently));
    }
  }, [dispatch, sliceData?.hasFetched, loading, error, getAccessTokenSilently]);

  return sliceData;
};

export const handleApiError = (error, rejectWithValue, defaultMessage) => {
  console.error("API call failed:", error);

  // Axios error structure
  if (error.response) {
    // Server responded with a status other than 2xx
    // Check for 400 status code AND if the 'errors' property exists and is an array
    if (
      error.response.status === 400 &&
      Array.isArray(error.response.data.errors)
    ) {
      // Reject with the structured errors array so the calling component can consume it
      return rejectWithValue(error.response.data.errors);
    }

    // For other backend error messages (e.g., general error messages for 401, 403, 500 without structured errors)
    // or if the 400 response just has a 'message' but no 'errors' array.
    return rejectWithValue(error.response.data.message || defaultMessage);
  } else if (error.request) {
    // Request was made but no response received (e.g., server down, network issue)
    return rejectWithValue(
      "No response from server. Check network connection."
    );
  } else {
    // Something else happened in setting up the request that triggered an Error
    return rejectWithValue(error.message || defaultMessage);
  }
};

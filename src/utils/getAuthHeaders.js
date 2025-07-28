export async function getAuthHeaders(getAccessTokenSilently) {
  if (!getAccessTokenSilently || typeof getAccessTokenSilently !== "function") {
    throw new Error(
      "Authentication function (getAccessTokenSilently) not provided."
    );
  }
  const token = await getAccessTokenSilently({
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  });

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

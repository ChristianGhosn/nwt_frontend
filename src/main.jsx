import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import { store } from "./store/index";

createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    }}
  >
    <Provider store={store}>
      <HashRouter>
        <App />
        <Toaster
          position="top-right" // Adjust as needed
          reverseOrder={false}
          toastOptions={{
            // Global default options for toasts
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
            success: {
              duration: 3000,
              theme: {
                primary: "green",
                secondary: "black",
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: "red",
                secondary: "black",
              },
            },
          }}
        />
      </HashRouter>
    </Provider>
  </Auth0Provider>
);

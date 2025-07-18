import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App.jsx";
import { store } from "./store/index";

createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    }}
  >
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </Auth0Provider>
);

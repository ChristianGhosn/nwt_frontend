import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import { Auth0Provider } from "@auth0/auth0-react";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: "http://localhost:5173",
    }}
  >
    <HashRouter>
      <App />
    </HashRouter>
  </Auth0Provider>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./index.css";
import { useAuthStore } from "./store/useAuthStore";

// Bootstrap auth from the Supabase session (handles refresh, Google redirect, logout).
useAuthStore.getState().initAuth();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

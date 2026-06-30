import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./index.css";
import { useAuthStore } from "./store/useAuthStore";
import { useProductStore } from "./store/useProductStore";

// Bootstrap auth from the Supabase session (handles refresh, Google redirect, logout).
useAuthStore.getState().initAuth();

// Load the storefront catalog from Supabase (falls back to the mock catalog).
useProductStore.getState().init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

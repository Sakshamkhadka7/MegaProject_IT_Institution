import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { IntructorProvider } from "./context/IntructorProvider.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <IntructorProvider>
      <App />
      <ToastContainer/>
    </IntructorProvider>
  </BrowserRouter>,
);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MusicProvider } from "./context/MusicContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MusicProvider>
          <App />
          <ToastContainer position="top-center" theme="dark" autoClose={3000} />
        </MusicProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

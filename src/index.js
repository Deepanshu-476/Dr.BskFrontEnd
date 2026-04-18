import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ThemeProvider, createTheme } from "@mui/material/styles";



const theme = createTheme({
  palette: {
    primary: { main: "#61171b" },
    secondary: { main: "#6b7280" },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // ✅ If you want NO double PageView logs in dev, comment StrictMode
  // <React.StrictMode>
  <HashRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>          
          <App />
        </ThemeProvider>
      </PersistGate>
      <ToastContainer autoClose={1000} />
    </Provider>
  </HashRouter>
  // </React.StrictMode>
);
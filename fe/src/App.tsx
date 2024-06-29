import { Suspense } from "react";
import "./global.css";

import { useScrollToTop } from "./hooks/use-scroll-to-top";

import Router from "./routes/sections";
import ThemeProvider from "./theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import LayoutSplashScreen from "layouts/dashboard/common/LayoutSplashScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider>
        <ToastContainer />
        <Suspense>
          <Router />
        </Suspense>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

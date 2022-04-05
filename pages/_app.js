import React from "react";
import store from "../store";
import AppWrapper from "../AppWrapper";
import CustomWrrper from "CustomWrrper";
import ErrorBoundary from "../ErrorBoundary";
// import { runFbPixelEvent } from "../services/utils";

import "slick-carousel/slick/slick.css";
import "react-toastify/dist/ReactToastify.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-input-range/lib/css/index.css";
import "../scss/style.scss";

function MyApp({ Component, pageProps }) {
  // const {
  //   general: { fbPixel },
  // } = store.getState();

  // useEffect(() => {
  //   if (fbPixel) {
  //     fbq('init', fbPixel)
  //     runFbPixelEvent({ name: "ViewContent" })
  //   }
  // }, [fbPixel])

  return (
    <ErrorBoundary>
      <AppWrapper>
        <CustomWrrper Component={Component} pageProps={pageProps} />
      </AppWrapper>
    </ErrorBoundary>
  );
}

export default MyApp;

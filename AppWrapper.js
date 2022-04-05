import { useEffect } from "react";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";

import store from "./store";
import { url } from "./helper";
import { AddCartToken } from "./store/token";

// import {
//   setDomain,
//   setSocial,
//   setFbPixel,
//   setPopup,
//   setCustomJs,
//   setBackorders,
//   setSlideImages,
//   setCasheVersion,
//   setTranslations,
//   setStoreConfigs,
// } from "./store/general";

// import { changeCurrency, setCurrencies } from "./store/currency";

// import { setLocaleList, changeLocale } from "./store/locale";

function AppWrapper({ children }) {
  const { dispatch } = store;
  const state = store.getState();
  // const { cartToken, locale } = state;
  // pageProps.locale = state.locale;
  function checkIfImageExists(url) {
    const img = new Image();
    img.src = url;

    let detect = new Promise((resolve) => {
      if (img.complete) {
        resolve(true);
      }
      img.onload = () => {
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
    });

    return detect;
  }

  // function customSettingsApi() {
  //   fetch(`${url}/db/custom-settingss?locale=${locale.code}`)
  //     .then((response) => response.json())
  //     .then((props) => {
  //       const { channel_info, api_token } = props;
  //       if (cartToken.cartToken == "") {
  //         dispatch(AddCartToken(api_token));
  //       }

  //       if (channel_info[0]) {
  //         const {
  //           locales,
  //           currencies,
  //           base_currency_id,
  //           default_locale_id,
  //           // url_full_mode,
  //         } = channel_info[0];

  //         dispatch(setLocaleList(locales));
  //         dispatch(setCurrencies(currencies));

  //         if (!state?.locale?.defaultLocale?.code) {
  //           dispatch(changeLocale(default_locale_id));
  //         }

  //         if (!state?.currency?.current?.code) {
  //           dispatch(changeCurrency(base_currency_id));
  //         }
  //       }

  //       dispatch(setStoreConfigs(props.store_info));
  //       dispatch(setTranslations(props.translations));
  //       dispatch(setBackorders(props.Backorders));
  //       dispatch(setCustomJs(props.custom_js));
  //       dispatch(setFbPixel(props.facebook_pixel_id));
  //       dispatch(setPopup(props.popup));
  //       dispatch(setSlideImages(props.sliders));
  //       dispatch(setSocial(props.social));

  //       // testing
  //       // dispatch(setCasheVersion(props.cash_version));
  //       dispatch(setCasheVersion(5));
  //     });
  // }

  // function favicon(domain) {
  //   checkIfImageExists(
  //     `../../storage/${domain}/configuration/favicon/favicon.webp`
  //   ).then((res) => {
  //     if (res) {
  //       document.getElementById(
  //         "favicon"
  //       ).href = `../../storage/${domain}/configuration/favicon/favicon.webp`;
  //     } else {
  //       document.getElementById("favicon").href =
  //         "../../vendor/webkul/ui/assets/images/favicon.ico";
  //     }
  //   });
  // }

  useEffect(() => {
    setTimeout(() => {
      const preloader = document.querySelector(".site-preloader");
      if (preloader) {
        preloader.addEventListener("transitionend", (event) => {
          if (event.propertyName === "opacity") {
            preloader.parentNode.removeChild(preloader);
          }
        });
        preloader.classList.add("site-preloader__fade");
      }
    }, 500);
  }, []);

  return (
    <Provider store={store}>
      <HelmetProvider>{children}</HelmetProvider>
    </Provider>
  );
}

export default AppWrapper;

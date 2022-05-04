import {
  LOGO_URL,
  MENU_LIST,
  SET_SOCIAL,
  SET_DOMAIN,
  SET_POPUP,
  INIT_STATE,
  SET_B_ORDER,
  SET_FB_PIXEL,
  SET_CUSTOM_JS,
  SET_CURRENCIES,
  CATEGORIS_DATA,
  SET_SLIDE_IMAGES,
  SET_CASH_VERSION,
  SET_TRANSLATIONS,
  SET_STORE_CONFIGS,
  SET_INITIAL_MAX_PRICE,
  SET_INITIAL_MIN_PRICE,
  SET_POPUP_NAME,
  SET_CONFIGS,
  SET_UP_CROSS_PRODS,
  SET_TEMPORARY_DATA,
  // SET_VALID_CROSS,
} from "./generalActionTypes";
// console.log(SET_TEMPORARY_DATA, "data valid in general reducerx")
// console.log(SET_VALID_CROSS, "cros valid in general reducerx")

export const setInitialMinPrice = (payload) => {
  return {
    type: SET_INITIAL_MIN_PRICE,
    payload,
  };
};

export const setInitialMaxPrice = (payload) => {
  return {
    type: SET_INITIAL_MAX_PRICE,
    payload,
  };
};

export function setDomain(payload) {
  return (dispatch) =>
    dispatch({
      type: SET_DOMAIN,
      payload,
    });
}

export function setTranslations(payload) {
  return (dispatch) =>
    dispatch({
      type: SET_TRANSLATIONS,
      payload,
    });
}

export function setCurrencies(payload) {
  return (dispatch) =>
    dispatch({
      type: SET_CURRENCIES,
      payload,
    });
}

export function setBackorders(backorders) {
  return (dispatch) =>
    dispatch({
      type: SET_B_ORDER,
      payload: backorders,
    });
}

export function setCustomJs(customJs) {
  return (dispatch) =>
    dispatch({
      type: SET_CUSTOM_JS,
      payload: customJs,
    });
}

export function setSlideImages(array) {
  return (dispatch) =>
    dispatch({
      type: SET_SLIDE_IMAGES,
      payload: array,
    });
}

export function initState() {
  return (dispatch) =>
    dispatch({
      type: INIT_STATE,
    });
}
export function setMenuList(payload) {
  return (dispatch) =>
    dispatch({
      type: MENU_LIST,
      payload,
    });
}
export function setLogo(payload) {
  return (dispatch) =>
    dispatch({
      type: LOGO_URL,
      payload,
    });
}

export const setCrossValid = (payload) => ({
  type: "SET_VALID_CROSS",
  payload,
});

export const setUpCrossProd = (payload) => ({
  type: SET_UP_CROSS_PRODS,
  payload,
});


export const setTempData = (payload) => ({
  type: SET_TEMPORARY_DATA,
  payload,
});

export const setCatgoies = (payload) => ({
  type: CATEGORIS_DATA,
  payload,
});

export const setFbPixel = (payload) => ({
  type: SET_FB_PIXEL,
  payload,
});

export const setPopup = (payload) => ({
  type: SET_POPUP,
  payload,
});
export const setPopupName = (payload) => ({
  type: SET_POPUP_NAME,
  payload,
});

export const setCasheVersion = (payload) => ({
  type: SET_CASH_VERSION,
  payload,
});

export const setSocial = (payload) => ({
  type: SET_SOCIAL,
  payload,
});

export const setStoreConfigs = (payload) => ({
  type: SET_STORE_CONFIGS,
  payload,
});

export const setCoreConfigs = (payload) => ({
  type: SET_CONFIGS,
  payload,
})

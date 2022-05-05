import {
  LOGO_URL,
  SET_POPUP,
  MENU_LIST,
  SET_SOCIAL,
  INIT_STATE,
  SET_DOMAIN,
  SET_B_ORDER,
  SET_FB_PIXEL,
  SET_CUSTOM_JS,
  SET_POPUP_NAME,
  CATEGORIS_DATA,
  SET_SLIDE_IMAGES,
  SET_CASH_VERSION,
  SET_TRANSLATIONS,
  SET_STORE_CONFIGS,
  SET_INITIAL_MAX_PRICE,
  SET_INITIAL_MIN_PRICE,
  SET_CONFIGS,
  SET_UP_CROSS_PRODS,
  SET_TEMPORARY_DATA,
  SET_DB_NAME,
  SET_META_TAGS
} from "./generalActionTypes";

const initialState = {
  menuList: [],
  Backorders: null,
  translations: {},
  store_configs: {},
  popUp: false,
  popUpName: "",
  domain: "",
  fbPixel: false,
  initialMaxPrice: 0,
  initialMinPrice: 0,
  coreConfigs: {},
  upCrosProd: [],
  temporaryData: [],
  dbName: '',
  metas: null
};

export default function generalReducer(state = initialState, action) {
  switch (action.type) {

    case SET_TEMPORARY_DATA:
      return {
        ...state,
        temporaryData: action.payload,
      };
    case SET_DB_NAME:
      return {
        ...state,
        dbName: action.payload
      }
    case SET_META_TAGS:
      return {
        ...state,
        metas: action.payload
      }
    case SET_UP_CROSS_PRODS:
      return {
        ...state,
        upCrosProd: action.payload,
      }

    case SET_INITIAL_MAX_PRICE:
      return {
        ...state,
        initialMaxPrice: action.payload,
      };
    case SET_INITIAL_MIN_PRICE:
      return {
        ...state,
        initialMinPrice: action.payload,
      };
    case SET_DOMAIN:
      return {
        ...state,
        domain: action.payload,
      };
    case SET_STORE_CONFIGS:
      return {
        ...state,
        store_configs: action.payload,
      };
    case SET_TRANSLATIONS:
      return {
        ...state,
        translations: action.payload,
      };
    case SET_B_ORDER:
      return {
        ...state,
        Backorders: action.payload,
      };
    case INIT_STATE:
      return {
        ...state,
      };
    case MENU_LIST:
      return {
        ...state,
        menuList: action.payload,
      };
    case LOGO_URL:
      return {
        ...state,
        logoUrl: action.payload,
      };
    case CATEGORIS_DATA:
      return {
        ...state,
        categories: action.payload,
      };
    case SET_CUSTOM_JS:
      return {
        ...state,
        customJs: action.payload,
      };
    case SET_SLIDE_IMAGES:
      return {
        ...state,
        slideImages: action.payload,
      };
    case SET_FB_PIXEL:
      return {
        ...state,
        fbPixel: action.payload,
      };
    case SET_POPUP:
      return {
        ...state,
        popUp: action.payload,
      };
    case SET_POPUP_NAME:
      return {
        ...state,
        popUpName: action.payload,
      };
    case SET_CASH_VERSION:
      return {
        ...state,
        cashVersion: action.payload,
      };
    case SET_SOCIAL:
      return {
        ...state,
        social: action.payload,
      };

    case SET_CONFIGS:
      return {
        ...state,
        coreConfigs: action.payload,
      };
    default:
      return state;
  }
}

import {
  SET_RATE_LIST,
  CHANGE_CURRENCY,
  GET_EXACHGE_RATE,
  SET_DEFAULT_CURRENCY,
} from "./rateActionTypes";

const initialState = {
  list: [],
  current: {},
  exchange_rate: {},
  defaultCurrency: ""
};

export default function currencyReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case SET_RATE_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case SET_DEFAULT_CURRENCY:
      return {
        ...state,
        defaultCurrency: action.payload,
      };
    case CHANGE_CURRENCY:
      return {
        ...state,
        current: state.list.find(
          (carrency) => carrency.code === action.payload
        ),
      };
    case GET_EXACHGE_RATE:
      return {
        ...state,
        exchange_rate: action.payload?.exchange_rate || {},
      };
    default:
      return state;
  }
}

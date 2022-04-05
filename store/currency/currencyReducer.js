import {
  CHANGE_CURRENCY,
  SET_CURRENCY_LIST
} from "./currencyActionTypes";

const initialState = {
  current: {
    code: "AMD",
    symbol: "֏",
    name: "Armenian dram",
  },
  list: []
};

export default function currencyReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CURRENCY:
      return {
        ...state,
        current: state.list.find(carrency => carrency.id === action.payload)
      }
    case SET_CURRENCY_LIST:
      return {
        ...state,
        list: action.payload
      }
    default:
      return state
  }
}

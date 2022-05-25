import { SET_RATE_LIST, CHANGE_CURRENCY } from "./rateActionTypes";

const initialState = {
  list: [],
  current: {},
};

export default function currencyReducer(state = initialState, action) {
  switch (action.type) {
    case SET_RATE_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case CHANGE_CURRENCY:
      console.log(action.payload,"action payload in ")
      return {
        ...state,
        current: state.list.find(
          (carrency) => carrency.code === action.payload
        ),
      };
    default:
      return state;
  }
}

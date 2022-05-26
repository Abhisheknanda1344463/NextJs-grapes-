import {
  SET_RATE_LIST,
  CHANGE_CURRENCY,
  GET_EXACHGE_RATE,
} from "./rateActionTypes";

const initialState = {
  list: [],
  current: {},
  exchange_rate: {},
};

export default function currencyReducer(
  state = initialState,
  action,
  prevState
) {
  switch (action.type) {
    case SET_RATE_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case CHANGE_CURRENCY:
      return {
        ...state,
        current: state.list.find(
          (carrency) => carrency.code === action.payload
        ),
      };
    case GET_EXACHGE_RATE:
      const newData = prevState.list.find(
        (carrency) => carrency.code === action.payload
      );
      return {
        ...prevState,
        exchange_rate: newData?.exchange_rate || [],
      };
    default:
      return state;
  }
}

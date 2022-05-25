import { SET_RATE_LIST, CHANGE_CURRENCY } from "./rateActionTypes";

// eslint-disable-next-line import/prefer-default-export
export const changeRate = (currency) => ({
  type: CHANGE_CURRENCY,
  payload: currency,
});

export const setRate = (list) => ({
  type: SET_RATE_LIST,
  payload: list,
});
import { CHANGE_CURRENCY, SET_CURRENCY_LIST } from "./currencyActionTypes";

// eslint-disable-next-line import/prefer-default-export
export const changeCurrency = (currency) => ({
  type: CHANGE_CURRENCY,
  payload: currency,
});

export const setCurrencies = (list) => ({
  type: SET_CURRENCY_LIST,
  payload: list,
});

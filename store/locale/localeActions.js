import { LOCALE_CHANGE, SET_LOCALE_LIST } from "./localeActionTypes";

export const changeLocale = (locale) => ({
  type: LOCALE_CHANGE,
  payload: locale,
});

export const setLocaleList = (locales) => {
  return {
    type: SET_LOCALE_LIST,
    payload: locales,
  };
};

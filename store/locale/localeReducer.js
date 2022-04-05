import { LOCALE_CHANGE, SET_LOCALE_LIST } from "./localeActionTypes";

const initialState = {
  code: "hy",
  list: [],
};

export default function localeReducer(state = initialState, action) {
  let curentLocale;
  switch (action.type) {
    case LOCALE_CHANGE:
      // if (typeof action.payload == "string") {
      //   curentLocale = state.list.find(
      //     (locale) => locale.code === action.payload
      //   );
      // } else {
      //   curentLocale = state.list.find(
      //     (locale) => locale.id === action.payload
      //   );
      // }
      // // console.log(
      // //   curentLocale,
      // //   action.payload,
      // //   "11111111111111111111111111111111111"
      // // );
      // return {
      //   ...state,
      //   defaultLocale: curentLocale,
      //   code: curentLocale.code,
      // };
      return state;
    case SET_LOCALE_LIST:
      return {
        ...state,
        list: [...action.payload],
      };
    default:
      return state;
  }
}

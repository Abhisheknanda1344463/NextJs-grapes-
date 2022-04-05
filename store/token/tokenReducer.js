import { CART_TOKEN } from './tokenActionTypes'

const initialState = {
  cartToken: '',

};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_TOKEN:
      return {
        ...state,
        cartToken: action.payload
      }
    default:
      return state;
  }
};

export default customerReducer;

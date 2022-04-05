import { CART_TOKEN } from './tokenActionTypes';

export const AddCartToken = (token) => ({
    type: CART_TOKEN,
    payload: token
})
import { CUSTOMER_TOKEN, AUTHENTICATED, CUSTOMER_ID } from './customerActionTypes';

export const setAuth = (token) => ({

    type: AUTHENTICATED,
    payload: token

})

export const setToken = (token) => ({

    type: CUSTOMER_TOKEN,
    payload: token

})

export const setID = (id) => ({

    type: CUSTOMER_ID,
    payload: id

})
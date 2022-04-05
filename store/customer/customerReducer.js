import { AUTHENTICATED, CUSTOMER_TOKEN, CUSTOMER_ID } from './customerActionTypes'

const initialState = {
    authenticated: false,
    token: '',
    customerId: ''
};

const customerReducer = (state = initialState, action) => {

    switch (action.type) {


        case AUTHENTICATED:
            return {
                ...state,
                authenticated: action.payload
            }

        case CUSTOMER_TOKEN:
            return {
                ...state,
                token: action.payload
            }

        case CUSTOMER_ID:
            return {
                ...state,
                customerId: action.payload
            }

        default:
            return state;
    }
};

export default customerReducer;
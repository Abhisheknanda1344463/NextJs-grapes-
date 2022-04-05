import { MOBILE_MENU_CLOSE, MOBILE_MENU_OPEN, SET_MOBILE_MENU_LIST } from './mobileMenuActionTypes';

const initialState = {
    open: false,
    mobileMenuList: []
};

export default function mobileMenuReducer(state = initialState, action) {
    switch (action.type) {
        case SET_MOBILE_MENU_LIST:
            return {
                ...state,
                mobileMenuList: action.payload,
            };
        case MOBILE_MENU_OPEN:
            return {
                ...state,
                open: !state.open,
            };
        case MOBILE_MENU_CLOSE:
            return {
                ...state,
                open: false,
            };
        default:
            return state;
    }
}

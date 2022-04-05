import { MOBILE_MENU_CLOSE, MOBILE_MENU_OPEN, SET_MOBILE_MENU_LIST } from './mobileMenuActionTypes';

export function mobileMenuOpen() {
    return { type: MOBILE_MENU_OPEN };
}

export function mobileMenuClose() {
    return { type: MOBILE_MENU_CLOSE };
}

export function setMenuPagesList(list) {
    return {
        type: SET_MOBILE_MENU_LIST,
        payload: list
    };
}

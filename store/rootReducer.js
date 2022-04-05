import { combineReducers } from 'redux';

// reducers
import cartReducer from './cart';
import compareReducer from './compare';
import currencyReducer from './currency';
import localeReducer from './locale';
import mobileMenuReducer from './mobile-menu';
import quickviewReducer from './quickview';
import sidebarReducer from './sidebar';
import version from './version';
import wishlistReducer from './wishlist';
import customerReducer from './customer';
import tokenReducer from './token';
import generalReducer from './general';

export default combineReducers({
    version: (state = version) => state,
    cart: cartReducer,
    compare: compareReducer,
    currency: currencyReducer,
    locale: localeReducer,
    mobileMenu: mobileMenuReducer,
    quickview: quickviewReducer,
    sidebar: sidebarReducer,
    wishlist: wishlistReducer,
    customer: customerReducer,
    cartToken: tokenReducer,
    general: generalReducer,
});
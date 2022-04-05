// react
import React, { Component } from "react";
import BottomNavigation from "reactjs-bottom-navigation";
import "reactjs-bottom-navigation/dist/index.css";
// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import Link from "next/link";
import IndicatorAccount from "../header/IndicatorAccount";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
// application
import Indicator from "../header/Indicator";
import {
  MenuSvg,
  HomenewSVG,
  NewpersonSVG,
  CartNewtSvg,
  MenuFill,
  FailSvg,
  HomeFormSvg,
} from "../../svg";

function MobileFooterNavs(props) {
  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist);
  //  const logoUrl = useSelector((state) => state.general.logoUrl);
  const customer = useSelector((state) => state.customer);

  const dispatch = useDispatch();
  const openMenu = () => {
    dispatch({ type: "MOBILE_MENU_OPEN", payload: true });
  };
  const popupChange = () => {
    dispatch({ type: "SET_POPUP", payload: true });
  };
  const popupNameChange = () => {
    dispatch({ type: "SET_POPUP_NAME", payload: "register" });
  };
  const bottomNavItems = [
    {
      icon: (
        <a class="button">
          <Indicator aria-label="mobile go home" url="/" icon={<NewpersonSVG />} />
        </a>
      ),
      activeIcon: <Indicator aria-label="mobile go home" url="/" icon={<NewpersonSVG />} />,
      title: <FormattedMessage id="home" defaultMessage="Home" />,
    },
    {
      icon: <MenuFill />,
      activeIcon: <MenuFill className="op" />, //
      onClick: () => openMenu(),
      title: <FormattedMessage id="menu" defaultMessage="Menu" />,
    },

    {
      icon: (
        <Indicator
          className="indicator--mobile"
          aria-label="go to shop card"
          url="/shop/cart"
          value={cart.items.length}
          icon={<CartNewtSvg />}
        />
      ),
      activeIcon: (
        <Indicator
          style={{ fontSize: "18px", color: "red" }}
          icon={<CartNewtSvg />}
          url="/shop/cart"
          value={cart.items.length}
          aria-label="go to shop card"
        />
      ),
      title: <FormattedMessage id="cart" defaultMessage="Cart" />,
    },

    {
      icon: customer.authenticated ? (
        <Indicator
          className="indicator--mobile d-sm-flexd-md-none"
          url="/shop/wishlist"
          value={wishlist.length}
          icon={<MenuSvg />}
        />
      ) : (
        <div
          className="mx-2"
          onClick={(e) => {
            e.preventDefault();
            toast(
              <span className="d-flex faild-toast-fms">
                {/* <FailSvg /> */}
                <FormattedMessage
                  id="sign-or-register"
                  defaultMessage="Please sign in or register"
                />
              </span>,
              {
                hideProgressBar: true,
                className: "wishlist-toast",
              }
            );
          }}
        >
          <span className="wishlist-icon-mobile">
            <MenuSvg />
            {/* <span className="indicator__value">0</span> */}
          </span>
        </div>
      ),

      activeIcon: customer.authenticated ? (
        <Indicator
          className="indicator--mobile d-sm-flexd-md-none"
          url="/shop/wishlist"
          value={wishlist.length}
          icon={<MenuSvg />}
        />
      ) : (
        <div
          className="mx-2"
          onClick={(e) => {
            e.preventDefault();
            toast(
              <span className="d-flex faild-toast-fms">
                <MenuSvg />
                <FormattedMessage
                  id="sign-or-register"
                  defaultMessage="Please sign in or register"
                />
              </span>,
              {
                hideProgressBar: true,
                className: "wishlist-toast",
              }
            );
          }}
        >
          <span className="wishlist-icon-mobile">
            <MenuSvg />
            {/* <span className="indicator__value">0</span> */}
          </span>
        </div>
      ),
      title: <FormattedMessage id="favorites" defaultMessage="Favorites" />,
    },
    {
      icon:
        customer && customer.authenticated == true ? (
          <Indicator url="/account/profile" icon={<HomenewSVG />} />
        ) : (
          <HomenewSVG />
        ),
      activeIcon:
        customer && customer.authenticated == true ? (
          <HomenewSVG />
        ) : (
          <HomenewSVG />
        ),
      onClick:
        customer && customer.authenticated == false
          ? () => {
              popupChange(), popupNameChange();
            }
          : null,
      title:
        customer.authenticated == false ? (
          <FormattedMessage id="signIn" defaultMessage="Sign in" />
        ) : (
          <FormattedMessage id="topbar.myAccount" defaultMessage="My account" />
        ),
    },
  ];

  return (
    <div>
      <BottomNavigation
        items={bottomNavItems}
        defaultSelected={0}
     ///   onItemClick={(item) => console.log(item, "llll")}
        value={""}
      />
    </div>
  );
}

export default React.memo(MobileFooterNavs);
// // react
// import React, { Component } from "react";

// // third-party
// import classNames from "classnames";
// import { connect } from "react-redux";
// import Link from "next/link";
// import IndicatorAccount from "../header/IndicatorAccount";
// import { toast } from "react-toastify";

// // application
// import Indicator from "../header/Indicator";
// import {
//   MenuSvg,
//   CartssSvg,
//   HomeFormSvg,
//   Person20Svg,
//   PersonssSvg,
// } from "../../svg";
// import { setPopup, setPopupName } from "../../store/general";
// import { mobileMenuOpen } from "../../store/mobile-menu";

// class MobileFooterNavs extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isActive: false,
//     };
//   }

//   handleToggle = (svgName) => {
//     this.setState({ isActive: svgName });
//   };

//   render() {
//     const { openMobileMenu, cart, setPopup, setPopupName, customer } =
//       this.props;

//     const isActive = this.state.isActive;
//     return (
//       <div className="mobile-footer-navs-fms">
//         <div className="mobile-fotter__panel ">
//           <div>
//             <div className="mobile-footer__body ">
//               <div className="mobile-footer__indicators">
//                 <div
//                   className={isActive === "home" ? "bg_className" : null}
//                   onClick={() => this.handleToggle("home")}
//                 >
//                   <a href="/">
//                     <HomeFormSvg />
//                   </a>
//                 </div>
//                 {customer && customer.authenticated == true ? (
//                   <div
//                     className={isActive == "Account" ? "bg_className" : null}
//                     onClick={() => {
//                       this.handleToggle("Account");
//                     }}
//                   >
//                     <IndicatorAccount />
//                   </div>
//                 ) : (
//                   <div
//                     className={isActive == "Account" ? "bg_className" : null}
//                     onClick={() => {
//                       this.handleToggle("Account"),
//                         setPopup(true),
//                         setPopupName("register");
//                     }}
//                   >
//                     <PersonssSvg />
//                   </div>
//                 )}

//                 <div
//                   className={isActive == "Cart" ? "bg_className" : null}
//                   onClick={() => this.handleToggle("Cart")}
//                 >
//                   <Indicator
//                     className="indicator--mobile"
//                     url="/shop/cart"
//                     value={cart.quantity}
//                     icon={<CartssSvg />}
//                   />
//                 </div>
//                 <div
//                   className={isActive == "Menu" ? "bg_className" : null}
//                   onClick={() => this.handleToggle("Menu")}
//                 >
//                   <button
//                     type="button"
//                     className="mobile-header__menu-button"
//                     onClick={openMobileMenu}
//                   >
//                     <MenuSvg className="mobile-header__menu-button-burger" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   cart: state.cart,
//   wishlist: state.wishlist,
//   logoUrl: state.general.logoUrl,
//   customer: state.customer,
//   domain: state.general.domain,
// });

// const mapDispatchToProps = {
//   openMobileMenu: mobileMenuOpen,
//   setPopup,
//   setPopupName,
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(React.memo(MobileFooterNavs));

// react
import React, { useRef, useEffect } from "react";

// third-partynav-panel
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { apiUrlWithStore } from "../../helper";
// application
import CartIndicator from "./IndicatorCart";
import Departments from "./Departments";
import Indicator from "./Indicator";
import IndicatorAccount from "./IndicatorAccount";
import IndicatorSearch from "./IndicatorSearch";
import NavLinks from "./NavLinks";
import Search from "./Search";
import { FailSvg, MenuSvg, LogoSmallSvg } from "../../svg";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import { cartTranslation } from "../../store/cart";

function NavPanel(props) {
  const { layout, wishlist } = props;
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  let logo = null;
  let departments = null;
  let searchIndicator;
  const signed = useSelector((state) => state.customer.authenticated);
  const locale = useSelector((state) => state.locale.code);
  const customer = useSelector((state) => state.customer);
  const cartToken = useSelector((state) => state.cartToken);

  useEffect(() => {
    dispatch(cartTranslation(cartToken, customer, locale));
  }, [locale]);

  if (layout === "compact") {
    logo = (
      <div className="nav-panel__logo">
        <Link href="/">
          <LogoSmallSvg />
        </Link>
      </div>
    );

    searchIndicator = <IndicatorSearch />;
  }

  if (layout === "default") {
    departments = (
      <div className="nav-panel__departments">
        <Departments />
      </div>
    );
  }

  return (
    <div className="nav-panel">
      <div className="nav-panel__container container">
        <div className="nav-panel__row">
          {logo}
          {departments}

          <div className="site-header__search">
            <Search inputRef={inputRef} context="header" />
          </div>

          <div className="nav-panel__indicators">
            {searchIndicator}
            <IndicatorAccount {...props} />
            {signed ? (
              <Indicator
                className="heartButton"
                url="/shop/wishlist"
                value={wishlist.length}
                icon={<MenuSvg />}
                title={
                  <FormattedMessage id="favorites" defaultMessage="Favorites" />
                }
              />
            ) : (
              <div
                className="wishlist-a-fms"
                onClick={(e) => {
                  e.preventDefault();
                  toast(
                    <span className="d-flex faild-toast-fms">
                      <FailSvg />
                      <FormattedMessage
                        // id="sign-or-register"
                        id="please.login.toast"
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
                <Indicator
                  className="heartButton nosigned-title-fms"
                  url=""
                  value={wishlist.length}
                  icon={<MenuSvg />}
                  title={
                    <FormattedMessage
                      id="favorites"
                      defaultMessage="Favorites"
                    />
                  }
                />
              </div>
            )}
            <CartIndicator />
          </div>
        </div>
      </div>
    </div>
  );
}

NavPanel.propTypes = {
  /** one of ['default', 'compact'] (default: 'default') */
  layout: PropTypes.oneOf(["default", "compact"]),
};

NavPanel.defaultProps = {
  layout: "default",
};

const mapStateToProps = (state) => ({
  wishlist: state.wishlist,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NavPanel);

// react
import React, { Component } from "react";

// third-party
import Link from "next/link";
import classNames from "classnames";
import { connect } from "react-redux";
///import { toast } from "react-toastify";

import { apiImageUrl } from "../../helper";
// import IndicatorAccount from "../header/IndicatorAccount";

// application
import Indicator from "../header/Indicator";
import {
  Cross20Svg,
  // Menu18x14Svg,
  // Search20Svg,
  // Heart120Svg,
  // MenuSvg,
  // HeartSvg,
  Mobilemenu,
  SearchssSvg,
  // FailSvg,
} from "../../svg";

import { mobileMenuOpen } from "../../store/mobile-menu";

import Search from "../header/Search";
import Image from "components/hoc/Image";
//import { FormattedMessage } from "react-intl";
import Topbar from "components/header/Topbar";
// import DropdownLanguage from "components/header/DropdownLanguage";

class MobileHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchOpen: false,
      logoUrl: "",
    };
    this.searchInput = React.createRef();
  }

  componentDidMount() {
    this.setState({ logoUrl: this.props.logoUrl });
    //   fetch(`${url}/api/logo`)
    //     .then((response) => response.json())
    //     .then((res) => this.setState({ logoUrl: res.url }));
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchOpen } = this.state;

    if (
      searchOpen &&
      searchOpen !== prevState.searchOpen &&
      this.searchInput.current
    ) {
      this.searchInput.current.focus();
    }
  }

  handleOpenSearch = () => {
    this.setState(() => ({ searchOpen: true }));
  };

  handleCloseSearch = () => {
    this.setState(() => ({ searchOpen: false }));
  };

  render() {
    const { openMobileMenu, wishlist, cart, domain, mobilemenu } = this.props;
    const { searchOpen } = this.state;
    const searchClasses = classNames("mobile-header__search", {
      "mobile-header__search--open": searchOpen,
    });

    return (
      <div className="mobile-header">
        <div className="mobile-header__panel">
          <div>
            <Topbar />
            <div className="mobile-header__body container">
              <button
                type="button"
                className="mobile-header__menu-button"
                onClick={openMobileMenu}
                aria-label="MobileHeaderBtn"
              >
                {mobilemenu == false ? (
                  <Mobilemenu className="mobile-header__menu-button-burger" />
                ) : (
                  <Cross20Svg />
                )}
              </button>
              <div className="header__logo">
                {domain ? (
                  <Link href="/">
                    <a aria-label="go to home page">
                      <img
                        alt="mobile-logo"
                        src={`../../storage/${domain}/configuration/logo/logo.webp`}
                        onError={(e) => {
                          e.target.src = `${apiImageUrl}/vendor/webkul/ui/assets/images/logo.svg`;
                        }}
                      />
                    </a>
                  </Link>
                ) : (
                  <Link href="/">
                    <a aria-label="go to home page">
                      <Image
                        alt=""
                        width={150}
                        height={45}
                        src={`${apiImageUrl}/vendor/webkul/ui/assets/images/logo.svg`}
                      />
                    </a>
                  </Link>
                )}
              </div>

              <div className="mobile-header__indicators">
                {/* //////REMEBER WE NEED THIS ICON BREAK ON MOBILE */}

                 <Indicator
                  className="indicator--mobile indicator--mobile-search search-icon d-md-none"
                  onClick={this.handleOpenSearch}
                  icon={<SearchssSvg />}
                />
                {/* {signed ? (
                  <Indicator
                    className="indicator--mobile d-sm-flexd-md-none"
                    url="/shop/wishlist"
                    value={wishlist.length}
                    icon={<Heart120Svg />}
                  />
                ) : (
                  <div
                    className="mx-2"
                    onClick={(e) => {
                      e.preventDefault();
                      toast(
                        <span className="d-flex faild-toast-fms">
                          <FailSvg />
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
                      <span className="indicator__value">0</span>
                      <HeartSvg />
                    </span>
                  </div>
                )} */}
                {/* <DropdownLanguage /> */}
              </div>
            </div>
            <Search
              context="mobile-header"
              className={searchClasses}
              inputRef={this.searchInput}
              onClose={this.handleCloseSearch}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cart: state.cart,
  wishlist: state.wishlist,
  logoUrl: state.general.logoUrl,
  customer: state.customer,
  domain: state.general.domain,
  mobilemenu: state.mobileMenu.open,
});

const mapDispatchToProps = {
  openMobileMenu: mobileMenuOpen,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(MobileHeader));

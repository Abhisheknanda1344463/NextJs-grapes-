// react
import React, { useEffect, useState } from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";
import scriptsfm from "script-tags";
import { ToastContainer } from "react-toastify";
import { connect, useSelector, useDispatch } from "react-redux";
import { cartUpdateQuantitiesSuccess } from "../store/cart";
import { apiImageUrl, apiUrlWithStore } from "../helper";
import theme from "../data/theme";
import shopApi from "../api/shop";
import { setMenuList } from "../store/general";
import Topbar from "./header/Topbar";
import Footer from "./footer";
import Header from "./header";
import MobileMenu from "./mobile/MobileMenu";
import MobileHeader from "./mobile/MobileHeader";
import MobileFooter from "./footer/MobileFooter";
import { setCatgoies } from "../store/general";
import { AddCartToken } from "../store/token";
import { useRouter } from "next/router";
import useWindowWidth from "../hooks/useWindowWidth";
import AccountResetPassword from "./account/AccountResetPassword";
import PopupModal from "./popupComponents/PopupModal";
// import UpSell from "./popupComponents/UpSellCrossel";
// import UpSellCrossel from "./popupComponents/UpSellCrossel";

// application
// data stubs
// import ReactGA from "react-ga";
// import { ModalFooter } from "reactstrap";

function Layout(props) {
  const {
    headerLayout,
    children,
    setMenuList,
    customJs,
    fbPixel,
    domain,
    popUp,
    upCrosProd,
  } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const width = useWindowWidth();
  const customer = useSelector((state) => state.customer);
  const dbName = useSelector((state) => state.general.dbName);
  const selectedData = useSelector((state) => state.locale.code);
  const upDomain = domain.charAt(0).toUpperCase() + domain.slice(1);
  useEffect(() => {
    if (customJs) {
      const jsCode = scriptsfm(customJs);
      if (jsCode) {
        jsCode.forEach((element) => {
          const { attrs, text } = element;
          const scriptTag = document.createElement("script");
          const attrKeys = Object.keys(attrs);

          for (let i = 0; i < attrKeys.length; i++) {
            scriptTag.setAttribute(attrKeys[i], attrs[attrKeys[i]]);
          }
          if (text) {
            scriptTag.innerText = text;
          }
          document.body.appendChild(scriptTag);
        });
      }
    }
  }, [customJs]);

  // const getCategories = () => {
  //   try {
  //     fetch(apiUrlWithStore(`/db/categories?locale=${router.locale}`))
  //       .then((response) => response.json())
  //       .then((res) => {
  //         dispatch(setCatgoies(res.categories));
  //       });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const getMenuList = () => {
  //   try {
  //     fetch(apiUrlWithStore(`/db/cms/menus?locale=${router.locale}`))
  //       .then((response) => response.json())
  //       .then((res) => {
  //         setMenuList(res.data);
  //       });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // useEffect(() => {
  //   getCategories();
  //   getMenuList();
  // }, [router.locale]);

  useEffect(() => {
    const abortController = new AbortController();
    if (customer.token) {
      const { exp } = jwt_decode(customer.token);
      if (Date.now() >= exp * 1000) {
        dispatch({ type: "AUTHENTICATED", payload: false });
        dispatch({ type: "CUSTOMER_TOKEN", payload: "" });
      }
    }
    return function cleaup() {
      abortController.abort();
    };
  }, [customer.token]);

  //fix this bug after checking issue

  useEffect(() => {
    if (!props?.cartToken?.cartToken) {
      fetch(`/api/checkout/cart/token`)
        .then((responce) => responce.json())
        .then((res) => {
          if (res.api_token) {
            props.AddCartToken(res.api_token);
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

  let isMobile = false;
  if (width !== undefined && width > 991) {
    isMobile = false;
  } else if (width !== undefined && width < 991) {
    isMobile = true;
  }

  return (
    <div>
      {/*<Head>*/}
        {/*<title>{`${upDomain}`}</title>*/}
        {/*<meta*/}
        {/*  name="description"*/}
        {/*  content={theme.fullName}*/}
        {/*  data-react-helmet={true}*/}
        {/*/>*/}
        {/*<link rel="canonical" href={`${upDomain}`} />*/}
        {/*<meta name="twitter:card" content="summary_large_image" />*/}
        {/*<meta property="og:description" content={`${theme.fullName}`} />*/}
        {/*<meta property="og:title" name="title" content={`${theme.fullName}`} />*/}
        {/*<meta*/}
        {/*  property="og:keywords"*/}
        {/*  name="keywords"*/}
        {/*  content={`${theme.fullName}`}*/}
        {/*/>*/}

        {/*<meta*/}
        {/*  property="og:image"*/}
        {/*  name="image"*/}
        {/*  content={`${dbName}/storage${domain}/configuration/share_pic/share_pic.webp`}*/}
        {/*/>*/}
      {/*</Head>*/}
      <ToastContainer autoClose={3000} />
      {isMobile && <MobileMenu />}
      <div className="site">
        {isMobile && (
          <header className="site__header d-lg-none">
            <MobileHeader />
          </header>
        )}
        <Topbar />
        <header className="site__header d-lg-block d-none postition-sticky">
          <Header layout={headerLayout} />
        </header>

        <div className="site__body">{children}</div>

        <footer className="site__footer">
          {isMobile && <MobileFooter />}
          <Footer />
        </footer>

        <PopupModal active={popUp} upCrosProd={upCrosProd} />
      </div>
    </div>
  );
}

// Layout.propTypes = {
//   headerLayout: PropTypes.oneOf(["default", "compact"]),
//   homeComponent: PropTypes.elementType.isRequired,
// };

// Layout.defaultProps = {
//   headerLayout: "default",
// };

const mapStateToProps = ({
  general: { fbPixel, customJs, domain, popUp, upCrosProd },
  cartToken,
}) => ({
  domain,
  fbPixel,
  customJs,
  popUp,
  cartToken,
  upCrosProd,
});

const mapDispatchToProps = (dispatch) => ({
  setMenuList: (object) => dispatch(setMenuList(object)),
  AddCartToken: (object) => dispatch(AddCartToken(object)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);

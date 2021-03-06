// react
import React, { useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
// third-party
import { useRouter } from "next/router";
import Link from "next/link";
import { setPopup } from "../../store/general";
import { FormattedMessage } from "react-intl";
// application
import { useDispatch, useSelector } from "react-redux";
import { url, apiUrlWithStore } from "../../helper";
import { cartAddItemAfterLogin } from "../../store/cart";
import { cartRemoveItemAfterLogin } from "../../store/cart";
import { FailSvg } from "../../svg";
import TextField from "@mui/material/TextField";
function IndicatoDropDownBody({ setOpen, func }) {
  const history = useRouter();
  const dispatch = useDispatch();

  const authenticated = useSelector((state) => state.customer.authenticated);
  const customer = useSelector((state) => state.customer);
  const cartToken = useSelector((state) => state.cartToken);
  const cart = useSelector((state) => state.cart);
  const selectedData = useSelector((state) => state.locale.code);

  const [email, SetEmail] = useState();
  const [pass, SetPass] = useState();

  const handlerChange = (event) => {
    SetEmail(event.target.value);
  };

  const handlerPass = (e) => {
    SetPass(e.target.value);
  };

  const fetchToLogin = (event) => {
    event.preventDefault();

    let option = {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: pass,
      }),
    };
    if (checkEmail(email) && pass !== undefined) {
      fetch(apiUrlWithStore("/api/customer/login?token=true"), option)
        .then((responce) => responce.json())
        .then((res) => {
          if (res.token && res.token !== "") {
            dispatch({ type: "AUTHENTICATED", payload: true });
            dispatch({ type: "CUSTOMER_TOKEN", payload: res.token });
            dispatch({ type: "CUSTOMER_ID", payload: res.data.id });
            setPopup(false);
            history.push("/account/profile/");

            fetch(
              `${url}/api/checkout/cart?token=${res.token}&api_token=${cartToken.cartToken}`
            )
              .then((responce) => responce.json())
              .then((resUser) => {
                if (resUser) {
                  submitCartData(resUser, res.token);
                }
              })
              .catch((err) => console.error(err));
          } else {
            toast(
              <span className="d-flex chek-fms">
                <FailSvg />
                <FormattedMessage
                  id="invalid_email_password"
                  defaultMessage={res.error}
                />
              </span>,
              {
                hideProgressBar: true,
              }
            )
          }
        });
    } else {
      // alert("Type valid data");
      toast(
        <span className="d-flex chek-fms">
          {/*<FailSvg />*/}
          <FormattedMessage
            id="type_valid_data"
            defaultMessage="Type valid data"
          />
        </span>,
        {
          hideProgressBar: true,
        }
      )
    }
  };

  const submitCartData = (products, token) => {
    if (cart.items.length > 0 && products.data !== null) {
      cart.items.map((product) => {
        let pro = products.data.items.find(
          (item) => item.product.id == product.product.id
        );
        if (pro == undefined) {
          fetch(
            `${url}/api/checkout/cart/add/${product.product.id}?product_id=${product.product.id
            }&quantity=${product.quantity}&api_token=${cartToken.cartToken}${token ? `&token=${token}` : ""
            }`,
            { method: "POST" }
          )
            .then((responce) => responce.json())
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        } else {
          cartRemoveItemAfterLogin(product.id, pro.product.id, dispatch);
        }
      });
    } else if (cart.items.length > 0 && products.data === null) {
      cart.items.map((product) => {
        fetch(
          `${url}/api/checkout/cart/add/${product.product.id}?product_id=${product.product.id
          }&quantity=${product.quantity}&api_token=${cartToken.cartToken}${token ? `&token=${token}` : ""
          }`,
          { method: "POST" }
        )
          .then((responce) => responce.json())
          .then((res) => { })
          .catch((err) => console.error(err));
      });
    }

    if (products.data !== null && products.data.items.length > 0) {
      products.data.items.map((product) => {
        cartAddItemAfterLogin(
          product.product,
          [],
          product.quantity,
          cartToken,
          customer,
          selectedData,
          dispatch,
          products
        );
      });
    }
  };
  const checkEmail = () => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return "true";
    }
    return "false";
  };

  const dropdown = (
    <div className="account-menu">
      <form className="account-menu__form">
        <div className="account-menu__form-title">
          <FormattedMessage id="login.log.in" defaultMessage="Log in" />
        </div>
        <div className="account-menu_loginAndpass">
          <TextField
            id="outlined-email-input"
            label={<FormattedMessage id="email" defaultMessage="E-mail" />}
            type="email"
            autoComplete="current-email"
            onChange={handlerChange}
            name="email"
          />
        </div>
        <div className="account-menu_loginAndpass">
          <div className="account-menu_loginAndpass">
            <TextField
              id="outlined-password-input"
              label={
                <FormattedMessage
                  id="topbar.password"
                  defaultMessage="Password"
                />
              }
              type="password"
              autoComplete="current-password"
              onChange={handlerPass}
              name="password"
            />

            <Link
              href="/forgot/password"
              className="account-menu__form-forgot-link"
            >
              <a onClick={() => func(false)}>
                <FormattedMessage
                  id="login.forgot.password"
                  defaultMessage="Forgot password?"
                />
              </a>
            </Link>
          </div>
        </div>
        <div className="form-group account-menu__form-button">
          <button
            onClick={fetchToLogin}
            type="submit"
            className="btn btn-orange btn-md login-drop-btn rounded-pills"
          >
            <FormattedMessage id="login.log.in" defaultMessage="Log in" />
          </button>
        </div>
        <div className="account-menu__form-link">
          <span className="new-custimer">
            <FormattedMessage
              id="new.custimer"
              defaultMessage="New Custimer?"
            />
          </span>
          <Link href="/account/login">
            <span
              onClick={() => {
                func(false);
              }}
            >
              <FormattedMessage
                id="login.createAcount"
                defaultMessage="Create account"
              />
            </span>
          </Link>
        </div>
      </form>
      <div className="account-menu__divider" />

    </div>
  );

  return <>{dropdown}</>;
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setPopup,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndicatoDropDownBody);

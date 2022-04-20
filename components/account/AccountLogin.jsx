// react
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

// third-party
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import { url } from "../../helper";
import { cartAddItemAfterLogin } from "../../store/cart";
import { cartRemoveItemAfterLogin } from "../../store/cart";
import { Helmet } from "react-helmet-async";
import PageHeader from "components/shared/PageHeader";
import { FailSvg } from "svg";

export default function AccountLogin() {
  const history = useRouter();

  const dispatch = useDispatch();
  const cartToken = useSelector((state) => state.cartToken);
  const cart = useSelector((state) => state.cart);
  const selectedData = useSelector((state) => state.locale.code);
  const customer = useSelector((state) => state.customer);

  const [email, SetEmail] = useState();
  const [pass, SetPass] = useState();

  const handlerChange = (event) => {
    SetEmail(event.target.value);
  };

  const handlerPass = (e) => {
    SetPass(e.target.value);
  };
  const breadcrumb = [
    {
      title: <FormattedMessage id="home" defaultMessage="Home" />,
      url: "/",
    },
    {
      title: <FormattedMessage id="login" defaultMessage="Login" />,
      url: "",
    },
  ];
  const fetchToLogin = (event) => {
    event.preventDefault();

    let option = {
      method: "POST",
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
      fetch(url + "/api/customer/login?token=true", option)
        .then((responce) => responce.json())
        .then((res) => {
          if (res.token && res.token !== "") {
            dispatch({ type: "AUTHENTICATED", payload: true });
            dispatch({ type: "CUSTOMER_TOKEN", payload: res.token });
            dispatch({ type: "CUSTOMER_ID", payload: res.data.id });
            history.push("/shop/checkout");

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
            // alert(res.error);
            toast(
              <span className="d-flex chek-fms">
                <FailSvg />
                <FormattedMessage
                  id="type_valid_data"
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
          <FailSvg />
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

  return (
    <React.Fragment>
      <FormattedMessage id="topbar.myAccount" defaultMessage="My account">
        {(account) => <PageHeader header={account} breadcrumb={breadcrumb} />}
      </FormattedMessage>
      <div className="container p-0 login-container">
        <div className="row ">
          <form className="card-body card p-5  col-md-6 d-flex mt-4 mt-md-0 sign-up-fms">
            <h1 className="card-title">
              <FormattedMessage id="login" defaultMessage="Sign In" />
            </h1>

            <div className="signUp-position-relative ">
              <TextField
                id="outlined-email-input"
                label={<FormattedMessage id="email" defaultMessage="E-mail" />}
                type="email"
                autoComplete="current-email"
                name="email"
                onChange={handlerChange}
              />
            </div>
            <div className="position-relative media-class-for-height">
              <div className="account-menu__form-forgot login-ss">
                <div className="signUp-position-relative">
                  <TextField
                    id="outlined-email-input"
                    label={
                      <FormattedMessage
                        id="topbar.password"
                        defaultMessage="Password"
                      />
                    }
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    onChange={handlerPass}
                  />
                </div>
                <span className="account-menu__form-forgot-link">
                  <Link href="/forgot/password">
                    <a>
                      <FormattedMessage
                        id="login.forgot.password"
                        defaultMessage="Forgot password?"
                      />
                    </a>
                  </Link>
                </span>
              </div>
            </div>
            <div className="form-group account-menu__form-button">
              <button
                onClick={fetchToLogin}
                type="submit"
                className="btn btn-lg btn-orange login-button rounded-pills float-left"
              >
                <FormattedMessage id="login" defaultMessage="Log in" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

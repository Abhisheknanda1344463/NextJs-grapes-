// react
import React, { useState } from "react";

// third-party
import { useRouter } from "next/router";
import Link from "next/link";

import { FormattedMessage } from "react-intl";

// application
import Indicator from "./Indicator";
import { PersonFill, FailSvg } from "../../svg";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { url, apiUrlWithStore } from "../../helper";

import { cartAddItemAfterLogin } from "../../store/cart";
import { cartRemoveItemAfterLogin } from "../../store/cart";
import IndicatoDropDownBody from "./IndicatoDropDownBody";

export default function IndicatorAccount() {
  const history = useRouter();
  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.customer.authenticated);
  const customer = useSelector((state) => state.customer);
  const cartToken = useSelector((state) => state.cartToken);
  const cart = useSelector((state) => state.cart);
  const selectedData = useSelector((state) => state.locale.code);

  const [email, SetEmail] = useState();
  const [pass, SetPass] = useState();
  const [open, setOpen] = useState(false);

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
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: pass
      })
    };
    if (checkEmail(email) && pass !== undefined) {
      let customutl = apiUrlWithStore(`/api/customer/login?token=true`);
      fetch(customutl, option)
        .then((responce) => responce.json())
        .then((res) => {
          if (res.token && res.token !== "") {
            dispatch({ type: "AUTHENTICATED", payload: true });
            dispatch({ type: "CUSTOMER_TOKEN", payload: res.token });
            dispatch({ type: "CUSTOMER_ID", payload: res.data.id });
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
            // alert(res.error);
            toast(
              <span className="d-flex chek-fms">
                <FailSvg />
                <FormattedMessage
                  id=""
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
            id=""
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

  const func = (bool) => {
    setOpen(bool);
  };


  const dropdown = <IndicatoDropDownBody setOpen={setOpen} func={func} />;

  return (
    <Indicator
      url="/account/profile"
      className="account-logo-svg"
      func={func}
      openEd={open}
      account={"account"}
      dropdown={!authenticated ? dropdown : ""}
      icon={<PersonFill />}
      title={
        customer.authenticated == false ? (
          <FormattedMessage id="signIn" defaultMessage="Sign in" />
        ) : (
          <FormattedMessage id="topbar.myAccount" defaultMessage="My account" />
        )
      }
    />
  );
}

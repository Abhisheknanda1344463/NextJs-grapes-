import React, { useEffect, useState } from "react";
import ShopPageCart from "../../components/shop/ShopPageCart";
import { useSelector } from "react-redux";
import allActions from "../../services/actionsArray";
import { generalProcessForAnyPage } from "../../services/utils";
import store from "../../store";
import { cartTranslation } from "../../store/cart";
function Cart({ locale, dispatches }) {
  const { dispatch } = store;
  const signed = useSelector((state) => state.customer.authenticated);
  // const locale = useSelector((state) => state.locale.code);
  const customer = useSelector((state) => state.customer);
  const cartToken = useSelector((state) => state.cartToken);

  /////REMEBER THINK ABOUT IT
  useEffect(() => {
    dispatch(cartTranslation(cartToken, customer, locale));
  }, [locale]);

  useEffect(() => {
    // changeLocale(locale == "en" ? 1 : 6);
    for (let actionKey in dispatches) {
      dispatch(allActions[actionKey](dispatches[actionKey]));
    }
  }, []);
  return <ShopPageCart />;
}

export async function getServerSideProps({ locale, locales, req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale);

  const selectedLocale = locale !== "catchAll" ? locale : defaultLocaleSelected;

  // const parsedMetas = await metas.data.json();

  const dispatches = {
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  };

  return {
    props: {
      locale: selectedLocale,
      dispatches,
    },
  };
}

export default Cart;

import React, { useEffect, useState } from "react";
import PageCheckout from "../../components/shop/ShopPageCheckout";
import allActions from "../../services/actionsArray";
import shopApi from "../../api/shop";
import { generalProcessForAnyPage } from "../../services/utils";
import { url } from "../../helper";
import store from "../../store";

function Checkout({ locale, dispatches, payments }) {
  const { dispatch } = store;
  useEffect(() => {
    for (let actionKey in dispatches) {
      dispatch(allActions[actionKey](dispatches[actionKey]));
    }
  }, []);

  return <PageCheckout payments={payments} />;
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
  const payMethod = await fetch(`${url}/api/payments?locale=${selectedLocale}`)
    .then((responce) => responce.json())
    .then((res) =>
      res.map((e) => {
        return {
          ...e,
          key: e.method,
        };
      })
    );
  // const parsedMetas = await metas.data.json();

  const dispatches = {
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  };

  return {
    props: {
      locale: selectedLocale,
      currency,
      dispatches,
      payments: payMethod,
    },
  };
}

export default Checkout;

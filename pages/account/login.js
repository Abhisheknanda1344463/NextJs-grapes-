import React, { useEffect, useState } from "react";
import AccountPageLogin from "../../components/account/AccountPageLogin";
import allActions from "../../services/actionsArray";
import { generalProcessForAnyPage } from "../../services/utils";
import store from "../../store";
function Login({ locale, dispatches }) {
  const { dispatch } = store;
  useEffect(() => {
    for (let actionKey in dispatches) {
      dispatch(allActions[actionKey](dispatches[actionKey]));
    }
  }, [locale]);

  return <AccountPageLogin />;
}

export async function getServerSideProps({ locale, locales, req, res, query }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const { pageSlug, page = 1 } = query;

  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale);

  const selectedLocale = locale !== "catchAll" ? locale : defaultLocaleSelected;

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

export default Login;

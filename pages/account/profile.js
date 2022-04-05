import React, { useEffect, useState } from "react";
import AccountPageProfile from "../../components/account/AccountPageProfile";
import allActions from "../../services/actionsArray";
import { generalProcessForAnyPage } from "../../services/utils";
import store from "../../store";
function Profile({ locale, dispatches }) {
  const { dispatch } = store;
  useEffect(() => {
    for (let actionKey in dispatches) {
      dispatch(allActions[actionKey](dispatches[actionKey]));
    }
  }, []);
  return <AccountPageProfile />;
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

export default Profile;

import { useEffect } from "react";
import AccountForgotPassword from "../../components/account/AccountForgotPassword";
import store from "../../store";
import allActions from "../../services/actionsArray";
import { generalProcessForAnyPage } from "../../services/utils";

export default function forgotPassword(props) {
  const { dispatch } = store;
  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, [props.locale]);
  return <AccountForgotPassword />;
}
export async function getServerSideProps({ locale, locales, req, res, query }) {
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

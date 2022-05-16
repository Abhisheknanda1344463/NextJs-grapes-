import {useRouter} from "next/router";
import {useEffect} from "react";
import store from "../store";
import allActions from "../services/actionsArray";
import {generalProcessForAnyPage} from "../services/utils";
import AccountLogin from "components/account/AccountLogin";

export default function Login(props) {
  const {dispatch} = store;
  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, []);
  return <AccountLogin/>;
}

export async function getServerSideProps({locale, locales, req, res, query}) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale);

  const dbName = req.headers["x-forwarded-host"];

  const selectedLocale = locale !== "catchAll" ? locale : defaultLocaleSelected;

  const dispatches = {
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  };

  /////REMEBER NOT WORK
  // this code was commented
  const metas = await fetch(
    domainUrl(`${dbName}/db/get-meta?locale=${selectedLocale}`)
  );

  const data = await metas.json();
  console.log(data,"this is meta datat")

  return {
    props: {
      locale: selectedLocale,
      dispatches,
      metas: [],
    },
  };
}

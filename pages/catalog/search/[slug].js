import { useEffect } from "react";
import SearchedProducts from "../../../components/shop/SearchedProducts";
import { useRouter } from "next/router";
import store from "../../../store";
import allActions from "../../../services/actionsArray";
import { generalProcessForAnyPage } from "../../../services/utils";
export default function Catlog(props) {
  const { dispatch } = store;
  const { query } = useRouter();

  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, [props.locale]);

  return (
    <SearchedProducts
      columns={3}
      dbName={props.dbName}
      viewMode="grid"
      sidebarPosition="start"
      searchedItem={query.slug}
    />
  );
}

export async function getServerSideProps({
  ///query: { slug },
  locale,
  locales,
  req,
  query,
  res,
}) {
  // res.setHeader(
  //   "Cache-Control",
  //   "public, s-maxage=10, stale-while-revalidate=59"
  // );
  const dbName = req.headers["x-forwarded-host"];
  /////FIXME WE DONT NEED ALL THIS DATA
  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale);
  const selectedLocale = locale !== "catchAll" ? locale : defaultLocaleSelected;
  /////REMEBER WE NEED THIS BUT NEED TO OPTIMI
  const dispatches = {
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  };
  return {
    props: {
      dispatches,
      dbName: dbName,
      locale: selectedLocale,
    },
  };
}

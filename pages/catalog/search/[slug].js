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
  }, []);

  return (
    <SearchedProducts
      columns={3}
      viewMode="grid"
      sidebarPosition="start"
      searchedItem={query.slug}
    />
  );
}

export async function getServerSideProps(context) {
  const {
    query: { slug },
    locale,
    locales,
    req,
    res,
  } = context;

  const { token, dispatches: dispatchesGeneral } =
    await generalProcessForAnyPage(locale);
  /////REMEBER CHECK IT NEDD OR NO
  const dispatches = {
    ...dispatchesGeneral,
  };
  return {
    props: {
      dispatches,
      locale,
    },
  };
}

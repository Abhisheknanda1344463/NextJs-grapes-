import { useEffect } from "react";
import PageWishlist from "../../components/shop/ShopPageWishlist";
import store from "../../store";
import allActions from "../../services/actionsArray";
import { generalProcessForAnyPage } from "../../services/utils";

export default function Wishlist(props) {
  const { dispatch } = store;
  const firstLoad = true;
  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, [props.locale]);
  return <PageWishlist />;
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

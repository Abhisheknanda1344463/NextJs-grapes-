import { useEffect } from "react";
import { useRouter } from "next/router";

import store from "../../store";
import shopApi from "../../api/shop";
import allActions from "../../services/actionsArray";
import { generalProcessForAnyPage } from "../../services/utils";
import ShopPageProduct from "../../components/shop/ShopPageProduct";

export default function ProductInnerPage(props) {
  const query = useRouter();
  console.log(props.product, "props product in product slug")
  const { dispatch } = store;
  useEffect(() => {
    window.history.replaceState(null, "", window.location.pathname);
    ///router.push(window.location.pathname, window.location.pathname);
  }, [props.productSlug]);
  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, [props.locale]);
  return (
    <ShopPageProduct
      layout="standard"
      productSlug={props.productSlug}
      relatedPproducts={props.relatedPproducts}
      product={props.product}
      dispatches={props.dispatches}
      configurableVariantes={props.configurableVariantes}
      locale={props.locale}
      loading={true}
    />
  );
}

export async function getServerSideProps({ locale, locales, req, res, query }) {
  const { productSlug } = query;

  const {
    locale: defaultLocaleSelected,
    token,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale);

  const selectedLocale = locale !== "catchAll" ? locale : defaultLocaleSelected;

  const product = await shopApi.getProductBySlug(productSlug, {
    lang: selectedLocale,
    token: token,
  });
  const relatedPproducts = await shopApi.getRelatedProducts(product.cats, {
    lang: selectedLocale,
    currency: currency,
    limit: 8,
  });

  let configurabelConfigProduct = null;

  if (product.type == "configurable") {
    const configurableId = product.parent_id || product.product_id;
    configurabelConfigProduct = await shopApi.getConfigurabelConfigProduct(
      configurableId
    );
  }
  const dispatches = {
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  };
  return {
    props: {
      locale: selectedLocale,
      dispatches,
      productSlug: productSlug,
      product: { data: product },
      relatedPproducts: relatedPproducts,
      configurableVariantes: configurabelConfigProduct,
    },
  };
}

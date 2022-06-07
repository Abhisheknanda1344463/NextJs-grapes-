import { useEffect } from 'react'
import { useRouter } from 'next/router'

import store from '../../store'
import shopApi from '../../api/shop'
import allActions from '../../services/actionsArray'
import { generalProcessForAnyPage } from '../../services/utils'
import ShopPageProduct from '../../components/shop/ShopPageProduct'
import { MetaWrapper } from '../../components/MetaWrapper'
import Head from "next/head";
import { useSelector } from "react-redux"

export default function ProductInnerPage(props) {
  const query = useRouter();
  const prodID = props.product.data.product_id;
  const cats = props.product.data.cats;
  const checkRelatedProducts = props.relatedPproducts.filter(
    (item) => item.product_id !== prodID
  );
  const dbName = useSelector((state) => state.general.dbName);
  const { dispatch } = store;
  useEffect(() => {
    if (!props.currencies) {
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + `?currencies=${props.currencies}`
      );
    }

  }, [props.productSlug])

  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]))
    }
  }, [props.locale, props.currencies])



  return (
    <MetaWrapper
      title={props?.product?.data?.name}
      m_title={props?.product?.data?.meta_title ? props?.product?.data?.meta_title : props?.product?.data?.name}
      m_desc={props?.product?.data?.meta_description ? props?.product?.data?.meta_description : props?.product?.data?.name}
      m_key={props?.product?.data?.meta_keywords ? props?.product?.data?.meta_keywords : props?.product?.data?.name}
      m_img={props.dbName && `https://${props.dbName}/storage/${props?.product?.data?.base_imag?.path}`}
    >
      <ShopPageProduct
        rate={props.rate}
        layout="standard"
        productSlug={props.productSlug}
        relatedPproducts={checkRelatedProducts}
        product={props.product}
        dispatches={props.dispatches}
        configurableVariantes={props.configurableVariantes}
        locale={props.locale}
        loading={true}
        bundle={props.bundle}
        dbName={props.dbName}
      />
    </MetaWrapper>
    // <>
    //   <Head>
    //     <meta property="og:title" name="title"
    //           content={props?.product?.data?.meta_title ? props?.product?.data?.meta_title : props?.product?.data?.name}/>
    //     <meta property="og:description" name="description"
    //           content={props?.product?.data?.meta_description ? props?.product?.data?.meta_description : props?.product?.data?.name}/>
    //     <meta property="og:keywords" name="keywords"
    //           content={props?.product?.data?.meta_keywords ? props?.product?.data?.meta_keywords : props?.product?.data?.name}/>
    //     <meta
    //       property="og:image"
    //       name="image"
    //       content={`https://${dbName}/storage/${props?.product?.data?.base_imag?.path}`}
    //     />
    //     <meta name="twitter:card" content="summary_large_image"/>
    //     <meta name="twitter:title"
    //           content={props?.product?.data?.meta_title ? props?.product?.data?.meta_title : props?.product?.data?.name}/>
    //     <meta name="twitter:description"
    //           content={props?.product?.data?.meta_description ? props?.product?.data?.meta_description : props?.product?.data?.name}/>
    //     <meta name="twitter:image" content={`https://${dbName}/storage/${props?.product?.data?.base_imag?.path}`}/>
    //   </Head>
    //   <ShopPageProduct
    //     layout="standard"
    //     productSlug={props.productSlug}
    //     relatedPproducts={checkRelatedProducts}
    //     product={props.product}
    //     dispatches={props.dispatches}
    //     configurableVariantes={props.configurableVariantes}
    //     locale={props.locale}
    //     loading={true}
    //     bundle={props.bundle}
    //   />
    // </>
  )
}

export async function getServerSideProps({ locale, locales, req, res, query }) {
  ///////FIXME WE HAVE PROBLEM WITH RELETED PRODUCTS PRICE WITH CURENCY

  const { productSlug } = query;
  var selectedCurency;
  var databaseName;
  var selectedCurency;
  var selectedRate;

  const dbName = req.headers["x-forwarded-host"];
  ////CHECKING CURRENCY
  if (req.query.currencies != "") {
    selectedCurency = req.query.currencies;
  } else {
    selectedCurency = currency;
  }


  ////GETTING DOMAIN
  if (dbName.includes(".zegashop.com")) {
    var dataName = dbName.split(".zegashop.com");
    databaseName = dataName[0];
    process.env.domainName = dbName;
    process.env.databaseName = databaseName;
  } else {
    process.env.domainName = dbName;
    databaseName =
      dbName.split(".")[0] == "www"
        ? dbName.split(".")[1]
        : dbName.split(".")[0];

    process.env.databaseName = databaseName;
  }
  const {
    locale: defaultLocaleSelected,
    currency,
    rate,
    token,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale, dbName, selectedCurency);
  ////GETTING RATE FOR CURRENCY
  if (req.query.currencies != "") {
    selectedRate = rate.currencies_new.find(
      (item) => item.code == selectedCurency
    );
  }
  const selectedLocale = locale !== "catchAll" ? locale : defaultLocaleSelected;

  const product = await shopApi.getProductBySlug(productSlug, {
    lang: selectedLocale,
    token: token,
    selectedRate: selectedRate?.exchange_rate.rate || 1,
  });
  const relatedPproducts = await shopApi.getRelatedProducts(
    product.cats,
    product.product_id,
    {
      lang: selectedLocale,
      currency: selectedRate,
      limit: 8,
      selectedRate: selectedRate?.exchange_rate.rate || 1,
    }
  );

  let configurabelConfigProduct = null;
  let bundleProduct = null;

  if (product.type == "configurable") {
    const configurableId = product.parent_id || product.product_id;
    configurabelConfigProduct = await shopApi.getConfigurabelConfigProduct(
      configurableId
    );
  }

  if (product.type == "bundle") {
    bundleProduct = await shopApi.getBundleProduct(product.product_id, {
      lang: selectedLocale,
      currency: currency,
    });
  }
  const dispatches = {
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  };

  return {
    props: {
      locale: selectedLocale,
      dispatches,
      rate: selectedRate?.exchange_rate.rate || 1,
      currencies: selectedCurency,
      productSlug: productSlug,
      product: { data: product },
      relatedPproducts: relatedPproducts,
      configurableVariantes: configurabelConfigProduct,
      bundle: bundleProduct,
      dbName,
    },
  };
}

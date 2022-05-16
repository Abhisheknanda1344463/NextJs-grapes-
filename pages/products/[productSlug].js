import {useEffect} from 'react'
import {useRouter} from 'next/router'

import store from '../../store'
import shopApi from '../../api/shop'
import allActions from '../../services/actionsArray'
import {generalProcessForAnyPage} from '../../services/utils'
import ShopPageProduct from '../../components/shop/ShopPageProduct'
import Head from "next/head";
import {useSelector} from "react-redux"

export default function ProductInnerPage(props) {
  const query = useRouter()
  const prodID = props.product.data.product_id
  const cats = props.product.data.cats
  const checkRelatedProducts = props.relatedPproducts.filter(item => item.product_id !== prodID)
  const dbName = useSelector(state => state.general.dbName);
  console.log(dbName, "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
  const {dispatch} = store
  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname)
    ///router.push(window.location.pathname, window.location.pathname);
  }, [props.productSlug])
  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]))
    }
  }, [props.locale])

  // useEffect(() => {
  //
  // },[])
  console.log(props, "prosp in product slug")
  return (
    <>
      <Head>
        <meta property="og:title" name="title"
              content={props?.product?.data?.meta_title ? props?.product?.data?.meta_title : props?.product?.data?.name}/>
        <meta property="og:description" name="description"
              content={props?.product?.data?.meta_description ? props?.product?.data?.meta_description : props?.product?.data?.name}/>
        <meta property="og:keywords" name="keywords"
              content={props?.product?.data?.meta_keywords ? props?.product?.data?.meta_keywords : props?.product?.data?.name}/>
        <meta
          property="og:image"
          name="image"
          content={`https://${dbName}/storage/${props?.product?.data?.base_imag?.path}`}
        />
      </Head>
      <ShopPageProduct
        layout="standard"
        productSlug={props.productSlug}
        relatedPproducts={checkRelatedProducts}
        product={props.product}
        dispatches={props.dispatches}
        configurableVariantes={props.configurableVariantes}
        locale={props.locale}
        loading={true}
        bundle={props.bundle}
      />
    </>
  )
}


export async function getServerSideProps({locale, locales, req, res, query}) {
  const {productSlug} = query

  const {
    locale: defaultLocaleSelected,
    token,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale)

  const selectedLocale = locale !== 'catchAll' ? locale : defaultLocaleSelected

  const product = await shopApi.getProductBySlug(productSlug, {
    lang: selectedLocale,
    token: token,
  })
  const relatedPproducts = await shopApi.getRelatedProducts(product.cats, product.product_id, {
    lang: selectedLocale,
    currency: currency,
    limit: 8,
  })

  let configurabelConfigProduct = null
  let bundleProduct = null

  if (product.type == 'configurable') {
    const configurableId = product.parent_id || product.product_id
    configurabelConfigProduct = await shopApi.getConfigurabelConfigProduct(
      configurableId,
    )
  }

  if (product.type == "bundle") {
    bundleProduct = await shopApi.getBundleProduct(product.product_id, {
      lang: selectedLocale,
      currency: currency,
    })

  }
  const dispatches = {
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  }


  return {
    props: {
      locale: selectedLocale,
      dispatches,
      productSlug: productSlug,
      product: {data: product},
      relatedPproducts: relatedPproducts,
      configurableVariantes: configurabelConfigProduct,
      bundle: bundleProduct,
    },
  }
}

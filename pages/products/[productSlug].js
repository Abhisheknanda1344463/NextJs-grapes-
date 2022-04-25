import {useEffect} from 'react'
import {useRouter} from 'next/router'

import store from '../../store'
import shopApi from '../../api/shop'
import allActions from '../../services/actionsArray'
import {generalProcessForAnyPage} from '../../services/utils'
import ShopPageProduct from '../../components/shop/ShopPageProduct'


export default function ProductInnerPage(props) {
  const query = useRouter()
  const prodID = props.product.data.product_id
  const cats = props.product.data.cats

  console.log(props, 'prop in product slug___________________________')
  const checkRelatedProducts = props.relatedPproducts.filter(item => item.product_id !== prodID)
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
  return (
    <ShopPageProduct
      layout="standard"
      productSlug={props.productSlug}
      relatedPproducts={checkRelatedProducts}
      product={props.product}
      dispatches={props.dispatches}
      configurableVariantes={props.configurableVariantes}
      crossSellProducts={props.crossSellProducts}
      upSellProducts={props.upSellProducts}
      locale={props.locale}
      loading={true}
    />
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

  const crossSellProducts = await shopApi.getCrossSellProducts(product.product_id, {
    lang: selectedLocale,
    currency: currency,
    limit: 8,
  })

  const upSellProducts = await shopApi.getUpSellProducts(product.product_id, {
    lang: selectedLocale,
    currency: currency,
    limit: 8,
  })

  let configurabelConfigProduct = null

  if (product.type == 'configurable') {
    const configurableId = product.parent_id || product.product_id
    configurabelConfigProduct = await shopApi.getConfigurabelConfigProduct(
      configurableId,
    )
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
      crossSellProducts: crossSellProducts,
      upSellProducts: upSellProducts,
    },
  }
}

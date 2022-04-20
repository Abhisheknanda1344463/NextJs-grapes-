import { useEffect } from 'react'
import ShopPageCategory from '../../components/shop/ShopPageCategory'
import { useRouter } from 'next/router'
import shopApi from '../../api/shop'
import store from '../../store'
import { ApiCustomSettingsAsync } from '../../services/utils'
import serverSideActions from '../../services/serverSide'
import allActions from '../../services/actionsArray'

import clientSideActions from '../../services/clientSide'
import { generalProcessForAnyPage } from '../../services/utils'



export default function Catlog(props) {
  const { query, router } = useRouter()
  const { dispatch } = store
  ////console.log(props.locale, "props.localeprops.locale");
  // useEffect(() => {
  //   window.history.replaceState(null, "", window.location.pathname);
  //   ///router.push(window.location.pathname, window.location.pathname);
  // }, [query.slug]);

  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]))
    }
  }, [props.locale])

  return (
    <ShopPageCategory
      columns={3}
      viewMode="grid"
      sidebarPosition="start"
      categorySlug={query.slug}
      locale={props.locale}
      dbName={props.dbName}
      productsList={props.productsList}
      {...props}
    />
  )
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
  const dbName = req.headers['x-forwarded-host']
  /////FIXME WE DONT NEED ALL THIS DATA
  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale)
  const selectedLocale = locale != 'catchAll' ? locale : defaultLocaleSelected
  let categoryId,
    categoryTitle,
    dispatches,
    brands = [],
    productsList = []

  // console.log(
  //   selectedLocale,
  //   locale,
  //   defaultLocaleSelected,
  //   "selectedLocaleselectedLocaleselectedLocale"
  // );

  const settingsResponse = await ApiCustomSettingsAsync(selectedLocale)

  const categoriesResponse = await shopApi.getCategories({
    locale: selectedLocale,
  })


  function getItems(array) {
    array.forEach((e, i) => {
      if (e.slug == query.slug && e.children?.length === 0) {
        categoryId = e.id
        categoryTitle = e.name
        return false
      } else {
        getItems(e.children)
      }
    })
  }


  if (categoriesResponse?.categories) {
    getItems(categoriesResponse.categories[0].children)
  }

  await shopApi
    .getFilters(categoryId ? categoryId : query.cat_id, {
      lang: selectedLocale,
      currency: { code: settingsResponse.data.currency.code },
      limit: 8,
    })
    .then((data) => {
      brands = data
    })

  await shopApi
    .getProductsList({
      options: {
        currency: { code: settingsResponse.data.currency.code },
        locale: selectedLocale,
      },
      filters: {},
      location: '',
      dbName: dbName,
      catID: categoryId ? categoryId : query.cat_id,
      window: null,
      limit: 6,
    })
    .then((responseProductList) => {
      dispatches = {
        ...dispatches,
        ...responseProductList.dispatches,
      }
      productsList = responseProductList
    })

  /////REMEBER WE NEED THIS BUT NEED TO OPTIMI
  const dispatchesNew = {
    ...dispatches,
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  }

  return {
    props: {
      currency: { code: settingsResponse.data.currency.code },
      productsList: productsList,
      brandList: brands,
      categoryId,
      dbName: dbName,
      categoryTitle,
      dispatches: dispatchesNew,
      locale: selectedLocale,
    },
  }
}

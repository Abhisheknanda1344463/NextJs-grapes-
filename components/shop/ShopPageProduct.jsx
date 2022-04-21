// react
import React, { useEffect, useState, useRef } from 'react'
import PropTypes                              from 'prop-types'
import { useSelector }                        from 'react-redux'
import { Helmet }                             from 'react-helmet-async'
import { FormattedMessage }                   from 'react-intl'
import theme                                  from '../../data/theme'
import shopApi                                from '../../api/shop'
import Product                                from '../shared/Product'
import { url }                                from '../../services/utils'
import PageHeader                             from '../shared/PageHeader'
import BlockLoader                            from '../blocks/BlockLoader'
import WidgetProducts                         from '../widgets/WidgetProducts'
import categories                             from '../../data/shopWidgetCategories'
import WidgetCategories                       from '../widgets/WidgetCategories'
import BlockProductsCarousel                  from '../blocks/BlockProductsCarousel'
import { useRouter }                          from 'next/router'



function ShopPageProduct (props) {
  const { productSlug, layout, product, sidebarPosition, locale, loading } = props
  const [isLoading, setIsLoading] = useState(loading)
  const [relatedProducts, setRelatedProducts] = useState(props.relatedPproducts)
  const router = useRouter()
  ////const [product, setProduct] = useState(data);

  const customer = useSelector((state) => state.customer)
  const currency = useSelector((state) => state.currency.current)
  const selectedData = locale
  const prevProductSlugRef = useRef()
  const prevLocaleRef = useRef()

  useEffect(() => {
    setIsLoading(false)
    prevProductSlugRef.current = productSlug
    prevLocaleRef.current = props.locale
    /// setProduct(data);
  }, [])

  useEffect(() => {
    // const location = `/products/${productSlug}`;
    // window.history.replaceState(null, "", location);
    prevProductSlugRef.current = productSlug
    prevLocaleRef.current = props.locale
    setRelatedProducts(props.relatedPproducts)

    /// setProduct(data);
  }, [productSlug, router.locale, relatedProducts])

  // useEffect(() => {
  //   setProduct(data);
  // }, [router.locale, productSlug]);

  if (isLoading) {
    return <BlockLoader/>
  }

  const breadcrumb = [
    {
      title: <FormattedMessage id="home" defaultMessage="Home"/>,
      url  : url.home(),
    },
    { title: product.data.name, url: url.product(product.data) },
  ]

  const related = (
    <FormattedMessage id="relatedProducts" defaultMessage="Related products"/>
  )

  let content

  if (layout === 'sidebar') {
    const sidebar = (
      <div className="shop-layout__sidebar">
        <div className="block block-sidebar">
          <div className="block-sidebar__item">
            <WidgetCategories categories={categories} location="shop"/>
          </div>
          <div className="block-sidebar__item d-none d-lg-block">
            {/*<WidgetProducts title="Latest Products" products={crossProducts}/>*/}
          </div>
        </div>
      </div>
    )
    content = (
      <div className="container">
        <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
          {sidebarPosition === 'start' && sidebar}
          <div className=" shop-layout__content">
            <div className=" block">
              <Product
                product={product}
                layout={layout}
                productSlug={productSlug}
                configurableVariantes={props?.configurableVariantes || null}
                locale={router.locale}
              />
              {/*<ProductTabs withSidebar />*/}
            </div>

            {Object.keys(props.relatedPproducts).length > 0 && (
              <BlockProductsCarousel
                title={related}
                layout="grid-4-sm"
                products={Object.values(props.relatedPproducts)}
                locale={router.locale}
                // withSidebar
              />
            )}
          </div>
          {sidebarPosition === 'end' && sidebar}
        </div>
      </div>
    )
  } else {
    content = (
      <React.Fragment>
        <div className="block">
          <div className="container p-0">
            <Product
              product={props.product}
              productSlug={props.productSlug}
              layout={layout}
              customer={customer}
              configurableVariantes={props?.configurableVariantes || null}
              locale={router.locale}
            />
          </div>
        </div>

        {Object.keys(props.relatedPproducts).length > 0 && (
          <BlockProductsCarousel
            customer={customer}
            title={related}
            layout="grid-5"
            products={Object.values(props.relatedPproducts)}
            locale={router.locale}
          />
        )}
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <Helmet>
        <title>{`${product.data.name} — ${theme.name}`}</title>
      </Helmet>

      <PageHeader breadcrumb={breadcrumb}/>

      <div className="take-product-page">
        {content}
      </div>
    </React.Fragment>
  )
}


ShopPageProduct.propTypes = {
  /** Product slug. */
  productSlug: PropTypes.string,
  /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
  layout: PropTypes.oneOf(['standard', 'sidebar', 'columnar', 'quickview']),
  /**
   * sidebar position (default: 'start')
   * one of ['start', 'end']
   * for LTR scripts "start" is "left" and "end" is "right"
   */
  sidebarPosition: PropTypes.oneOf(['start', 'end']),
}

ShopPageProduct.defaultProps = {
  layout         : 'standard',
  sidebarPosition: 'start',
}

export default ShopPageProduct

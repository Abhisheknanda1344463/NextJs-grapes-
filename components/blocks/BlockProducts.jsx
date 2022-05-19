// react
import React from 'react'
import {useSelector} from 'react-redux'

// third-party
import PropTypes from 'prop-types'

// application
import BlockHeaderCustom from '../shared/BlockHeaderCustom'
import ProductCard from '../shared/ProductCard'
import {Helmet} from 'react-helmet-async'
import PopupModal from 'components/popupComponents/PopupModal'
import Head from 'next/head'


function BlockProducts(props) {
  const {customer, title, layout, featuredProduct, products, addInClass} =
    props
  const backorders = useSelector(state => state.general.coreConfigs.catalog_inventory_stock_options_backorders)
  const outOfStock = useSelector(state => state.general.coreConfigs.catalog_products_homepage_out_of_stock_items)
  let large = null
  let smalls = null

  // const arrayMeta = []

  const schemaProducts = {
    '@context': '/products',
    '@type': 'ItemList',
    'name': 'Products',
    'itemListElement': [],
  }

  if (featuredProduct) {
    large = (
      <div className="block-products__featured">
        <div className="block-products__featured-item">
          <ProductCard product={featuredProduct} customer={customer}/>
        </div>
      </div>
    )
  }
  if (products.length > 0) {

    const productsList = products.map((product, index) => {
      //these arrayMetas were commented for some reason....
      // arrayMeta.push(<meta name="name" content={product.name}/>)
      // arrayMeta.push(<meta name="description" content={product.meta_description}/>)

      schemaProducts.itemListElement.push({
        '@type': 'ListItem',
        'position': products.indexOf(product),
        'item': {
          'name': product.name,
          'description': product.meta_description || product.description,
          'price': product.formatted_price,
        },
      })

      return (
        product.qty === 0 && backorders == 0 && outOfStock == 0
          ? <></>
          : <div key={index} className="product-card-parent">
            <div className="block-products__list-item">
              <ProductCard product={product} customer={customer}/>
            </div>
          </div>

      )
    })

    smalls = <div className="block-products__list">{productsList}</div>
  }


  function renderSmall() {
    if (products.length > 0)
      return (
        <div className="block-products__list">
          {products.map((product, index) => {

            schemaProducts.itemListElement.push({
              '@type': 'ListItem',
              'position': products.indexOf(product),
              'item': {
                'name': product.name,
                'description': product.meta_description || product.description,
                'price': product.formatted_price,
              },
            })
            //these arrayMetas were commented for some reason....
            // arrayMeta.push(<meta name="name" content={product.name}/>)
            // arrayMeta.push(<meta name="description" content={product.meta_description}/>)
            return (
              product.qty === 0 && backorders == 0 && outOfStock == 0
                ? <></>
                : <div key={index} className="product-card-parent">
                  <div className="block-products__list-item">
                    <ProductCard product={product} customer={customer}/>
                  </div>
                </div>
            )
          })}
        </div>
      )
  }

  // console.log(arrayMeta, "")
  return (
    <React.Fragment>
      <Head>
        {/*{arrayMeta.map(item => item)}*/}
        <script type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(schemaProducts)}}
        />
        {/*<Helmet>{arrayMeta}</Helmet>*/}
      </Head>

      <div className={`block-products block-products--layout--${layout}`}>
        <div className="container p-0 home-product-container">
          {/*<div className="container_fm">*/}

          {smalls ? <BlockHeaderCustom title={title}/> : ''}

          <div className={`block-products__body block-${addInClass}-products`}>
            {layout === 'large-first' && large}
            {renderSmall()}
            {layout === 'large-last' && large}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}


export default React.memo(BlockProducts)

BlockProducts.propTypes = {
  title: PropTypes.string.isRequired,
  featuredProduct: PropTypes.object,
  products: PropTypes.array,
  layout: PropTypes.oneOf(['large-first', 'large-last']),
}

BlockProducts.defaultProps = {
  products: [],
  layout: 'large-first',
}

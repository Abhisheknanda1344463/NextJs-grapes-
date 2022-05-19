// react
import React, { useCallback, useState } from 'react'

// third-party
import classNames       from 'classnames'
import PropTypes        from 'prop-types'
import { connect }      from 'react-redux'
import { useSelector }  from 'react-redux'
// application
import Pagination       from '../shared/Pagination'
import ProductCard      from '../shared/ProductCard'
import { Filters16Svg } from '../../svg'
import { sidebarOpen }  from '../../store/sidebar'

import { Helmet }           from 'react-helmet-async'
import { FormattedMessage } from 'react-intl'
import Arrow                from '../../custom-svg/arrow.svg'



function useSetOption (option, filter, dispatch) {
  const callback = useCallback(filter, [])

  return useCallback(
    (data) => {
      dispatch({
        type : 'SET_OPTION_VALUE',
        option,
        value: callback(data),
      })
    },
    [option, callback, dispatch],
  )
}


function ProductsView (props) {
  const {
          length,
          locale,
          isLoading,
          productsList,
          options,
          filters,
          dispatch,
          layout: propsLayout,
          grid,
          offcanvas,
          sidebarOpen,
          forPage,
        } = props
  const [layout, setLayout] = useState(propsLayout)

  const customer = useSelector((state) => state.customer)
  const backorders = useSelector(state => state.general.coreConfigs.catalog_inventory_stock_options_backorders)
  const outOfStock = useSelector(state => state.general.coreConfigs.catalog_products_homepage_out_of_stock_items)
  const handlePageChange = useSetOption('page', parseFloat, dispatch)
  const handleSortChange = useSetOption(
    'sort',
    (event) => event.target.value,
    dispatch,
  )
  const handleLimitChange = useSetOption(
    'limit',
    (event) => parseFloat(event.target.value),
    dispatch,
  )

  const handleResetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' })
  }, [dispatch])
  const filtersCount = Object.keys(filters)
    .map((x) => filters[x])
    .filter((x) => x).length
  // const arrayMeta = []
  const productsListItems = productsList['data'].map((product, index) => {
    // arrayMeta.push(<meta name="description" content={product.description}/>)
    // arrayMeta.push(<meta name="name" content={product.name}/>)

    return (
      <>
        {forPage == 'search' ? (
          product.qty === 0 && backorders == 0 && outOfStock == 0
            ? <></>
            : <div key={index} className="products-list__item found-product-card">
              <ProductCard product={product} customer={customer}/>
            </div>
        ) : (
          product.qty === 0 && backorders == 0 && outOfStock == 0
            ? <></>
            : <div key={index} className="products-list__item">
              <ProductCard product={product} customer={customer}/>
            </div>
        )}
      </>
    )
  })

  const rootClasses = classNames('products-view', {
    'products-view--loading': isLoading,
  })

  const viewOptionsClasses = classNames('view-options', {
    'view-options--offcanvas--always': offcanvas === 'always',
    'view-options--offcanvas--mobile': offcanvas === 'mobile',
  })

  let content

  if (productsListItems.length > 0) {
    content = (
      <div className="products-view__content">
        <div
          className="products-view__list products-list"
          data-layout={layout !== 'list' ? grid : layout}
          data-with-features={
            layout === 'grid-with-features' ? 'true' : 'false'
          }
        >
          <div className="products-list__body">{productsListItems}</div>
        </div>
      </div>
    )
  } else {
    content = (
      <div className="products-view__empty">
        <div className="products-view__empty-title">
          <FormattedMessage
            id="SorryNothingFoundFor"
            defaultMessage="No matching items"
          />{' '}
        </div>
        <div className="products-view__empty-subtitle">
          <FormattedMessage
            id="resetfilters"
            defaultMessage="Try to reset filters"
          />
        </div>
        {productsList.data.length == 0 &&
        Object.keys(filters).length == 0 ? null : (
          <button
            type="button"
            className="btn btn-orange rounded-pill btn-sm"
            onClick={handleResetFilters}
          >
            <FormattedMessage id="resetfilters" defaultMessage="Reset"/>
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      {/*<Helmet>{arrayMeta}</Helmet>*/}
      <div className={rootClasses}>
        <div className="products-view__loader"/>
        {content}
      </div>
    </>
  )
}


ProductsView.propTypes = {
  /**
   * Indicates that products is loading.
   */
  isLoading: PropTypes.bool,
  /**
   * ProductsList object.
   */
  productsList: PropTypes.array,
  /**
   * Products list options.
   */
  options: PropTypes.object,
  /**
   * Products list filters.
   */
  filters: PropTypes.object,
  /**
   * Category page dispatcher.
   */
  dispatch: PropTypes.func,
  /**
   * products list layout (default: 'grid')
   * one of ['grid', 'grid-with-features', 'list']
   */
  layout: PropTypes.oneOf(['grid', 'grid-with-features', 'list']),
  /**
   * products list layout (default: 'grid')
   * one of ['grid-3-sidebar', 'grid-4-full', 'grid-5-full']
   */
  grid: PropTypes.oneOf(['grid-3-sidebar', 'grid-4-full', 'grid-5-full']),
  /**
   * indicates when sidebar should be off canvas
   */
  offcanvas: PropTypes.oneOf(['always', 'mobile']),
}

ProductsView.defaultProps = {
  layout   : 'grid',
  grid     : 'grid-3-sidebar',
  offcanvas: 'mobile',
}

const mapDispatchToProps = {
  sidebarOpen,
}

export default connect(() => ({}), mapDispatchToProps)(ProductsView)

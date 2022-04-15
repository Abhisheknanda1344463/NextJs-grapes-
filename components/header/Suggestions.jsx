// react
import React, { useState, useEffect } from 'react'

// third-party
import classNames               from 'classnames'
import { connect, useSelector } from 'react-redux'
import Link                     from 'next/link'

// application
import AsyncAction                  from '../shared/AsyncAction'
import { Cart16Svg }                from '../../svg'
import { cartAddItem }              from '../../store/cart'
import { url }                      from '../../services/utils'
import Currency                     from '../shared/Currency'
import { apiUrlWithStore, urlLink } from '../../helper'
import Image                        from 'components/hoc/Image'
import { defoult }                  from '../../images/defoultpic.png'
import { FormattedMessage }         from 'react-intl'



function Suggestions (props) {
  // console.log(props, "prosp in suggestion")
  const { context, className, products, cartAddItem } = props
  const rootClasses = classNames(
    `suggestions suggestions--location--${context}`,
    className,
  )
  const [token, setToken] = useState()
  const customer = useSelector((state) => state.customer)
  const selectedData = useSelector((state) => state.locale.code)
  const apiToken = useSelector((state) => state.general.apiToken)
  const backorders = useSelector(state => state.general.coreConfigs.catalog_inventory_stock_options_backorders)
  const outOfStock = useSelector(state => state.general.coreConfigs.catalog_products_homepage_out_of_stock_items)

  useEffect(() => {
    console.log(apiToken, 'apitoken')
    console.log(customer, 'customer')
    ///setToken(apiToken);
    fetch(apiUrlWithStore('/api/checkout/cart/token'))
      .then((responce) => responce.json())
      .then((res) => {
        setToken(res)
      })
      .catch((err) => console.error(err))
  }, [apiToken])

  const list =
          products &&
          products.map((product) =>

            product.id != -1 ?
              product.qty === 0 && backorders == 0 && outOfStock == 0
                ? <></>
                : (
                  <li key={product.product_id} className="suggestions__item">
                    {product.images &&
                    product.images.length > 0 && (
                      <div className="suggestions__item-image product-image">
                        <div className="search-product-image__body-fms">
                          <Image
                            className="product-image__img suggestion-img"
                            src={
                              `storage/${product.images[0].path}`
                                ? `storage/${product.images[0].path}`
                                : defoult
                            }
                            alt=""
                            layout="fill"
                          />
                        </div>
                      </div>
                    ) ? (
                      <div className="suggestions__item-image product-image">
                        <div className="search-product-image__body-fms">
                          <Link href={url.product(product)}>
                            <a>
                              <Image
                                className="product-image__img suggestion-img"
                                src={
                                  `storage/${product.images[0].path}`
                                    ? `storage/${product.images[0].path}`
                                    : defoult
                                }
                                alt=""
                                layout="fill"
                              />
                            </a>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="suggestions__item-image product-image">
                        <div className="search-product-image__body-fms">
                          <Image
                            className="product-image__img suggestion-img"
                            src={defoult}
                            alt=""
                            layout="fill"
                          />
                        </div>
                      </div>
                    )}
                    <div className="suggestions__item-info">
                      <Link
                        className="suggestions__item-name"
                        href={url.product(product)}
                      >
                        {product.name}
                      </Link>
                      <div className="suggestions__item-meta">SKU: {product.sku}</div>
                    </div>
                    <div className="suggestions__item-price">
                      {console.log(product, 'productproduct')}
                      Դ{' '}
                      <Currency
                        value={
                          product.formatted_special_price
                            ? product.formatted_special_price
                            : product.formatted_price ||
                            Number(product.min_price).toFixed(2)
                        }
                      />
                    </div>
                    {context === 'header' && (
                      <div className="suggestions__item-actions">
                        <AsyncAction
                          action={() =>
                            cartAddItem(
                              product,
                              [],
                              1,
                              token,
                              customer,
                              selectedData,
                            )
                          }
                          render={({ run, loading }) => (
                            <button
                              type="button"
                              onClick={run}
                              title="Add to cart"
                              className={classNames(
                                'btn btn-primary btn-sm btn-svg-icon suggestion-btn',
                                {
                                  'btn-loading': loading,
                                },
                              )}
                            >
                              <Cart16Svg/>
                            </button>
                          )}
                        />
                      </div>
                    )}
                  </li>
                ) : (
                <div className="search__fm_dr_Message">
                  {console.log(product, "productId in Suggestion")}
                  <FormattedMessage
                    id="noMatching"
                    defaultMessage="No matching items"
                  />
                </div>
              ),
          )

  return (
    <div className={rootClasses}>
      <ul className="suggestions__list">{list}</ul>
    </div>
  )
}


const mapStateToProps = () => ({})

const mapDispatchToProps = {
  cartAddItem,
}

export default connect(mapStateToProps, mapDispatchToProps)(Suggestions)

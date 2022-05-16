import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import { wishlistRemoveItem } from '../../store/wishlist'
import { url } from '../../services/utils'
import Currency from './Currency'
import InputNumber from './InputNumber'
import { AddImages } from '../../store/image'
import { AddCartToken } from '../../store/token'
import { compareAddItem } from '../../store/compare'
import { wishlistAddItem } from '../../store/wishlist'
import ProductGallery from './ProductGallery'
import AsyncAction from './AsyncAction'
import { cartAddItem, cartRemoveItem } from '../../store/cart'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import { connect, useSelector, useDispatch } from 'react-redux'
import { setPopup, setPopupName, setUpCrossProd, setTempData } from '../../store/general'
import shopApi from '../../api/shop'
import Link from 'next/link'


const UpSellCard = (props) => {

  const {
    product,
    oldProduct,
    selectedData,
    cartToken,
    customer,
    setPopupName,
    cartAddItem,
    setPopup,
    setUpCrossProd,
    setTempData,
  } = props
  const backorders = useSelector(state => state.general.coreConfigs.catalog_inventory_stock_options_backorders)
  const outOfStock = useSelector(state => state.general.coreConfigs.catalog_products_homepage_out_of_stock_items)

  const getUpCrosselProd = (prodID, type) => {
    switch (type) {
      case 'upsel':
        shopApi.getUpSellProducts(prodID).then(res => {
          setUpCrossProd(res)
        })
        break
      case 'crossel':
        shopApi.getCrossSellProducts(prodID).then(res => {
          if (res.length === 0) {
            setPopup(false)
          }
          setUpCrossProd(res)
        })
        break
    }

  }

  const createMarkup = (item) => {
    return { __html: item }
  }
  //
  // const handleChangeQuantity = (quantity) => {
  //   setQuantity(() => quantity)
  // }

  return (
    <div className="upsell_body">
      {
        product && product.images && (

          <div className="product__content">
            <ProductGallery images={product.images} ups={true} />
            <div className="product__info">
              {/*<div className="product__wishlist-compare">*/}
              {/*  <AsyncAction*/}
              {/*    action={() => wishlistAddItem(product, selectedData)}*/}
              {/*    render={({run, loading}) => (*/}
              {/*      <button*/}
              {/*        type="button"*/}
              {/*        data-toggle="tooltip"*/}
              {/*        data-placement="right"*/}
              {/*        title="Wishlist"*/}
              {/*        onClick={run}*/}
              {/*        className={classNames(*/}
              {/*          'btn btn-sm btn-light btn-svg-icon',*/}
              {/*          {*/}
              {/*            'btn-loading': loading,*/}
              {/*          },*/}
              {/*        )}*/}
              {/*      >*/}
              {/*        <Wishlist16Svg/>*/}
              {/*      </button>*/}
              {/*    )}*/}
              {/*  />*/}
              {/*</div>*/}

              <div className="product__rating"></div>
              <p className="f16">
                <FormattedMessage
                  id="product_sku"
                  defaultMessage="SKU"
                />
                {": "}
                {product.sku}</p>
              <h1
                className="product__name"
                dangerouslySetInnerHTML={createMarkup(product.name)}
              ></h1>
              <div className="product__prices color-lightgray">
                {/*{product.data.formated_special_price ? (*/}
                {/*  <>*/}
                {/*    <span className="product-card__new-price">*/}
                {/*      <Currency value={product.data.formated_special_price} />*/}
                {/*    </span>*/}
                {/*    <span className="product-card__old-price">*/}
                {/*      <Currency value={product.data.formatted_price} />*/}
                {/*    </span>*/}
                {/*  </>*/}
                {/*) : (*/}
                {/*  <span>*/}
                {/*    <Currency value={product.data.formatted_price} />*/}
                {/*  </span>*/}
                {/*)}*/}
                {/*   need to refacor when add function checking currency*/}
                {/*{product.special_price &&*/}
                {/*date_now >= date_from &&*/}
                {/*date_now <= date_to ? (*/}
                {/*  <>*/}
                {/*    <span className="product-card__new-price">*/}
                {/*      <Currency*/}
                {/*        value={Number(product.special_price).toFixed(0)}*/}
                {/*      />*/}
                {/*      <span*/}
                {/*        className="product-card__symbol"*/}
                {/*        style={{ marginLeft: '5px' }}*/}
                {/*      >*/}
                {/*        ֏*/}
                {/*      </span>*/}
                {/*    </span>*/}

                {/*    <span className="product-card__old-price">*/}
                {/*      <Currency value={Number(product.price).toFixed(0)}/>*/}
                {/*      <span*/}
                {/*        className="product-card__symbol"*/}
                {/*        style={{ marginLeft: '5px' }}*/}
                {/*      >*/}
                {/*        ֏*/}
                {/*      </span>*/}
                {/*    </span>*/}
                {/*  </>*/}
                {/*) : */}
                {product?.special_price ? (
                  <>
                    <span className="product-card__new-price">
                      <Currency
                        value={Number(product.special_price).toFixed(0)}
                      />
                      <span
                        className="product-card__symbol"
                      // style={{marginLeft: '5px'}}
                      >
                        ֏
                      </span>
                    </span>

                    <span className="product-card__old-price">
                      <Currency value={Number(product.price).toFixed(0)} />
                      <span
                        className="product-card__symbol"
                        style={{ marginLeft: '5px' }}
                      >
                        ֏
                      </span>
                    </span>
                  </>
                ) : (
                  <span>

                    <Currency
                      value={
                        product.price > 0
                          ? Number(product.price).toFixed(0)
                          : Number(product.min_price).toFixed(0)
                        // : ''
                      }
                    />
                    <span
                      className="product-card__symbol"
                    // style={{marginLeft: '5px'}}
                    >
                      ֏
                    </span>
                  </span>
                )}
              </div>
              <div>
                {product.price_html
                  ? product.price_html.map((e, i) => (
                    <span key={i} className="product_price_html">
                      {e}
                    </span>
                  ))
                  : ''}
              </div>
              <div className="short_description_block">
                <div className="product-inner-description-title">
                  <FormattedMessage
                    id="short.description"
                    defaultMessage="Short Description"
                  />
                </div>
                <div
                  className="f16"
                  dangerouslySetInnerHTML={createMarkup(
                    product.short_description,
                  )}
                />
              </div>
              <ul className="product__meta">
                <li className="product__meta-availability">
                  <span
                    className={
                      product.qty > 0
                        || product.qty === 0
                        && backorders == 1
                        ? `text-success`
                        : product.qty === 0
                          && backorders == 0
                          ? `text-danger`
                          : `text-danger`
                    }
                    style={{ fontSize: '18px' }}
                  >
                    {product.qty > 0 ? (
                      <FormattedMessage
                        id="instock"
                        defaultMessage="In stock"
                      />
                    ) :
                      product.qty === 0
                        && backorders == 1
                        && outOfStock == 0 ||
                        product.qty === 0
                        && backorders == 1
                        && outOfStock == 1 ? (
                        <FormattedMessage
                          id="instock"
                          defaultMessage="In stock"
                        />
                      ) : product.qty === 0
                        && backorders == 0
                        && outOfStock == 1 ? (
                        <FormattedMessage
                          id="outOfStock"
                          defaultMessage="Not available"
                        />
                      ) : (
                        <FormattedMessage
                          id="outOfStock"
                          defaultMessage="Not available"
                        />
                      )}{' '}
                  </span>
                </li>
              </ul>
            </div>
            <div className="product__sidebar">
              <div className="product__availability">
                {product.qty > 0 ? 'Availability' : 'Unavailable'}{' '}
                <span className="text-success">
                  {' '}
                  {product.qty > 0 ? (
                    <FormattedMessage id="inStock" defaultMessage="Available" />
                  ) : (
                    <FormattedMessage
                      id="outOfStock"
                      defaultMessage="Not available"
                    />
                  )}{' '}
                </span>
              </div>
              <form className="product__options">
                <div className="form-group product__option">
                  <div className="product__actions">
                    <div className={classNames("product__actions-item product__actions-item--addtocart upsell",
                      {
                        "button_disabled": product.qty === 0
                          && backorders == 0
                          && outOfStock == 1
                      })}>
                      {/*{console.log(product, cartToken, customer, selectedData, "__--__--__--__--__--___")}*/}
                      {
                        product && product.type === 'configurable' ? (

                          <Link href={url.product(product)}>
                            <button
                              type="button"
                              className={classNames(
                                'btn btn-primary product-card__addtocart hide-for-tablet',
                              )}
                            >
                              <FormattedMessage
                                id="something"
                                defaultMessage="Replace"
                              />
                            </button>
                          </Link>
                        ) : (
                          <AsyncAction
                            action={() =>
                              cartAddItem(
                                product,
                                [],
                                1,
                                cartToken,
                                customer,
                                selectedData,
                                null,
                                'homePage',
                              )
                            }
                            render={({ run, loading }) => (
                              <button
                                type="button"
                                onClick={(e) => {
                                  run()
                                  e.preventDefault()
                                  getUpCrosselProd(product.product_id, 'crossel')
                                  setPopupName('crossel')
                                  // setPopup(true)
                                }}
                                className={classNames(
                                  'btn btn-orange rounded-pills',
                                  {
                                    'btn-loading': loading,
                                  },
                                )}
                              >
                                <FormattedMessage
                                  id="something"
                                  defaultMessage="Replace"
                                />
                              </button>
                            )}
                          />
                        )
                      }

                    </div>
                    {/*  here goes to be a no thanks button*/}
                    <div className="no-thanks upsell">
                      <AsyncAction
                        action={() =>
                          cartAddItem(
                            oldProduct,
                            [],
                            1,
                            cartToken,
                            customer,
                            selectedData,
                            null,
                            '',
                          )
                        }
                        render={({ run, loading }) => (
                          <span
                            onClick={(e) => {
                              e.preventDefault()
                              run()
                              setTempData(product)
                              getUpCrosselProd(oldProduct.product_id || oldProduct.product.id, 'crossel')
                              setPopupName('crossel')
                              // setPopup(false)
                            }}
                          >
                            <FormattedMessage
                              id="noThanks"
                              defaultMessage="No, Thanks"
                            />
                          </span>
                        )}
                      />

                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )
      }

    </div>
  )
}


const mapStateToProps = state => ({
  selectedData: state.locale.code,
  cartToken: state.cartToken,
  customer: state.customer,
})

const mapDispatchToProps = {
  setPopupName,
  cartAddItem,
  setPopup,
  setUpCrossProd,
  setTempData,
}

export default connect(mapStateToProps, mapDispatchToProps)(UpSellCard)

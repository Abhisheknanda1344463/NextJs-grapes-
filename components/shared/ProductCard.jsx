// react
import React, {useState, useEffect} from 'react'
//timezone
import moment from 'moment'
// third-party
import classNames from 'classnames'
import Link from 'next/link'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import {setPopup, setPopupName, setUpCrossProd, setTempData} from '../../store/general'
import {wishlistRemoveItem} from '../../store/wishlist'
// application
import Currency from './Currency'
import AsyncAction from './AsyncAction'
import Image from 'components/hoc/Image'
import {CheckToastSvg, FailSvg, Wishlist16Svg} from '../../svg'
import {url} from '../../services/utils'
import {cartAddItem} from '../../store/cart'
import {apiImageUrl, megaUrl} from '../../helper'
import defoult from '../../images/defoultpic.png'
import {compareAddItem} from '../../store/compare'
import {quickviewOpen} from '../../store/quickview'
import {wishlistAddItem} from '../../store/wishlist'
import {useRouter} from 'next/router'
import shopApi from '../../api/shop'


function ProductCard(props) {
  const {
    customer,
    product,
    layout,
    cartAddItem,
    wishlistAddItem,
    setPopup,
    setPopupName,
    setUpCrossProd,
    setTempData,
    wishlist,
    wishlistRemoveItem,
  } = props
  const [dimension, setDimension] = useState(1200)
  const router = useRouter()
  useEffect(() => {
    function handleResize() {
      setDimension(window.innerWidth)
    }


    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  const getUpCrosselProd = (prodID, type) => {
    switch (type) {
      case 'upsel':
        fetch(`${megaUrl}/db/up-sell-products?limit=8&product_id=${prodID}&locale=en&currency=USD`)
          .then(res => res.json())
          .then(data => {
            if (data.length === 0) {
              setPopup(false)
              fetch(`${megaUrl}/db/cross-sell-products?limit=8&product_id=${prodID}&locale=en&currency=USD`)
                .then(res2 => res2.json())
                .then(data2 => {

                  if (data2.length === 0) {
                    setPopup(false)
                    setPopupName("")
                  }
                  setPopup(true)
                  setUpCrossProd(data2)
                })
            }
            setPopup(true)
            // setUpCrossProd({upsell: data})
            setUpCrossProd(data)
          })
        break
      case 'crossel':
        // shopApi.getCrossSellProducts(prodID)
        //   .then(res => {
        //   if(res.length === 0) {
        //     alert(res.length)
        //     setPopup(false);
        //     setPopupName("")
        //   }
        //   setUpCrossProd(res)
        // })
        fetch(`${megaUrl}/db/cross-sell-products?limit=8&product_id=${prodID}&locale=en&currency=USD`)
          .then(res => res.json())
          .then(data => setUpCrossProd(data)
          )
        break
      default:
        setPopup(false)
        break;
    }


  }

  const productLink = ''

  const isTablet = () => {
    if (dimension >= 1024) {
      return false
    } else {
      return true
    }
  }

  const al = (e) => {
    alert(e)
  }

  const selectedData = useSelector((state) => state.locale.code)
  const cartToken = useSelector((state) => state.cartToken)
  const signed = useSelector((state) => state.customer.authenticated)
  const backorders = useSelector(state => state.general.coreConfigs.catalog_inventory_stock_options_backorders)
  const outOfStock = useSelector(state => state.general.coreConfigs.catalog_products_homepage_out_of_stock_items)
  const CONFIG = 'simple'
  const containerClasses = classNames('product-card', {
    'product-card--layout--grid product-card--size--sm': layout === 'grid-sm',
    'product-card--layout--grid product-card--size--nl': layout === 'grid-nl',
    'product-card--layout--grid product-card--size--lg': layout === 'grid-lg',
    'product-card--layout--list': layout === 'list',
    'product-card--layout--horizontal': layout === 'horizontal',
  })

  let badges = []
  let image
  let price
  let features
  // console.log(product, ': product in product card')
  if (product) {
    if (product.images && product.images.length > 0) {
      image = (
        <div className="product-card__image product-image">
          {!isTablet() ? (
            <Link href={url.product(product)}>
              <div className="product-image__body product-image__body-fms">
                <div className="item_overlay hide-for-tablet"></div>
                <div className="img_btn_wrapper">

                  {product && product?.type === 'configurable' ? (

                    <Link href={url.product(product)}>
                      <button
                        type="button"
                        className={classNames(
                          'btn btn-primary product-card__addtocart hide-for-tablet',
                        )}
                      >
                        <FormattedMessage
                          id="add.tocart"
                          defaultMessage="Add to cart"
                        />
                      </button>
                    </Link>
                  ) : (
                    <AsyncAction
                      // action={() =>
                      //   cartAddItem(
                      //     product,
                      //     [],
                      //     1,
                      //     cartToken,
                      //     customer,
                      //     selectedData,
                      //     null,
                      //     'homePage',
                      //   )
                      // }
                      render={({run, loading}) => (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            run()
                            setTempData([product])
                            getUpCrosselProd(product.product_id || product.product.id, 'upsel')
                            setPopupName('upsell')  
                          }}
                          className={classNames(
                            'btn btn-primary product-card__addtocart hide-for-tablet',
                            {
                              'btn-loading': loading,
                            },
                          )}
                        >
                          <FormattedMessage
                            id="add.tocart"
                            defaultMessage="Add to cart"
                          />
                        </button>
                      )}
                    />
                  )}
                </div>
                {product.images[0].path ? (
                  <Image
                    alt=""
                    layout="fill"
                    className="product-image__img"
                    src={`${apiImageUrl}/cache/medium/` + product.images[0].path}
                  />
                ) : (
                  <Image
                    alt=""
                    layout="fill"
                    src={`${apiImageUrl}/cache/medium/${product.images[0]}`}
                    className="product-image__img"
                  />
                )}
              </div>
            </Link>
          ) : (
            <Link
              href={isTablet() ? url.product(product) : ''}
              className="product-image__body"
            >
              <div className="product-image__body">
                <div className="item_overlay hide-for-tablet"></div>
                <div className="img_btn_wrapper">
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
                    render={({run, loading}) => (
                      <button
                        type="button"
                        onClick={() => {
                          // e.preventDefault()
                          run()
                          getUpCrosselProd(product.product_id || product.product.id, 'upsel')
                          setPopupName('upsell')
                          setPopup(true)
                        }}
                        className={classNames(
                          'btn btn-primary product-card__addtocart hide-for-tablet',
                          {
                            'btn-loading': loading,
                          },
                        )}
                      >
                        <FormattedMessage
                          id="add.tocart"
                          defaultMessage="Add to cart"
                        />
                      </button>
                    )}
                  />
                </div>
                <Image
                  alt=""
                  layout="fill"
                  className="product-image__img"
                  src={`${apiImageUrl}/cache/medium/${product.images[0].path}`}
                />
              </div>
            </Link>
          )}
        </div>
      )
    } else {
      image = (
        <div className="product-card__image product-image">
          <div className="product-image__body product-image__defoult-fms">
            {/* <div className="item_overlay hide-for-tablet"></div>
          <div className="img_btn_wrapper"></div> */}
            <Image
              className="product-image__img "
              src={defoult}
              alt="Picture is missing"
              layout="fill"
            />
          </div>
        </div>
      )
    }
  } else {
    return null
  }

  let addAndRemoveWishList = () => {
    let wishlistChekArray = wishlist.find((x) => {
      return x.id == product.id
    })

    if (wishlistChekArray == undefined) {
      toast.success(
        <span className="d-flex chek-fms">
          <CheckToastSvg/>
          <FormattedMessage
            id="add-wish-list"
            defaultMessage={`Product "${product.name}" added to wish list`}
          />
        </span>,
        {
          hideProgressBar: true,
        },
      )
    } else {
      <AsyncAction action={wishlistRemoveItem(product.id)}/>
      toast.success(
        <span className="d-flex chek-fms">
          <CheckToastSvg/>
          <FormattedMessage
            id="producthasalreadyinwishlist"
            defaultMessage={`The product "${product.name}" has already been added to the whishlist`}
          />
        </span>,
        {
          hideProgressBar: true,
        },
      )
    }
  }

  let newDate = new Date()
  const date_from = moment
    .unix(product.special_price_from)
    .format('YYYY-MM-DD')
  const date_now = moment(newDate).format('YYYY-MM-DD')
  const date_to = moment.unix(product.special_price_to).format('YYYY-MM-DD')

  if (!product?.special_price && CONFIG === 'configurable') {
    price = (
      <div className="product-card__prices">
        <Currency value={product.formatted_price}/>
      </div>
    )
  } else if (
    product?.special_price &&
    date_now >= date_from &&
    date_now <= date_to
  ) {
    price = (
      <div className="product-card__prices">
        <span className="product-card__new-price">
          <span className="product-card__symbol">֏</span>
          <Currency value={Number(product.special_price).toFixed(0)}/>
        </span>
        {
          <span className="product-card__old-price">
            <span className="product-card__symbol">֏</span>
            <Currency value={Number(product.price).toFixed(0)}/>
          </span>
        }
      </div>
    )
  } else if (product?.special_price) {
    price = (
      <div className="product-card__prices">
        <span className="product-card__new-price">
          <span className="product-card__symbol">֏</span>
          <Currency value={Number(product.special_price).toFixed(0)}/>
        </span>
        {
          <span className="product-card__old-price">
            <span className="product-card__symbol">֏</span>
            <Currency value={Number(product.price).toFixed(0)}/>
          </span>
        }
      </div>
    )
  } else if (product?.type === 'configurable') {
    price = (
      <div className="product-card__prices">
        <span className="product-card__symbol">֏</span>
        <Currency value={Number(product.min_price).toFixed(0)}/>
      </div>
    )
  } else {

    price = (
      <div className="product-card__prices">
        <span className="product-card__symbol">֏</span>
        <Currency value={Number(product.min_price).toFixed(0)}/>
      </div>
    )
  }
  const onClickChange = () => {
    router.replace('/products', `/products/${product.url_key}`)
  }
  return (
    <>
      {
        <div className={containerClasses}>
          {badges}
          {image}
          <div className="d-flex product-card__info">
            <div className="product-card__name">
              <Link href={url.product(product)}>{product.name || ''}</Link>
            </div>
            <div className="product-card-description">
              {product.short_description ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: product.short_description.replace(/<\/?[^>]+>/gi, ''),
                  }}
                />
              ) : (
                ''
              )}{' '}
            </div>
          </div>
          <div className="product-card__actions">
            <div className="product-card__availability-mobile">
              <div className="product-card__availability">
                <FormattedMessage
                  id="availability"
                  defaultMessage="Availabiluty"
                />{' '}
                :
                <span className="text-success">
                <FormattedMessage id="instock" defaultMessage="In stock"/>
              </span>
              </div>
              {price}

              <div className="product-card__buttons">
                {signed ? (
                  <span onClick={addAndRemoveWishList}>
                  <AsyncAction
                    action={() => wishlistAddItem(product, selectedData)}
                    render={({run, loading}) => (
                      <div
                        type="button"
                        onClick={run}
                        className={classNames(
                          'btn btn-light btn-svg-icon btn-svg-icon--fake-svg product-card__wishlist',
                          {
                            'btn-loading': loading,
                          },
                        )}
                      >
                        {' '}
                        <Wishlist16Svg/>{' '}
                      </div>
                    )}
                  />
                </span>
                ) : (
                  <div
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      toast(
                        <span className="d-flex faild-toast-fms">
                        <FailSvg/>
                        <FormattedMessage
                          id="sign-or-register"
                          defaultMessage="Please sign in or register"
                        />
                      </span>,
                        {
                          hideProgressBar: true,
                          className: 'wishlist-toast',
                        },
                      )
                    }}
                    className="btn btn-light btn-svg-icon btn-svg-icon--fake-svg product-card__wishlist"
                  >
                    <Wishlist16Svg/>
                  </div>
                )}
              </div>
            </div>

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
              render={({run, loading}) => (
                <button
                  type="button"
                  onClick={() => {
                    run()
                    getUpCrosselProd(product.product_id || product.product.id, 'upsel')
                    setPopupName('upsell')
                    setPopup(true)
                  }}
                  className={classNames(
                    'btn btn-primary product-card__addtocart-tablet show-for-tablet btn-primary-fms ',
                    {
                      'btn-loading': loading,
                    },
                  )}
                >
                  <FormattedMessage
                    id="add.tocart"
                    defaultMessage="Add to cart"
                  />
                </button>
              )}
            />
          </div>
        </div>
      }

    </>
  )
}


ProductCard.propTypes = {
  /**
   * product object
   */
  product: PropTypes.object.isRequired,
  /**
   * product card layout
   * one of ['grid-sm', 'grid-nl', 'grid-lg', 'list', 'horizontal']
   */
  layout: PropTypes.oneOf([
    'grid-sm',
    'grid-nl',
    'grid-lg',
    'list',
    'horizontal',
  ]),
}

const mapStateToProps = (state) => ({
  wishlist: state.wishlist,
})

const mapDispatchToProps = {
  setPopupName,
  cartAddItem,
  wishlistAddItem,
  compareAddItem,
  quickviewOpen,
  setPopup,
  wishlistRemoveItem,
  setUpCrossProd,
  setTempData,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard)

// react
import React, {PureComponent, useState, useEffect} from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {connect, useSelector, useDispatch} from 'react-redux'
import {toast} from 'react-toastify'
import {FormattedMessage} from 'react-intl'
import {Helmet} from 'react-helmet-async'
import {wishlistRemoveItem} from '../../store/wishlist'
import {url, apiImageUrl, megaUrl} from '../../helper'
import Currency from './Currency'
import AsyncAction from './AsyncAction'
import InputNumber from './InputNumber'
import {AddImages} from '../../store/image'
import ProductGallery from './ProductGallery'
import {cartAddItem} from '../../store/cart'
import {AddCartToken} from '../../store/token'
import {compareAddItem} from '../../store/compare'
import {wishlistAddItem} from '../../store/wishlist'
import {removeCurrencyTemp} from '../../services/utils'
import {setPopup, setPopupName, setUpCrossProd, setTempData, setCrossValid} from '../../store/general'
import {
  CheckToastSvg,
  FailSvg,
  InnerWishlist,
  Wishlist16Svg,
} from '../../svg'
import moment from 'moment'
import ConfigurableFilters from '../configurableFilters'
import BundleProducts from 'components/shop/productBundleFikter/BundleProducts'
import {useRouter} from 'next/router'


class Product extends PureComponent {
  checkAddProd = false
  cartProduct = null

  constructor(props) {
    super(props)
    this.state = {
      // popUpName: "",
      quantity: 1,
      // configurImage: null,
      bundleProducts: {},
      selectedConfigs: {
        RAM: null,
        Memory: null,
        color: null,
      },
      locale: this.props.locale,
      size: null,
      imagesData: null,
      simpleProduct: null,
      configurablesData: null,
      colorCheck: false,
      token: this.props.token,
      locale: this.props.locale,
      product: this.props.product,
      customer: this.props.customer,
      wishlist: this.props.wishlist,
      IsOpen: 'product-inner-long-description-click',
      desc: "description"
    }
    this.descriptionRef = React.createRef(null);
    this.detailsRef = React.createRef(null);
  }

  renderProduct = () => {
    if (this.props.product.data.type === 'configurable') {
      this.setInitialAndUpdatedData(this.props.configurableVariantes.data)
    }

    if (this.props.cartToken.cartToken === '') {
      this.props.AddCartToken(this.props.apiToken)
    }

    if (this.props.product.data.type !== 'configurable') {
      this.checkAddProd = true
      this.setState({
        product: this.props.product,
        simpleProduct: this.props.product.data,
        imagesData: this.props.product.data.images,
        configurablesData: null,
      })
      this.props.AddImages(this.props.product.data.images)
    }

    if (this.props.cartToken.cartToken === '') {
      // fetch(apiImageUrl("/api/checkout/cart/token"))
      //   .then((responce) => responce.json())
      //   .then((res) => {
      //     if (res.api_token) {
      //       this.props.AddCartToken(res.api_token);
      //     }
      //   })
      //   .catch((err) => console.error(err));
    }
  }

  componentDidMount() {
    // hereeeeeeeeeeeeeeeeeeee
    // here need variants in this reference "this.props.product.data.variants"
    this.renderProduct()
  }

  componentDidUpdate(prProps, prState) {
    if (
      prProps.productSlug !== this.props.productSlug ||
      prProps.locale !== this.props.product.data.locale
    ) {
      this.renderProduct()
    }
  }


  getUpCrosselProd = (prodID, type) => {
    switch (type) {
      case 'upsel':
        fetch(`${megaUrl}/db/up-sell-products?limit=8&product_id=${prodID}&locale=${this.state.locale}&currency=USD`)
          .then(res => res.json())
          .then(data => {
            this.props.setPopup(true)
            this.props.setUpCrossProd(data)
          })
        break
      case 'crossel':
        fetch(`${megaUrl}/db/cross-sell-products?limit=8&product_id=${prodID}&locale=${this.state.locale}&currency=USD`)
          .then(res => res.json())
          .then(data => {
            this.props.setPopup(true)
            this.props.setUpCrossProd(data)
          })
        break
    }
  }


  addcart = () => {
    if (this.props.product.data.has_up_sell == 0 && this.props.product.data.has_cross_sell == 0) {
      return true
    }
    return false
  }

  createMarkup(item) {
    return {__html: item}
  }

  handleChangeQuantity = (quantity) => {
    this.setState({quantity})
  }

  setInitialAndUpdatedData(data) {
    // this.props.configurableVariantes.data
    if (this.props.product.data.type === 'configurable') {
      if (data && Object.keys(data.index).length > 0) {
        const {index, attributes} = data
        let collectionDefaultValues = {}
        const [productId, defaultAttributesData] = Object.entries(index)[0]
        const oldVariants = JSON.parse(
          JSON.stringify(this.props.product.data.variants),
        )
        const product = {
          data: {
            ...this.props.product.data.variants.find((product) => {
              return product.product_id == productId
            }),
            variants: oldVariants,
          },
        }
        this.setState({
          product: product,
        })
        for (let attrId in defaultAttributesData) {
          const {options: defaultOptions, code} = attributes.find(
            (attr) => attr.id == attrId,
          )
          const defaultOption = defaultOptions.find((option) => {
            return option.id == defaultAttributesData[attrId]
          })
          collectionDefaultValues[code] = {...defaultOption, code: code}
        }
        this.setState({
          configurablesData: data,
          selectedConfigs: {...collectionDefaultValues},
        })
      }
    }
  }

  handleTakeProd = (elem, type) => {
    console.log(elem, "elem in handleTakeProd")
    if (type === 'radio' || type === 'select') {
      this.setState({
        ...this.state,
        bundleProducts: {
          ...this.state.bundleProducts,
          [type]: [{...elem, quantity: 1}],
        },
      })
      console.log("iffffffffffffffffffffffffffffffffffff")
    } else {
      this.setState({
        ...this.state,
        bundleProducts: {
          ...this.state.bundleProducts,
          [type]: this.state.bundleProducts[type]
            ? [...this.state.bundleProducts[type], {...elem, quantity: 1}]
            : [{...elem, quantity: 1}],
        },
      })
      console.log(this.state.bundleProducts, "bundle product in elseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
      // console.log("elseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    }
    // console.log(this.state.bundleProducts, "bundle product in function handleTakeProd")
  }

  handleChangeConfig = (products, attrId, attrCode, option) => {
    /**
     *  products:   Array,    [ids, ...]
     *  attrId:     Number,   color id
     *  attrCode:   String,   color code
     *  optionId:   Object,   option code
     */

      // changes radiocbutton

    const attrLength = Object.keys(this.state.selectedConfigs).length
    const changedConfig = {
      [attrCode]: {
        ...option,
        code: attrCode,
      },
    }

    if (changedConfig) {
      if (Object.keys(changedConfig) == 'color') {
        this.state.colorCheck = true
      } else {
        this.state.colorCheck = false
      }
    }
    const configsData = {
      ...this.state.selectedConfigs,
    }

    delete configsData[attrCode]

    let productId = null

    for (const option in changedConfig) {
      for (let i = 0; i < changedConfig[option].products.length; i++) {
        let count = 1
        const prodId = changedConfig[option].products[i]

        for (let key in configsData) {
          const {products} = configsData[key]
          if (products.includes(prodId)) {
            count++
          }
        }
        if (count == attrLength) {
          productId = prodId
          break
        }
      }
    }

    const dataProd = this.props.product.data.variants.find((product) => {
      if (productId === null) {
        return true
      }
      return product.product_id == productId
    })

    let product

    if (dataProd === undefined) {
      return true
    } else {
      product = {
        data: {
          ...dataProd,
          variants: JSON.parse(
            JSON.stringify(this.state.product.data.variants),
          ),
        },
      }
    }

    this.setState({
      product,
      selectedConfigs: {...changedConfig, ...configsData},
    })
  }

  //////////////////////////////////////////////

  handleId = (elemId, typeId, PlusOrMinus) => {
    let selectedItem = this.state.bundleProducts[typeId]
    selectedItem = selectedItem.map((e) => {
      if (e.id == elemId) {
        return {
          ...e,
          quantity: PlusOrMinus == 'minus' ? e.quantity - 1 : e.quantity + 1,
        }
      }
      return e
    })

    this.setState({
      ...this.state,
      bundleProducts: {
        ...this.state.bundleProducts,
        [typeId]: selectedItem,
      },
    })

    console.log(this.state.bundleProducts, "bundle product in function handleId")
  }

  openUpCrosProd = (product) => {
    if (product?.data?.has_up_sell == 0) {
      // alert(product?.data?.has_up_sell  + "-up_sell")
      this.getUpCrosselProd(product?.data?.product_id || product.data.product.id, "crossel")
      this.props.setPopupName('crossel')
    } else if (product?.data?.has_cross_sell == 0) {
      // alert(product?.data?.has_cross_sell  + "-has_cross_sell")
      this.props.setPopupName('')
      this.props.setPopup(false)
    } else {
      // alert("product?.data?.has_cross_sell  -has_cross_sell")
      this.getUpCrosselProd(product?.data?.product_id || product.data.product.id, "upsel")
      this.props.setPopupName('upsell')
    }
  }

  changeDetails = () => {
    this.setState({
      ...this.state,
      desc: this.detailsRef.current.id
    })
    console.log(this.detailsRef.current.id)
  }
  changeDescription = () => {
    this.setState({
      ...this.state,
      desc: this.descriptionRef.current.id
    })
    console.log(this.descriptionRef.current.id)
  }

  render() {

    let desc, det;
    if (this.state.desc === "description") {
      desc = true;
      det = false
    } else {
      desc = false;
      det = true
    }


    const {
      signed,
      layout,
      cartAddItem,
      wishlistAddItem,
      wishlist,
      wishlistRemoveItem,
      // setUpCrossProd,
      // AddCartToken,
    } = this.props
    console.log(this.props, "this pros in product")

    const {quantity, product} = this.state
    const maxQty = this.props.bOrder ? 50000 : product.data.qty
    // let Addtocartdisabled = this.props.bOrder ? "" : "disabled";
    let Addtocartdisabled = ''
    let newDate = new Date()
    const date_from = moment
      .unix(product.data.special_price_from)
      .format('YYYY-MM-DD')
    const date_now = moment(newDate).format('YYYY-MM-DD')
    const date_to = moment
      .unix(product.data.special_price_to)
      .format('YYYY-MM-DD')
    // if (product.data.qty) {
    //   Addtocartdisabled = "";
    // }
    let addAndRemoveWishList = () => {
      let wishlistChekArray = wishlist.find((x) => {
        return x.id == product.data.id
      })

      if (wishlistChekArray == undefined) {
        toast.success(
          <span className="d-flex chek-fms">
            <CheckToastSvg/>
            <FormattedMessage
              id="add-wish-list"
              defaultMessage={`Product "${product.data.name}" added to wish list`}
            />
          </span>,
          {
            hideProgressBar: true,
          },
        )
      } else {
        <AsyncAction action={wishlistRemoveItem(product.data.id)}/>
        toast.success(
          <span className="d-flex chek-fms">
            <CheckToastSvg/>
            <FormattedMessage
              id="producthasalreadyinwishlist"
              defaultMessage={`The product "${product.data.name}" has already been added to the whishlist`}
            />
          </span>,
          {
            hideProgressBar: true,
          },
        )
      }
    }
    //commented for testing

    // const descData = (
    //   this.state.desc === "description"
    //     ? (
    //       <div
    //         className='description-size'
    //         dangerouslySetInnerHTML={this.createMarkup(
    //           product.data.description,
    //         )}
    //       />
    //     )
    //     : (
    //       <div style={{display: "grid", gridTemplateColumns: "1fr 3fr"}}>
    //         <div style={{padding: "5px", borderRight: "1px solid #ddd", borderBottom: "1px solid #ddd"}}>Ram</div>
    //         <div style={{padding: "5px", borderBottom: "1px solid #ddd"}}>2GB</div>
    //         <div style={{padding: "5px", borderRight: "1px solid #ddd", borderBottom: "1px solid #ddd"}}>Color</div>
    //         <div style={{padding: "5px", borderBottom: "1px solid #ddd"}}>Green</div>
    //         <div style={{padding: "5px", borderRight: "1px solid #ddd", borderBottom: "1px solid #ddd"}}>Size</div>
    //         <div style={{padding: "5px", borderBottom: "1px solid #ddd"}}>XXL</div>
    //         <div style={{padding: "5px", borderRight: "1px solid #ddd", borderBottom: "1px solid #ddd"}}>WIFI</div>
    //         <div style={{padding: "5px", borderBottom: "1px solid #ddd"}}>Yes</div>
    //         <div style={{padding: "5px", borderRight: "1px solid #ddd", borderBottom: "1px solid #ddd"}}>5G</div>
    //         <div style={{padding: "5px", borderBottom: "1px solid #ddd"}}>Yes</div>
    //         <div style={{padding: "5px", borderRight: "1px solid #ddd", borderBottom: "1px solid #ddd"}}>Power</div>
    //         <div style={{padding: "5px", borderBottom: "1px solid #ddd"}}>3580 mA</div>
    //       </div>
    //     )
    // )

    return (
      <>
        <Helmet>
          <title>{product.data.name}</title>
          <meta
            name="description"
            content={
              product.data.description
                ? product.data.description.replace(/(<([^>]+)>)/gi, '')
                : ''
            }
            data-react-helmet={true}
          />
          <meta
            name="name"
            content={product.data.name ? product.data.name : ''}
            data-react-helmet={true}
          />
          <meta property="og:url" content={product.data.name}/>
          <meta
            property="og:title"
            content={product.data.name}
            data-react-helmet={true}
          />
          <meta
            property="og:image"
            content={product.data.images}
            data-react-helmet={true}
          />
        </Helmet>
        <div className={`product product--layout--${layout}`}>
          <div className="product__content">
            <ProductGallery layout={layout} images={product.data.images} ups={false}/>
            <div className="product__info">
              <div className="product__wishlist-compare">
                <AsyncAction
                  action={() => wishlistAddItem(product, this.state.locale)}
                  render={({run, loading}) => (
                    <button
                      type="button"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Wishlist"
                      onClick={run}
                      className={classNames(
                        'btn btn-sm btn-light btn-svg-icon',
                        {
                          'btn-loading': loading,
                        },
                      )}
                    >
                      <Wishlist16Svg/>
                    </button>
                  )}
                />
              </div>

              <div className="product__rating"></div>
              <p className="f16">{product.data.sku}</p>
              <h1
                className="product__name"
                dangerouslySetInnerHTML={this.createMarkup(product.data.name)}
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
                {product.data.special_price &&
                date_now >= date_from &&
                date_now <= date_to ? (
                  <>
                    <span className="product-card__new-price">
                      {removeCurrencyTemp(product.data.special_price)} {/* temporary version */}
                      {/* <Currency
                        value={Number(product.data.special_price).toFixed(0)}
                      /> */}
                      {/* <span
                        className="product-card__symbol"
                        style={{ marginLeft: '5px' }}
                      >
                        ֏
                      </span> */}
                    </span>

                    <span className="product-card__old-price">
                      {removeCurrencyTemp(product.data.price)} {/* temporary version */}
                      {/* <Currency value={Number(product.data.price).toFixed(0)} /> */}
                      {/* <span
                        className="product-card__symbol"
                        style={{ marginLeft: '5px' }}
                      >
                        ֏
                      </span> */}
                    </span>
                  </>
                ) : product?.data.special_price ? (
                  <>
                    <span className="product-card__new-price">
                      {removeCurrencyTemp(product.data.special_price)} {/* temporary version */}
                      {/* <Currency
                        value={Number(product.data.special_price).toFixed(0)}
                      />
                      <span
                        className="product-card__symbol"
                        style={{ marginLeft: '5px' }}
                      >
                        ֏
                      </span> */}
                    </span>

                    <span className="product-card__old-price">
                      {removeCurrencyTemp(product.data.price)} {/* temporary version */}
                      {/* <Currency value={Number(product.data.price).toFixed(0)} />
                      <span
                        className="product-card__symbol"
                        style={{ marginLeft: '5px' }}
                      >
                        ֏
                      </span> */}
                    </span>
                  </>
                ) : (
                  <span>
                    {product.data.price > 0 ? removeCurrencyTemp(product.data.price) : ""} {/* temporary version */}
                    {/* <span
                      className="product-card__symbol"
                      style={{ marginLeft: '5px' }}
                    >
                      ֏
                    </span> */}
                    {/* <Currency
                      value={
                        product.data.price > 0
                          ? Number(product.data.price).toFixed(0)
                          : ''
                      }
                    /> */}
                  </span>
                )}
              </div>
              <div>
                {product.data.price_html
                  ? product.data.price_html.map((e, i) => (
                    <span key={i} className="product_price_html">
                      {e}
                    </span>
                  ))
                  : ''}
              </div>
              <div>
                <div className="product-inner-description-title">
                  <FormattedMessage
                    id="short.description"
                    defaultMessage="Short Description"
                  />
                </div>
                <div
                  className="f16 short-description"
                  dangerouslySetInnerHTML={this.createMarkup(
                    product.data.short_description,
                  )}
                />
              </div>
              {this.state?.configurablesData?.attributes && (
                <ConfigurableFilters
                  locale={this.state.locale}
                  colorCheck={this.state.colorCheck}
                  state={this.state}
                  handleChangeConfig={this.handleChangeConfig}
                  configurablesData={this.state.configurablesData}
                  superCheck={null}
                />
              )}
              {console.log(this.props.product.data, "bundle in product.js!!!!!")}
              {product.data.type == 'bundle' ? (
                <BundleProducts
                  handleId={this.handleId}
                  quantity={this.state.quantity}
                  handleTakeProd={this.handleTakeProd}
                  options={this.props.bundle.bundle_options}
                  // options={product.data?.bundle_options}
                  handleChangeQuantity={this.handleChangeQuantity}
                  selectedBundleProducts={this.state.bundleProducts}
                />
              ) : (
                ''
              )}
              <ul className="product__meta">
                <li className="product__meta-availability">
                  <span
                    className={
                      product.data.qty > 0
                      || product.data.qty === 0
                      && this.props.backorders == 1
                        ? `text-success`
                        : product.data.qty === 0
                        && this.props.backorders == 0
                          ? `text-danger`
                          : `text-danger`
                    }
                    style={{fontSize: '18px'}}
                  >
                    {product.data.qty > 0 ? (
                        <FormattedMessage
                          id="instock"
                          defaultMessage="In stock"
                        />
                      ) :
                      product.data.qty === 0
                      && this.props.backorders == 1
                      && this.props.outOfStock == 0 ||
                      product.data.qty === 0
                      && this.props.backorders == 1
                      && this.props.outOfStock == 1 ? (
                        <FormattedMessage
                          id="instock"
                          defaultMessage="In stock"
                        />
                      ) : product.data.qty === 0
                      && this.props.backorders == 0
                      && this.props.outOfStock == 1 ? (
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
                {product.data.qty > 0 ? 'Availability' : 'Unavailable'}{' '}
                <span className="text-success">
                  {' '}
                  {product.data.qty > 0 ? (
                    <FormattedMessage id="inStock" defaultMessage="Available"/>
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
                    <div className="product__actions-item product-inner-quantity">
                      <InputNumber
                        id="product-quantity"
                        aria-label="Quantity"
                        className="product__quantity"
                        size="lg"
                        min={1}
                        max={maxQty}
                        value={quantity}
                        onChange={this.handleChangeQuantity}
                        disabled={Addtocartdisabled}
                      />
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", margin: "auto"}}>
                      <div className={classNames("product__actions-item product__actions-item--addtocart",
                        {
                          "button_disabled": product.data.qty === 0
                            && this.props.backorders == 0
                            && this.props.outOfStock == 1
                        })}>
                        {
                          this.addcart()
                            ? (
                              <AsyncAction
                                action={() =>
                                  cartAddItem(
                                    product.data,
                                    [],
                                    quantity,
                                    this.state.token,
                                    this.state.customer,
                                    this.state.locale,
                                    product?.data?.type == 'bundle'
                                      ? {
                                        bundle_options: product.data.bundle_options,
                                        selectedOptions: this.state.bundleProducts,
                                      }
                                      : null,
                                  )
                                }
                                render={({run, loading}) => (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // alert("this.addcart()")
                                      // alert(quantity)
                                      this.props.setCrossValid(false)
                                      run()
                                    }}
                                    disabled={Addtocartdisabled}
                                    className={classNames(
                                      'btn btn-orange inner-addtocart rounded-pills btn-lg',
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
                                )
                                }
                              />
                            )
                            : product?.data?.has_up_sell == 0 && product?.data?.has_cross_sell == 1
                              ?
                              (
                                <AsyncAction
                                  action={() =>
                                    cartAddItem(
                                      product.data,
                                      [],
                                      quantity,
                                      this.state.token,
                                      this.state.customer,
                                      this.state.locale,
                                      product?.data?.type == 'bundle'
                                        ? {
                                          bundle_options: product.data.bundle_options,
                                          selectedOptions: this.state.bundleProducts,
                                        }
                                        : null,
                                    )
                                  }
                                  render={({run, loading}) => (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        // alert("this.props?.upSell?.length === 0 && this.props?.crossSell?.length > 0")
                                        run()
                                        this.props.setTempData([product.data])
                                        this.props.setPopup(true);
                                        this.props.setCrossValid(true)
                                        this.openUpCrosProd(product)
                                      }}
                                      disabled={Addtocartdisabled}
                                      className={classNames(
                                        'btn btn-orange inner-addtocart rounded-pills btn-lg',
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
                              )
                              :
                              (
                                <AsyncAction
                                  render={({run, loading}) => (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        run()
                                        // alert("else")
                                        // this.props?.has_up_sell != 0
                                        this.props.setTempData([product.data])
                                        this.props.setPopup(true)
                                        this.props.setCrossValid(false)

                                        this.openUpCrosProd(product)


                                      }}
                                      disabled={Addtocartdisabled}
                                      className={classNames(
                                        'btn btn-orange inner-addtocart rounded-pills btn-lg',
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
                              )
                        }
                      </div>
                      {signed ? (
                        <div className="product__actions-item product__actions-item--wishlist">
                        <span onClick={addAndRemoveWishList}>
                          <AsyncAction
                            action={() =>
                              wishlistAddItem(product.data, this.state.locale)
                            }
                            render={({run, loading}) => (
                              <button
                                type="button"
                                data-toggle="tooltip"
                                title="Wishlist"
                                onClick={run}
                                className={classNames(
                                  'btn btn-secondary btn-svg-icon ',
                                  {
                                    'btn-loading': loading,
                                  },
                                )}
                              >
                                <InnerWishlist className="inner-wishlist"/>
                              </button>
                            )}
                          />
                        </span>
                        </div>
                      ) : (
                        <button
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
                          <InnerWishlist className="inner-wishlist"/>
                        </button>
                      )}
                    </div>
                    <div className="product__actions-item product__actions-item--compare"></div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="product-inner-long-description">
            <div className="product-inner-description-title">
              <div style={{display: "flex", justifyContent: "center", gap: "50px"}}>
                <span
                  ref={this.descriptionRef}
                  className={classNames("desc-heade-title", {"active-title": desc})}
                  onClick={this.changeDescription}
                  id="description"
                >
                  <FormattedMessage
                    id="description.title"
                    defaultMessage="Description"
                  />
                </span>
                {/*commented for testing*/}
                {/*<span*/}
                {/*  ref={this.detailsRef}*/}
                {/*  className={classNames("desc-heade-title", {"active-title": det})}*/}
                {/*  onClick={this.changeDetails}*/}
                {/*  id="details"*/}
                {/*>*/}
                {/*  <FormattedMessage*/}
                {/*    id="details.title"*/}
                {/*    defaultMessage="Details"*/}
                {/*  />*/}
                {/*</span>*/}

              </div>

            </div>
            <div>
              {/*commented for testing*/}
              {/*{descData}*/}
              <div
                className='description-size'
                dangerouslySetInnerHTML={this.createMarkup(
                  product.data.description,
                )}
              />
            </div>
          </div>
        </div>
      </>
    )
  }
}


Product.propTypes = {
  /** product object */
  product: PropTypes.object.isRequired,
  /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
  layout: PropTypes.oneOf(['standard', 'sidebar', 'columnar', 'quickview']),
}

Product.defaultProps = {
  layout: 'standard',
}

const mapStateToProps = (state) => ({
  backorders: state.general.coreConfigs.catalog_inventory_stock_options_backorders,
  outOfStock: state.general.coreConfigs.catalog_products_homepage_out_of_stock_items,
  locale: state.locale.code,
  cartToken: state.cartToken,
  token: state.cartToken,
  customer: state.customer,
  bOrder: state.general.bOrder,
  apiToken: state.general.apiToken,
  signed: state.customer.authenticated,
  wishlist: state.wishlist,
  oldProduct: state.general.temporaryData[0],
})

const mapDispatchToProps = {
  setPopupName,
  setPopup,
  setUpCrossProd,
  setTempData,
  setCrossValid,
  AddImages,
  AddCartToken,
  cartAddItem,
  wishlistAddItem,
  compareAddItem,
  wishlistRemoveItem,
}

export default connect(mapStateToProps, mapDispatchToProps)(Product)

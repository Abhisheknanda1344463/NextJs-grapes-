// react
import React, { PureComponent, useState, USeEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import { Helmet } from "react-helmet-async";
import { wishlistRemoveItem } from "../../store/wishlist";
import { url, apiImageUrl } from "../../helper";
import Currency from "./Currency";
import AsyncAction from "./AsyncAction";
import InputNumber from "./InputNumber";
import { AddImages } from "../../store/image";
import ProductGallery from "./ProductGallery";
import { cartAddItem } from "../../store/cart";
import { AddCartToken } from "../../store/token";
import { compareAddItem } from "../../store/compare";
import { wishlistAddItem } from "../../store/wishlist";

useRouter;
import {
  CheckToastSvg,
  FailSvg,
  InnerWishlist,
  Wishlist16Svg,
} from "../../svg";
import moment from "moment";
import ConfigurableFilters from "../configurableFilters";
import BundleProducts from "components/shop/productBundleFikter/BundleProducts";
import { useRouter } from "next/router";

class Product extends PureComponent {
  checkAddProd = false;
  cartProduct = null;

  constructor(props) {
    super(props);
    this.state = {
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
      IsOpen: "product-inner-long-description-click",
    };
  }

  renderProduct = () => {
    if (this.props.product.data.type === "configurable") {
      this.setInitialAndUpdatedData(this.props.configurableVariantes.data);
    }

    if (this.props.cartToken.cartToken === "") {
      this.props.AddCartToken(this.props.apiToken);
    }

    if (this.props.product.data.type !== "configurable") {
      this.checkAddProd = true;
      this.setState({
        product: this.props.product,
        simpleProduct: this.props.product.data,
        imagesData: this.props.product.data.images,
        configurablesData: null,
      });
      this.props.AddImages(this.props.product.data.images);
    }

    if (this.props.cartToken.cartToken === "") {
      // fetch(apiImageUrl("/api/checkout/cart/token"))
      //   .then((responce) => responce.json())
      //   .then((res) => {
      //     if (res.api_token) {
      //       this.props.AddCartToken(res.api_token);
      //     }
      //   })
      //   .catch((err) => console.error(err));
    }
  };

  componentDidMount() {
    // hereeeeeeeeeeeeeeeeeeee
    // here need variants in this reference "this.props.product.data.variants"
    this.renderProduct();
  }

  componentDidUpdate(prProps, prState) {
    // console.log(
    //   prProps.locale,
    //   prState.locale,
    //   this.props.locale,
    //   this.state.locale,
    //   "localelocale"
    // );
    if (
      prProps.productSlug !== this.props.productSlug ||
      prProps.locale !== this.props.product.data.locale
    ) {
      this.renderProduct();
    }
  }

  createMarkup(item) {
    return { __html: item };
  }

  handleChangeQuantity = (quantity) => {
    this.setState({ quantity });
  };

  setInitialAndUpdatedData(data) {
    // this.props.configurableVariantes.data
    if (this.props.product.data.type === "configurable") {
      if (data && Object.keys(data.index).length > 0) {
        const { index, attributes } = data;
        let collectionDefaultValues = {};
        const [productId, defaultAttributesData] = Object.entries(index)[0];
        const oldVariants = JSON.parse(
          JSON.stringify(this.props.product.data.variants)
        );
        const product = {
          data: {
            ...this.props.product.data.variants.find((product) => {
              return product.product_id == productId;
            }),
            variants: oldVariants,
          },
        };
        this.setState({
          product: product,
        });
        for (let attrId in defaultAttributesData) {
          const { options: defaultOptions, code } = attributes.find(
            (attr) => attr.id == attrId
          );
          const defaultOption = defaultOptions.find((option) => {
            return option.id == defaultAttributesData[attrId];
          });
          collectionDefaultValues[code] = { ...defaultOption, code: code };
        }
        this.setState({
          configurablesData: data,
          selectedConfigs: { ...collectionDefaultValues },
        });
      }
    }
  }

  handleTakeProd = (elem, type) => {
    if (type === "radio" || type === "select") {
      this.setState({
        ...this.state,
        bundleProducts: {
          ...this.state.bundleProducts,
          [type]: [{ ...elem, quantity: 1 }],
        },
      });
    } else {
      this.setState({
        ...this.state,
        bundleProducts: {
          ...this.state.bundleProducts,
          [type]: this.state.bundleProducts[type]
            ? [...this.state.bundleProducts[type], { ...elem, quantity: 1 }]
            : [{ ...elem, quantity: 1 }],
        },
      });
    }
  };

  handleChangeConfig = (products, attrId, attrCode, option) => {
    /**
     *  products:   Array,    [ids, ...]
     *  attrId:     Number,   color id
     *  attrCode:   String,   color code
     *  optionId:   Object,   option code
     */

    // changes radiocbutton

    const attrLength = Object.keys(this.state.selectedConfigs).length;
    const changedConfig = {
      [attrCode]: {
        ...option,
        code: attrCode,
      },
    };

    if (changedConfig) {
      if (Object.keys(changedConfig) == "color") {
        this.state.colorCheck = true;
      } else {
        this.state.colorCheck = false;
      }
    }
    const configsData = {
      ...this.state.selectedConfigs,
    };

    delete configsData[attrCode];

    let productId = null;

    for (const option in changedConfig) {
      for (let i = 0; i < changedConfig[option].products.length; i++) {
        let count = 1;
        const prodId = changedConfig[option].products[i];

        for (let key in configsData) {
          const { products } = configsData[key];
          if (products.includes(prodId)) {
            count++;
          }
        }
        if (count == attrLength) {
          productId = prodId;
          break;
        }
      }
    }

    const dataProd = this.props.product.data.variants.find((product) => {
      if (productId === null) {
        return true;
      }
      return product.product_id == productId;
    });

    let product;

    if (dataProd === undefined) {
      return true;
    } else {
      product = {
        data: {
          ...dataProd,
          variants: JSON.parse(
            JSON.stringify(this.state.product.data.variants)
          ),
        },
      };
    }

    this.setState({
      product,
      selectedConfigs: { ...changedConfig, ...configsData },
    });
  };

  //////////////////////////////////////////////

  handleId = (elemId, typeId, PlusOrMinus) => {
    let selectedItem = this.state.bundleProducts[typeId];
    selectedItem = selectedItem.map((e) => {
      if (e.id == elemId) {
        return {
          ...e,
          quantity: PlusOrMinus == "minus" ? e.quantity - 1 : e.quantity + 1,
        };
      }
      return e;
    });

    this.setState({
      ...this.state,
      bundleProducts: {
        ...this.state.bundleProducts,
        [typeId]: selectedItem,
      },
    });
  };

  render() {
    const {
      signed,
      layout,
      cartAddItem,
      wishlistAddItem,
      wishlist,
      wishlistRemoveItem,
      // AddCartToken,
    } = this.props;
    const { quantity, product } = this.state;
    const maxQty = this.props.bOrder ? 50000 : product.data.qty;
    // let Addtocartdisabled = this.props.bOrder ? "" : "disabled";
    let Addtocartdisabled = "";
    let newDate = new Date();
    const date_from = moment
      .unix(product.data.special_price_from)
      .format("YYYY-MM-DD");
    const date_now = moment(newDate).format("YYYY-MM-DD");
    const date_to = moment
      .unix(product.data.special_price_to)
      .format("YYYY-MM-DD");
    // if (product.data.qty) {
    //   Addtocartdisabled = "";
    // }
    let addAndRemoveWishList = () => {
      let wishlistChekArray = wishlist.find((x) => {
        return x.id == product.data.id;
      });

      if (wishlistChekArray == undefined) {
        toast.success(
          <span className="d-flex chek-fms">
            <CheckToastSvg />
            <FormattedMessage
              id="add-wish-list"
              defaultMessage={`Product "${product.data.name}" added to wish list`}
            />
          </span>,
          {
            hideProgressBar: true,
          }
        );
      } else {
        <AsyncAction action={wishlistRemoveItem(product.data.id)} />;
        toast.success(
          <span className="d-flex chek-fms">
            <CheckToastSvg />
            <FormattedMessage
              id="producthasalreadyinwishlist"
              defaultMessage={`The product "${product.data.name}" has already been added to the whishlist`}
            />
          </span>,
          {
            hideProgressBar: true,
          }
        );
      }
    };
    return (
      <>
        <Helmet>
          <title>{product.data.name}</title>
          <meta
            name="description"
            content={
              product.data.description
                ? product.data.description.replace(/(<([^>]+)>)/gi, "")
                : ""
            }
            data-react-helmet={true}
          />
          <meta
            name="name"
            content={product.data.name ? product.data.name : ""}
            data-react-helmet={true}
          />
          <meta property="og:url" content={product.data.name} />
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
            <ProductGallery layout={layout} images={product.data.images} />
            <div className="product__info">
              <div className="product__wishlist-compare">
                <AsyncAction
                  action={() => wishlistAddItem(product, this.state.locale)}
                  render={({ run, loading }) => (
                    <button
                      type="button"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Wishlist"
                      onClick={run}
                      className={classNames(
                        "btn btn-sm btn-light btn-svg-icon",
                        {
                          "btn-loading": loading,
                        }
                      )}
                    >
                      <Wishlist16Svg />
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
                      <Currency
                        value={Number(product.data.special_price).toFixed(0)}
                      />
                      <span
                        className="product-card__symbol"
                        style={{ marginLeft: "5px" }}
                      >
                        ֏
                      </span>
                    </span>

                    <span className="product-card__old-price">
                      <Currency value={Number(product.data.price).toFixed(0)} />
                      <span
                        className="product-card__symbol"
                        style={{ marginLeft: "5px" }}
                      >
                        ֏
                      </span>
                    </span>
                  </>
                ) : product?.data.special_price ? (
                  <>
                    <span className="product-card__new-price">
                      <Currency
                        value={Number(product.data.special_price).toFixed(0)}
                      />
                      <span
                        className="product-card__symbol"
                        style={{ marginLeft: "5px" }}
                      >
                        ֏
                      </span>
                    </span>

                    <span className="product-card__old-price">
                      <Currency value={Number(product.data.price).toFixed(0)} />
                      <span
                        className="product-card__symbol"
                        style={{ marginLeft: "5px" }}
                      >
                        ֏
                      </span>
                    </span>
                  </>
                ) : (
                  <span>
                    <span
                      className="product-card__symbol"
                      style={{ marginLeft: "5px" }}
                    >
                      ֏
                    </span>
                    <Currency
                      value={
                        product.data.price > 0
                          ? Number(product.data.price).toFixed(0)
                          : ""
                      }
                    />
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
                  : ""}
              </div>
              <div>
                <div className="product-inner-description-title">
                  <FormattedMessage
                    id="short.description"
                    defaultMessage="Short Description"
                  />
                </div>
                <div
                  className="f16"
                  dangerouslySetInnerHTML={this.createMarkup(
                    product.data.short_description
                  )}
                />
              </div>
              {/*{console.log("this state", this.state)}*/}
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
              {product.data.type == "bundle" ? (
                <BundleProducts
                  handleId={this.handleId}
                  quantity={this.state.quantity}
                  handleTakeProd={this.handleTakeProd}
                  options={product.data.bundle_options.options}
                  handleChangeQuantity={this.handleChangeQuantity}
                  selectedBundleProducts={this.state.bundleProducts}
                />
              ) : (
                ""
              )}
              <ul className="product__meta">
                <li className="product__meta-availability">
                  <span
                    className={
                      product.data.qty > 0 ? `text-success` : `text-danger`
                    }
                    style={{ fontSize: "18px" }}
                  >
                    {product.data.qty > 0 ? (
                      <FormattedMessage
                        id="instock"
                        defaultMessage="In stock"
                      />
                    ) : (
                      <FormattedMessage
                        id="outOfStock"
                        defaultMessage="Not available"
                      />
                    )}{" "}
                  </span>
                </li>
              </ul>
            </div>
            <div className="product__sidebar">
              <div className="product__availability">
                {product.data.qty > 0 ? "Availability" : "Unavailable"}{" "}
                <span className="text-success">
                  {" "}
                  {product.data.qty > 0 ? (
                    <FormattedMessage id="inStock" defaultMessage="Available" />
                  ) : (
                    <FormattedMessage
                      id="outOfStock"
                      defaultMessage="Not available"
                    />
                  )}{" "}
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
                    <div className="product__actions-item product__actions-item--addtocart">
                      <AsyncAction
                        action={() =>
                          cartAddItem(
                            product.data,
                            [],
                            quantity,
                            this.state.token,
                            this.state.customer,
                            this.state.locale,
                            product?.data?.type == "bundle"
                              ? {
                                  options: product.data.bundle_options,
                                  selectedOptions: this.state.bundleProducts,
                                }
                              : null
                          )
                        }
                        render={({ run, loading }) => (
                          <button
                            type="button"
                            onClick={run}
                            disabled={Addtocartdisabled}
                            className={classNames(
                              "btn btn-orange inner-addtocart rounded-pills btn-lg",
                              {
                                "btn-loading": loading,
                              }
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
                    {signed ? (
                      <div className="product__actions-item product__actions-item--wishlist">
                        <span onClick={addAndRemoveWishList}>
                          <AsyncAction
                            action={() =>
                              wishlistAddItem(product.data, this.state.locale)
                            }
                            render={({ run, loading }) => (
                              <button
                                type="button"
                                data-toggle="tooltip"
                                title="Wishlist"
                                onClick={run}
                                className={classNames(
                                  "btn btn-secondary btn-svg-icon ",
                                  {
                                    "btn-loading": loading,
                                  }
                                )}
                              >
                                <InnerWishlist className="inner-wishlist" />
                              </button>
                            )}
                          />
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toast(
                            <span className="d-flex faild-toast-fms">
                              <FailSvg />
                              <FormattedMessage
                                id="sign-or-register"
                                defaultMessage="Please sign in or register"
                              />
                            </span>,
                            {
                              hideProgressBar: true,
                              className: "wishlist-toast",
                            }
                          );
                        }}
                        className="btn btn-light btn-svg-icon btn-svg-icon--fake-svg product-card__wishlist"
                      >
                        <InnerWishlist className="inner-wishlist" />
                      </button>
                    )}

                    <div className="product__actions-item product__actions-item--compare"></div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="product-inner-long-description">
            <div className="product-inner-description-title">
              <FormattedMessage
                id="description.title"
                defaultMessage="Description"
              />
            </div>
            <div>
              <div
                dangerouslySetInnerHTML={this.createMarkup(
                  product.data.description
                )}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

Product.propTypes = {
  /** product object */
  product: PropTypes.object.isRequired,
  /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
  layout: PropTypes.oneOf(["standard", "sidebar", "columnar", "quickview"]),
};

Product.defaultProps = {
  layout: "standard",
};

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
});

const mapDispatchToProps = {
  AddImages,
  AddCartToken,
  cartAddItem,
  wishlistAddItem,
  compareAddItem,
  wishlistRemoveItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);

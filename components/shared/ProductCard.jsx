// react
import React, { useState } from "react";
//timezone
import moment from "moment";
// third-party
import classNames from "classnames";
import Link from "next/link";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { setPopup } from "../../store/general";
import { wishlistRemoveItem } from "../../store/wishlist";
// application
import Currency from "./Currency";
import AsyncAction from "./AsyncAction";
import Image from "components/hoc/Image";
import { CheckToastSvg, FailSvg, Wishlist16Svg } from "../../svg";
import { url } from "../../services/utils";
import { cartAddItem } from "../../store/cart";
import { apiImageUrl } from "../../helper";
import defoult from "../../images/defoultpic.png";
import { compareAddItem } from "../../store/compare";
import { quickviewOpen } from "../../store/quickview";
import { wishlistAddItem } from "../../store/wishlist";
import { useRouter } from "next/router";

function ProductCard(props) {
  const {
    customer,
    product,
    layout,
    cartAddItem,
    wishlistAddItem,
    setPopup,
    wishlist,
    wishlistRemoveItem,
  } = props;
  const [dimension, setDimension] = useState(1200);
  const router = useRouter();
  React.useEffect(() => {
    function handleResize() {
      setDimension(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const productLink = "";

  const isTablet = () => {
    if (dimension >= 1024) {
      return false;
    } else {
      return true;
    }
  };

  const selectedData = useSelector((state) => state.locale.code);
  const cartToken = useSelector((state) => state.cartToken);
  const signed = useSelector((state) => state.customer.authenticated);
  const backorders = useSelector(state => state.general.coreConfigs.catalog_inventory_stock_options_backorders)
  const outOfStock = useSelector(state => state.general.coreConfigs.catalog_products_homepage_out_of_stock_items)
  console.log(backorders, 'backorders in blockProducts')
  console.log(outOfStock, 'outOfStock in blockProducts')
  const CONFIG = "simple";
  const containerClasses = classNames("product-card", {
    "product-card--layout--grid product-card--size--sm": layout === "grid-sm",
    "product-card--layout--grid product-card--size--nl": layout === "grid-nl",
    "product-card--layout--grid product-card--size--lg": layout === "grid-lg",
    "product-card--layout--list": layout === "list",
    "product-card--layout--horizontal": layout === "horizontal",
  });

  const checkBackOrderAndOutOfStock = (product) => {
    if(product.qty === 0) {
      if(backorders && outOfStock || backorders && !outOfStock) {
        return <ProductCard product={product} customer={customer}/>
      }
      if(!backorders && outOfStock) {
        return <ProductCard product={product} customer={customer}/>
      }
      if(!backorders && !outOfStock) {
        return <></>
      }
    }
    return <ProductCard product={product} customer={customer}/>
  }

  let badges = [];
  let image;
  let price;
  let features;

  if (product.images && product.images.length > 0) {
    image = (
      <div className="product-card__image product-image">
        {!isTablet() ? (
          <Link href={url.product(product)}>
            <div className="product-image__body product-image__body-fms">
              <div className="item_overlay hide-for-tablet"></div>
              <div className="img_btn_wrapper">
                {/*{console.log(product?.type, "product type in product card")}*/}

                {product && product?.type === "configurable" ? (

                  <Link href={url.product(product)}>
                    {/*{console.log(url.product(product), "url.product(product)")}*/}
                    <button
                      type="button"
                      className={classNames(
                        "btn btn-primary product-card__addtocart hide-for-tablet"
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
                    action={() =>
                      cartAddItem(
                        product,
                        [],
                        1,
                        cartToken,
                        customer,
                        selectedData,
                        null,
                        "homePage"
                      )
                    }
                    render={({ run, loading }) => (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          run();
                          // setPopup(true);
                        }}
                        className={classNames(
                          "btn btn-primary product-card__addtocart hide-for-tablet",

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
            href={isTablet() ? url.product(product) : ""}
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
                      "homePage"
                    )
                  }
                  render={({ run, loading }) => (
                    <button
                      type="button"
                      onClick={run}
                      className={classNames(
                        "btn btn-primary product-card__addtocart hide-for-tablet",
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
    );
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
    );
  }

  let addAndRemoveWishList = () => {
    let wishlistChekArray = wishlist.find((x) => {
      return x.id == product.id;
    });

    if (wishlistChekArray == undefined) {
      toast.success(
        <span className="d-flex chek-fms">
          <CheckToastSvg />
          <FormattedMessage
            id="add-wish-list"
            defaultMessage={`Product "${product.name}" added to wish list`}
          />
        </span>,
        {
          hideProgressBar: true,
        }
      );
    } else {
      <AsyncAction action={wishlistRemoveItem(product.id)} />;
      toast.success(
        <span className="d-flex chek-fms">
          <CheckToastSvg />
          <FormattedMessage
            id="producthasalreadyinwishlist"
            defaultMessage={`The product "${product.name}" has already been added to the whishlist`}
          />
        </span>,
        {
          hideProgressBar: true,
        }
      );
    }
  };

  let newDate = new Date();
  const date_from = moment
    .unix(product.special_price_from)
    .format("YYYY-MM-DD");
  const date_now = moment(newDate).format("YYYY-MM-DD");
  const date_to = moment.unix(product.special_price_to).format("YYYY-MM-DD");

  // console.log(product,'54554545454')

  if (!product?.special_price && CONFIG === "configurable") {
    price = (
      <div className="product-card__prices">
        <Currency value={product.formatted_price} />
      </div>
    );
  } else if (
    product?.special_price &&
    date_now >= date_from &&
    date_now <= date_to
  ) {
    price = (
      <div className="product-card__prices">
        <span className="product-card__new-price">
          <span className="product-card__symbol">֏</span>
          <Currency value={Number(product.special_price).toFixed(0)} />
        </span>
        {
          <span className="product-card__old-price">
            <span className="product-card__symbol">֏</span>
            <Currency value={Number(product.price).toFixed(0)} />
          </span>
        }
      </div>
    );
    // console.log(product, "productCard")
  } else if (product?.special_price ) {
    price = (
      <div className="product-card__prices">
        <span className="product-card__new-price">
          <span className="product-card__symbol">֏</span>
          <Currency value={Number(product.special_price).toFixed(0)} />
        </span>
        {
          <span className="product-card__old-price">
            <span className="product-card__symbol">֏</span>
            <Currency value={Number(product.price).toFixed(0)} />
          </span>
        }
      </div>
    );
  } else if (product?.type === "configurable") {
    price = (
      <div className="product-card__prices">
        <span className="product-card__symbol">֏</span>
        <Currency value={Number(product.min_price).toFixed(0)} />
      </div>
    );
  } else {
    // console.log("product", product)
    price = (
      <div className="product-card__prices">
        <span className="product-card__symbol">֏</span>
        <Currency value={Number(product.min_price).toFixed(0)} />
      </div>
    );
  }
  const onClickChange = () => {
    router.replace("/products", `/products/${product.url_key}`);
  };
  return (
    <React.Fragment>
      {
        product.qty === 0 && !backorders && !outOfStock
          ? (
            <>poxos</>
            )
          :(
              <div className={containerClasses}>
                {badges}
                {image}
                <div className="d-flex product-card__info">
                  <div className="product-card__name">
                    <Link href={url.product(product)}>{product.name || ""}</Link>
                  </div>
                  <div className="product-card-description">
                    {product.short_description ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: product.short_description.replace(/<\/?[^>]+>/gi, ""),
                        }}
                      />
                    ) : (
                      ""
                    )}{" "}
                  </div>
                </div>
                <div className="product-card__actions">
                  <div className="product-card__availability-mobile">
                    <div className="product-card__availability">
                      <FormattedMessage
                        id="availability"
                        defaultMessage="Availabiluty"
                      />{" "}
                      :
                      <span className="text-success">
                <FormattedMessage id="instock" defaultMessage="In stock" />
              </span>
                    </div>
                    {price}

                    <div className="product-card__buttons">
                      {signed ? (
                        <span onClick={addAndRemoveWishList}>
                  <AsyncAction
                    action={() => wishlistAddItem(product, selectedData)}
                    render={({ run, loading }) => (
                      <div
                        type="button"
                        onClick={run}
                        className={classNames(
                          "btn btn-light btn-svg-icon btn-svg-icon--fake-svg product-card__wishlist",
                          {
                            "btn-loading": loading,
                          }
                        )}
                      >
                        {" "}
                        <Wishlist16Svg />{" "}
                      </div>
                    )}
                  />
                </span>
                      ) : (
                        <div
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
                          <Wishlist16Svg />
                        </div>
                      )}
                    </div>

                    {/*<AsyncAction*/}
                    {/*    action={() => cartAddItem(product,[], 1,cartToken,customer,selectedData)}*/}
                    {/*    render={({ run, loading }) => (*/}
                    {/*        <button*/}
                    {/*            type="button"*/}
                    {/*            onClick={run}*/}
                    {/*            className={classNames('btn btn-light btn-svg-icon product-card-add show-for-tablet', {*/}
                    {/*                'btn-loading': loading,*/}
                    {/*            })}*/}
                    {/*        >*/}
                    {/*                <AddCart className="product-card-add" />*/}
                    {/*        </button>*/}

                    {/*    )}*/}
                    {/*/>*/}
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
                        "homePage"
                      )
                    }
                    render={({ run, loading }) => (
                      <button
                        type="button"
                        onClick={run}
                        className={classNames(
                          "btn btn-primary product-card__addtocart-tablet show-for-tablet btn-primary-fms ",
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
              </div>
            )
      }

    </React.Fragment>
  );
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
    "grid-sm",
    "grid-nl",
    "grid-lg",
    "list",
    "horizontal",
  ]),
};

const mapStateToProps = (state) => ({
  wishlist: state.wishlist,
});

const mapDispatchToProps = {
  cartAddItem,
  wishlistAddItem,
  compareAddItem,
  quickviewOpen,
  setPopup,
  wishlistRemoveItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);

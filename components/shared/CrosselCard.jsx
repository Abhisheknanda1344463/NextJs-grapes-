// react
import React, {useState, useEffect} from "react";

// third-party
import classNames from "classnames";
import Link from "next/link";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";
import {setPopup} from "../../store/general";
// application
import Currency from "./Currency";
import AsyncAction from "./AsyncAction";
import Image from "components/hoc/Image";
import {Wishlist16Svg} from "../../svg";
import {url} from "../../services/utils";
import {cartAddItem} from "../../store/cart";
import {url as anotherUrl} from "../../helper";
import defoult from "../../images/defoultpic.png";
import {compareAddItem} from "../../store/compare";
import {quickviewOpen} from "../../store/quickview";
import {wishlistAddItem} from "../../store/wishlist";
import InputNumber from './InputNumber'

function CrosselCard(props) {
  // console.log(props, "props in crossel card")
  const {customer, product, layout, cartAddItem, wishlistAddItem, setPopup} =
    props;
  const [dimension, setDimension] = useState(1200);
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
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


  const handleChangeQuantity = (quantity) => {
    setQuantity(() => quantity)
  }

  const selectedData = useSelector((state) => state.locale.code);
  const cartToken = useSelector((state) => state.cartToken);
  const signed = useSelector((state) => state.customer.authenticated);

  const containerClasses = classNames("product-card", {
    "product-card--layout--grid product-card--size--sm": layout === "grid-sm",
    "product-card--layout--grid product-card--size--nl": layout === "grid-nl",
    "product-card--layout--grid product-card--size--lg": layout === "grid-lg",
    "product-card--layout--list": layout === "list",
    "product-card--layout--horizontal": layout === "horizontal",
  });

  let badges = [];
  let image;
  let price;
  let features;
  if (product) {
    if (product.images && product.images.length > 0) {
      image = (
        <div className="product-card__image product-image">
          {!isTablet() ? (
            <Link href={url.product(product)}>
              <div className="product-image__body product-image__body-fms">
                <div className="item_overlay hide-for-tablet"></div>
                <div className=""></div>
                {product.images[0].path ? (
                  <Image
                    alt=""
                    layout="fill"
                    className="product-image__img"
                    src={`${anotherUrl}/cache/medium/` + product.images[0].path}
                  />
                ) : (
                  <Image
                    alt=""
                    layout="fill"
                    src={`${anotherUrl}/cache/medium/${product.images[0]}`}
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
                  <div className="product__actions-item product-inner-quantity">
                    <InputNumber
                      id="product-quantity"
                      aria-label="Quantity"
                      className="product__quantity"
                      size="lg"
                      min={1}
                      max={5000}
                      value={quantity}
                      onChange={handleChangeQuantity}
                      // disabled={Addtocartdisabled}
                    />
                  </div>
                  <AsyncAction
                    action={() =>
                      cartAddItem(
                        product,
                        [],
                        1,
                        cartToken,
                        customer,
                        selectedData
                      )
                    }
                    render={({run, loading}) => (
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
                  src={`${anotherUrl}/cache/medium/` + product.images[0]}
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
  } else {
    return null
  }


  if (product?.type === "configurable") {
    price = (
      <div className="product-card__prices">
        <Currency value={Number(product.min_price).toFixed(2)}/>
      </div>
    );
  } else if (product.formatted_special_price) {
    price = (
      <div className="product-card__prices">
        <span className="product-card__new-price">
          <Currency value={product.formatted_special_price}/>
        </span>
        {
          <span className="product-card__old-price">
            <Currency value={product.formatted_price}/>
          </span>
        }
      </div>
    );
  } else {
    price = (
      <div className="product-card__prices">
        <Currency value={product.formatted_price || Number(product.price).toFixed(2)}/>
      </div>
    );
  }

  return (
    <React.Fragment>
      {
        product
          ? <div className={containerClasses}>
            {badges}
            {image}

            <div className="d-flex product-card__info">
              <div className="d-flex">
                <div className="product-card__name ">
                  <Link href={url.product(product)}>{product.name || ""}</Link>
                </div>
                {price}
              </div>
              <div className="product-card-description">
                {product.short_description
                  ? product.short_description.replace(/<\/?[^>]+>/gi, "")
                  : ""}{" "}
              </div>
            </div>
            <div className="crossel-button">
              <div className="product__actions-item product-inner-quantity">
                <InputNumber
                  id="product-quantity"
                  aria-label="Quantity"
                  className="product__quantity"
                  size="lg"
                  min={1}
                  max={5000}
                  value={quantity}
                  onChange={handleChangeQuantity}
                  // disabled={Addtocartdisabled}
                />
              </div>
              <AsyncAction
                action={() =>
                  cartAddItem(product, [], 1, cartToken, customer, selectedData)
                }
                render={({run, loading}) => (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      run();
                      setPopup(true);
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
            </div>
            <div className="product-card__actions">
              <div className="product-card__buttons"></div>
            </div>

            <AsyncAction
              action={() =>
                cartAddItem(product, [], 1, cartToken, customer, selectedData)
              }
              render={({run, loading}) => (
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
                  <FormattedMessage id="add.tocart" defaultMessage="Add to cart"/>
                </button>
              )}
            />
          </div>
          : <></>
      }

    </React.Fragment>
  );
}

CrosselCard.propTypes = {
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

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  cartAddItem,
  wishlistAddItem,
  compareAddItem,
  quickviewOpen,
  setPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(CrosselCard);

// react
import React, {useState, useEffect} from "react";

// third-party
import classNames from "classnames";
import Link from "next/link";
import PropTypes from "prop-types";
import {connect, useSelector} from "react-redux";
import {toast} from "react-toastify";
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
import InputNumber from "./InputNumber";

function CrosselCard(props) {
  const {
    customer,
    product,
    layout,
    cartAddItem,
    wishlistAddItem,
    setPopup,
    only,
  } = props;
  const [dimension, setDimension] = useState(1200);
  const [quantity, setQuantity] = useState(1);

  const backorders = useSelector(
    (state) =>
      state.general.coreConfigs.catalog_inventory_stock_options_backorders
  );
  const outOfStock = useSelector(
    (state) =>
      state.general.coreConfigs.catalog_products_homepage_out_of_stock_items
  );

  // useEffect(() => {
  //   function handleResize() {
  //     setDimension(window.innerWidth);
  //   }
  //
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // });

  const productLink = "";


  const handleChangeQuantity = (quantity) => {
    setQuantity(() => quantity);

  };

  const selectedData = useSelector((state) => state.locale.code);
  const cartToken = useSelector((state) => state.cartToken);
  const signed = useSelector((state) => state.customer.authenticated);

  let badges = [];
  let image;
  let price;
  let features;

  if (product) {
    if (product.images && product.images.length > 0) {
      image = (
        <div className="product-card__image cross__prods product-image">
          <Link href={url.product(product)}>
            <div className="product-image__body cross__prods product-image__body-fms">
              <div className="item_overlay hide-for-tablet cross__prods"></div>
              <div className=""></div>
              {product.images[0].path ? (
                <Image
                  alt=""
                  layout="fill"
                  className="product-image__img cross__prods"
                  src={`${anotherUrl}/cache/medium/` + product.images[0].path}
                />
              ) : (
                <Image
                  alt=""
                  layout="fill"
                  src={`${anotherUrl}/cache/medium/${product.images[0]}`}
                  className="product-image__img cross__prods"
                />
              )}

            </div>
          </Link>
        </div>
      );
    } else {
      image = (
        <div className="product-card__image product-image cross__prods">
          <div className="product-image__body product-image__defoult-fms cross__prods">
            <Image
              className="product-image__img cross__prods"
              src={defoult}
              alt="Picture is missing"
              layout="fill"
            />
          </div>
        </div>
      );
    }
  } else {
    return null;
  }

  if (product?.type === "configurable") {
    price = (
      <div className="product-card__prices">
        <Currency value={Number(product.min_price).toFixed(2)}/> {" ??"}
      </div>
    );
  } else if (product.formatted_special_price) {
    price = (
      <div className="product-card__prices">
        <span className="product-card__new-price">
          <Currency value={product.formatted_special_price}/> {" ??"}
        </span>
        {
          <span className="product-card__old-price">
            <Currency value={product.formatted_price}/> {" ??"}
          </span>
        }
      </div>
    );
  } else {
    price = (
      <div className="product-card__prices">
        <Currency
          value={product.formatted_price || Number(product.price).toFixed(2)}
        />{" "}
        {" ??"}
      </div>
    );
  }

  return (
    <React.Fragment>
      {product ? (
        <div className="product-card">
          <>
            {badges}
            {image}

            <div className="product-card__info cross__prods">
              <div className="product-card__info_sub cross__prods">
                <div className="product-card__name cross__prods">
                  <Link href={url.product(product)}>{product.name || ""}</Link>
                </div>
                {price}
              </div>
              <div className="product-card-description cross__prods">
                {product.short_description
                  ? product.short_description.replace(/<\/?[^>]+>/gi, "")
                  : ""}{" "}
              </div>
            </div>
            <div className="crossel-button cross__prods">
              <div className="product__actions-item product-inner-quantity cross__prods">
                <InputNumber
                  id="product-quantity"
                  aria-label="Quantity"
                  className="product__quantity cross__prods"
                  size="lg"
                  min={1}
                  max={5000}
                  value={quantity}
                  onChange={handleChangeQuantity}
                  // disabled={Addtocartdisabled}
                />
              </div>
              <div
                className={classNames("cross_btn cross__prods", {
                  button_disabled:
                    product.qty === 0 && backorders == 0 && outOfStock == 1,
                })}
              >
                <AsyncAction
                  action={() =>
                    cartAddItem(
                      product,
                      [],
                      quantity,
                      cartToken,
                      customer,
                      selectedData
                    )
                  }
                  render={({run, loading}) => (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        run();
                        // setPopup(true);
                      }}
                      className={classNames(
                        "btn btn-primary product-card__addtocart cross__prods",
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
            <div className="product-card__actions">
              <div className="product-card__buttons"></div>
            </div>
          </>
        </div>
      ) : (
        <></>
      )}
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

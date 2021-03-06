// react
import React, {useState, useEffect} from "react";
import {toast} from "react-toastify";
//moment convertor
import moment from "moment-timezone";
// third-party
import classNames from "classnames";
import {connect} from "react-redux";
import Link from "next/link";
import {FailSvg} from "svg";

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import Indicator from "./Indicator";
import {CartFill, Cross10Svg} from "../../svg";
import {cartRemoveItem} from "../../store/cart";
import {url} from "../../services/utils";
import {apiImageUrl} from "../../helper";
import {useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";
import {removeCurrencyTemp} from '../../services/utils'
import Image from "components/hoc/Image";

function IndicatorCart(props) {
  const cartToken = useSelector((state) => state.cartToken);
  const customer = useSelector((state) => state.customer);
  const cart = useSelector((state) => state.cart);
  const selectedData = useSelector((state) => state.locale.code);
  const coreConfigs = useSelector((state) => state.general.coreConfigs);

  const {cartRemoveItem} = props;
  const [open, setOpen] = useState(false);
  const [isAllow, setIsAllow] = useState(true)
  let dropdown;
  let totals;
  const CONFIG = "simple";
  useEffect(() => {
  }, [selectedData]);

  const isCheckAllow = () => {
    setOpen(!open)
    if (coreConfigs.catalog_products_guest_checkout_allow_guest_checkout == "0" && customer.token === "") {
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
          className: "wishlist-toast product-not-available-fms",
        }
      );
    }
  }

  const calcCartTotal = (total) => {/* retur current total or caclulate current total with shipingRate |calcCartTotal()|*/
    let convertSymbols = total.toString().replace("$", "").replace(",", '')

    let current = convertSymbols.replace(/\s/g, '').slice(0, -3)
    return `${Number(current)} ??`

  }

  const items = cart?.items.map((item, I) => {
    let image;
    // commented by David
    let cartItemId;
    for (var i = 0; i < cart?.cartItems?.length; i++) {
      if (cart.cartItems[i].productID === item.product.product_id) {
        cartItemId = cart.cartItems[i].cartItemId;
        break;
      }
    }

    if (item.product.images && item.product.images.length) {
      image = (
        <div className="product-image dropcart__product-image">
          <Link
            href={url.product(item.product)}
            className="product-image__body"
          >
            <Image
              alt=""
              height={56}
              width={56}
              className="product-image__img product-small-img"
              src={
                item.product.images[0].path
                  ? `${apiImageUrl}/cache/medium/${item.product.images[0].path}`
                  : `${apiImageUrl}/cache/medium/${item.product.images[0]}`
              }
            />
          </Link>
        </div>
      );
    }
    const removeButton = (
      <AsyncAction
        action={() => {
          return cartRemoveItem(cartItemId, item, cartToken, customer); // cartItemId
        }}
        render={({run, loading}) => {
          const classes = classNames(
            "dropcart__product-remove btn-light btn-sm btn-svg-icon",
            {
              "btn-loading": loading,
            }
          );

          return (
            <button type="button" onClick={run} className={classes}>
              <Cross10Svg/>
            </button>
          );
        }}
      />
    );

    const product = cart.items[I].product;
    let price;

    let newDate = new Date();
    let date_from = moment(product.special_price_from * 1000).tz("Asia/Yerevan").format('YYYY-MM-DD')
    let date_to = moment(product.special_price_to * 1000).tz("Asia/Yerevan").format('YYYY-MM-DD')
    const date_now = moment(newDate * 1000).tz("Asia/Yerevan").format("YYYY-MM-DD");

    // let newDate = new Date();
    // const date_from = moment
    //   .unix(product.special_price_from)
    //   .format("YYYY-MM-DD");
    // const date_now = moment(newDate).format("YYYY-MM-DD");
    // const date_to = moment.unix(product.special_price_to).format("YYYY-MM-DD");

    if (!product?.special_price && CONFIG === "configurable") {
      price = (
        <div className="product-card__prices">
          <Currency value={product.formatted_price}/>
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
            <Currency value={Number(product.special_price).toFixed(0)}/>
            <span className="product-card__symbol">??</span>
          </span>
          {
            <span className="product-card__old-price">
              <Currency value={Number(product.price).toFixed(0)}/>
              <span className="product-card__symbol">??</span>
            </span>
          }
        </div>
      );
    } else if (product?.special_price) {
      price = (
        <div className="product-card__prices">
          <span className="product-card__new-price">
            <Currency value={Number(product.special_price).toFixed(0)}/>
            <span className="product-card__symbol">??</span>
          </span>
          {
            <span className="product-card__old-price">
              <Currency value={Number(product.price).toFixed(0)}/>
              <span className="product-card__symbol">??</span>
            </span>
          }
        </div>
      );
    }
      //comented by Manvel in David code tis code actual in this case in my working time
      // else if (
      //   (date_now > date_from &&
      //     date_now < date_to &&
      //     product.special_price < product.price &&
      //     product.special_price) ||
      //   (product.special_price_to == null &&
      //     date_from < date_now &&
      //     product.special_price < product.price &&
      //     product.special_price) ||
      //   (product.special_price_from == null &&
      //     date_to > date_now &&
      //     product.special_price < product.price &&
      //     product.special_price) ||
      //   (product.special_price_to == null &&
      //     product.special_price_from == null &&
      //     product.special_price < product.price &&
      //     product.special_price) ||
      //   (product.special_price &&
      //     product.special_price_to == null &&
      //     product.special_price_from == null)
      // ) {
      //   /*
      //   need to refactor this is temporary version
      //  */
      //   price = (
      //       <div className="product-card__prices">
      //         <span className="product-card__new-price_old_value">
      //          <span className="product-card__symbol">??</span>
      //            <Currency value={Number(product.price).toFixed(0)} />
      //         </span>
      //       </div>
      //   );
    // }
    else if (product?.product?.type === "configurable") {
      price = (
        <div className="product-card__prices">
          <Currency value={Number(product.min_price).toFixed(0)}/>
          <span className="product-card__symbol">??</span> {/* temporary version */}
        </div>
      );
    } else {
      price = (
        <div className="product-card__prices">
          <Currency value={Number(product.price).toFixed(0)}/>
          <span className="product-card__symbol">??</span>{/* temporary version */}
        </div>
      );
    }

    return (
      <div key={item.id} className="dropcart__product">
        {image}
        <div className="dropcart__product-info">
          <div className="dropcart__product-name">
            <Link href={url.product(item.product)}>{item.product.name}</Link>
          </div>
          <div className="dropcart__product-meta">
            <span className="dropcart__product-quantity">{item.quantity}</span>
            {" ?? "}
            <span className="dropcart__product-price">{price}</span>
          </div>
        </div>
        {removeButton}
      </div>
    );
  });

  if (cart.quantity) {
    dropdown = (
      <div className="dropcart">
        <div
          className={`${cart.items.length > 3
            ? "dropcart__products-list_scroll"
            : "dropcart__products-list"
          }`}
        >
          {items}
        </div>

        <div className="dropcart__totals">
          <table>
            <tbody>
            {totals}
            <tr>
              <th>
                <FormattedMessage id="total" defaultMessage="Total"/>{" "}
              </th>
              <td>
                {/*{calcCartTotal(cart.total)} /!* temporary version *!/*/}
                 <Currency value={cart.total} />
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div className="dropcart__buttons">
          <Link className="btn btn-secondary rounded-pill" href="/shop/cart">
            <a>
              <span
                className="btn btn-orange rounded-pills"
                onClick={() => setOpen(!open)}
              >
                <FormattedMessage id="cart" defaultMessage="Cart"/>
              </span>
            </a>
          </Link>
          <Link
            href={coreConfigs.catalog_products_guest_checkout_allow_guest_checkout == "0" && customer.token === "" ? "" : "/shop/checkout"}>
            <a>
              <span
                className="btn btn-orange rounded-pills dropcart__buttons-link"
                onClick={isCheckAllow}
              >
                <FormattedMessage id="checkout" defaultMessage="Checkout"/>
              </span>
            </a>
          </Link>
        </div>
      </div>
    );
  } else {
    dropdown = (
      <div className="dropcart">
        <div className={"dropcart__empty"}>
          <FormattedMessage
            id="cartEmpty"
            defaultMessage="Your cart is empty!"
          />
        </div>
      </div>
    );
  }

  const func = (bool) => {
    setOpen(bool);
  };

  return (
    <Indicator
      className="cart-icon"
      url="/shop/cart"
      func={func}
      openEd={open}
      open={open}
      dropdown={dropdown}
      value={cart.quantity}
      icon={<CartFill/>}
      title={<FormattedMessage id="cart" defaultMessage="Cart"/>}
    />
  );
}

const mapStateToProps = (state) => ({
  // cart: state.cart,
});

const mapDispatchToProps = {
  cartRemoveItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorCart);

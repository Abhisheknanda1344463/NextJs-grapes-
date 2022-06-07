import React, { Component, useState, useEffect } from 'react'

// third-party
import classNames from 'classnames'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { apiUrlWithStore } from '../../helper'
// application
import AsyncAction from '../shared/AsyncAction'
import Currency from '../shared/Currency'
import InputNumber from '../shared/InputNumber'
import PageHeader from '../shared/PageHeader'
import { cartRemoveItem, cartUpdateQuantities } from '../../store/cart'
import { Cross12Svg } from '../../svg'
import { ArrowBackSvg, CartTrash } from '../../svg'
import { BackArrow } from '../../svg'
import { url, removeCurrencyTemp } from '../../services/utils'
import store from '../../store'
//MOMENT
import moment from 'moment-timezone'
// data stubs
import theme from '../../data/theme'
import { urlLink } from '../../helper'
import Image from 'components/hoc/Image'



const ShopPageCart = (props) => {

  const [quantities, setQuantities] = useState([])
  const [newItems, setNewItems] = useState([])

  const cart = useSelector(state => state.cart)
  const customer = useSelector(state => state.customer)
  const cartToken = useSelector(state => state.cartToken)
  const bOrder = useSelector(state => state.general.bOrder)

  const dispatch = useDispatch()

  useEffect(() => {
    const { items } = cart
    const qty = items.map((item) => {
      return {
        cartItem: 1,
        itemId: item.id,
        value: item.quantity,
      }
    })
    setQuantities(() => qty)
  }, [cart])

  const getItemQuantity = (item) => {
    const quantity = quantities.find((x) => x.itemId === item.id)
    return quantity ? quantity.value : item.quantity
  }

  const handleChangeQuantity = (item, quantity, cartItem) => {
    const quant = JSON.parse(JSON.stringify(quantities))
    let found = false
    quant.filter((x) => {
      if (x.itemId === item.id) {
        x.value = quantity
        found = true
      }
      return x
    })

    if (!found) {
      quant.push({
        itemId: item.id,
        value: quantity,
        cartItem: cartItem,
      })
    }
    setQuantities(() => quant)
    return quant
  }

  const cartNeedUpdate = () => {
    return (
      quantities.filter((x) => {
        const item = cart.items.find((item) => item.id === x.itemId)

        return item && item.quantity !== x.value && x.value !== ''
      }).length > 0
    )
  }

  const renderItems = () => {

    return cart.items.map((item, index) => {
      let image
      let options
      let id

      const specialPriceValues = (
        item?.product.special_price &&
          date_now >= date_from &&
          date_now <= date_to
          ? Number(item.product.special_price).toFixed(0) * item.quantity
          : item?.product?.special_price
            ? Number(item.product.special_price).toFixed(0) * item.quantity
            : Number(item.product.price).toFixed(0) * item.quantity
      )

      const maxQty = bOrder ? 50000 : item.product.qty
      if (item.product.images && item.product.images.length > 0) {
        id = cart.items[index].cartItemId

        image = (
          <div className="product-image">
            <Link
              href={url.product(item.product)}
              className="product-image__body "
            >
              <a>
                <Image
                  className="product-image__img product-small-img"
                  // src={item.product.images[0].small_image_url}
                  // src={urlLink + '/cache/medium/' + item.product.images[0] || urlLink + '/cache/medium/' + item.product.images[0].path}    urlLink + "/cache/medium/" + item.product.images[0]
                  src={
                    item.product.images[0].medium_image_url ||
                    urlLink + '/cache/medium/' + item.product.images[0] ||
                    'david'
                  }
                  alt=""
                  layout="fill"
                />
              </a>
            </Link>
          </div>
        )
      }
      if (item.options.length > 0) {
        options = (
          <ul className="cart-table__options">
            {item.options.map((option, index) => (
              <li
                key={index}
              >{`${option.optionTitle}: ${option.valueTitle}`}</li>
            ))}
          </ul>
        )
      }
      let cartItemId
      for (var i = 0; i < cart.cartItems.length; i++) {
        if (cart.cartItems[i].productID === item.product.product_id) {
          cartItemId = cart.cartItems[i].cartItemId
          break
        }
      }

      const removeButton = (
        <AsyncAction
          action={() =>
            dispatch(cartRemoveItem(
              cartItemId,
              item,
              cartToken,
              customer,
            ))
          }
          render={({ run, loading }) => {
            const classes = classNames(
              'btn text-light btn-orange btn-block  btn-sm cart__checkout-button f16',
              {
                'btn-loading': loading,
              },
            )

            return (
              <div onClick={run}>
                <a className={classes} style={{ marginRight: "40px", minWidth: "100px" }}>
                  <FormattedMessage id="delete" defaultMessage="Delete" />
                </a>
              </div>
              // <button type="button" onClick={run} className={classes}>
              //   <CartTrash />
              // </button>
            )
          }}
        />
      )

      const alternativelyRemoveButton = (
        <AsyncAction
          action={() =>
            dispatch(cartRemoveItem(
              cartItemId,
              item,
              cartToken,
              customer,
            ))
          }
          render={({ run, loading }) => {
            const classes = classNames(
              'btn btn-light btn-sm btn-svg-icon del-icon-fms delete-btn-position',
              {
                'btn-loading': loading,
              },
            )

            return (
              <button type="button" onClick={run} className={classes}>
                <CartTrash />
              </button>
            )
          }}
        />
      )

      const product = cart.items[index].product
      const CONFIG = 'simple'
      let price
      let newDate = new Date();
      let date_from = moment(product.special_price_from * 1000).tz("Asia/Yerevan").format('YYYY-MM-DD')
      let date_to = moment(product.special_price_to * 1000).tz("Asia/Yerevan").format('YYYY-MM-DD')
      const date_now = moment(newDate * 1000).tz("Asia/Yerevan").format("YYYY-MM-DD");
      if (!product?.special_price && CONFIG === 'configurable') {
        price = (
          <div className="product-card__prices">
            <Currency value={product.formatted_price} />
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
              <Currency value={Number(product.special_price).toFixed(0)} />
              <span className="product-card__symbol">֏</span>
            </span>
            {
              <span className="product-card__old-price">
                <Currency value={Number(product.price).toFixed(0)} />
                <span className="product-card__symbol">֏</span>
              </span>
            }
          </div>
        )
      } else if (product?.special_price) {
        price = (
          <div className="product-card__prices">
            <span className="product-card__new-price">
              <Currency value={Number(product.special_price).toFixed(0)} />
              <span className="product-card__symbol">֏</span>
            </span>
            {
              <span className="product-card__old-price">
                <Currency value={Number(product.price).toFixed(0)} />
                <span className="product-card__symbol">֏</span>
              </span>
            }
          </div>
        )
      } else if (product?.product?.type === 'configurable') {
        price = (
          <div className="product-card__prices">
            <Currency value={Number(product.min_price).toFixed(0)} />
            <span className="product-card__symbol">֏</span>
          </div>
        )
      } else {
        price = (
          <div className="product-card__prices">
            <Currency value={Number(product.price).toFixed(0)} />
            <span className="product-card__symbol">֏</span>
          </div>
        )
      }
      //comented by Manvel
      // if (!product?.special_price) {
      //   price = (
      //       <div className="product-card__prices">
      //         <Currency value={product.formatted_price} />
      //       </div>
      //   );
      // } else if (
      //     (date_now > date_from &&
      //         date_now < date_to &&
      //         product.special_price < product.price &&
      //         product.special_price) ||
      //     (product.special_price_to == null &&
      //         date_from < date_now &&
      //         product.special_price < product.price &&
      //         product.special_price) ||
      //     (product.special_price_from == null &&
      //         date_to > date_now &&
      //         product.special_price < product.price &&
      //         product.special_price) ||
      //     (product.special_price_to == null &&
      //         product.special_price_from == null &&
      //         product.special_price < product.price &&
      //         product.special_price) ||
      //     (product.special_price &&
      //         product.special_price_to == null &&
      //         product.special_price_from == null)
      // ) {
      //   price = (
      //       <div className="product-card__prices">
      //       <span className="product-card__new-price">
      //         <Currency value={product.formatted_special_price} />
      //       </span>
      //         {
      //           <span className="product-card__old-price">
      //           <Currency value={product.formatted_price} />
      //         </span>
      //         }
      //       </div>
      //   );
      // } else if (product?.product?.type === "configurable") {
      //   price = (
      //       <div className="product-card__prices">
      //         <Currency value={product.price_html} />
      //       </div>
      //   );
      // } else {
      //   price = (
      //       <div className="product-card__prices">
      //         <Currency value={product.formatted_price} />
      //       </div>
      //   );
      // }
      let prodId = cart.items.map((id) => {
        return id.product.id
      })
      return (
        <tr
          key={item.id}
          className="cart-table__row font-for-cart-responsive-parent"
        >
          <td className="cart-table__column cart-table__column--image">
            {image}
          </td>
          <td className="cart-table__column cart-table__column--product">
            <Link
              href={url.product(item.product)}
              className="cart-table__product-name"
            >
              {item.product.name}
            </Link>

            {options}
          </td>
          <td className="cart-table__column cart-table__column--price">
            {price}
          </td>

          <td className="cart-table__column cart-table__column--quantity">
            <span className="d-none data-title-mob">
              {' '}
              <FormattedMessage id="quantity" defaultMessage="Quantity" />:
            </span>
            <div className="delete-btn_shipping">
              {getItemQuantity(item) <= 1 && alternativelyRemoveButton}
            </div>
            <InputNumber
              onChange={(quantity) => {
                const quantities = handleChangeQuantity(
                  item,
                  quantity,
                  prodId,
                )
                dispatch(cartUpdateQuantities(
                  quantities,
                  cart.cartItems,
                  customer,
                  cartToken,
                ))
              }}
              hideMiusButton={getItemQuantity(item) <= 1}
              value={getItemQuantity(item)}
              min={1}
              max={maxQty}
            />
          </td>
          <td className="cart-table__column  cart-table__column--total column--total-fms pr-4">
            <span className="d-none data-title-mob">
              <FormattedMessage id="total" defaultMessage="Total" />:
            </span>
            <span className="cart-table__column-fm">
              {/*need to refactor when start working in currency*/}
              <Currency
                value={
                  // item?.product.special_price &&
                  // date_now >= date_from &&
                  // date_now <= date_to
                  //   ? Number(item.product.special_price).toFixed(0) *
                  //   item.quantity
                  //   : Number(item.product.price).toFixed(0) * item.quantity
                  specialPriceValues
                }
              />
              <span className="product-card__symbol">֏</span>
            </span>
          </td>
          <td className="cart-table__column cart-table__column--remove">
            {removeButton}
          </td>
        </tr>
      )
    })
  }

  const renderTotals = () => {
    return (
      <React.Fragment>
        <thead className="cart__totals-header">
          <tr>
            <th>Subtotal</th>
            <td>
              <Currency value={cart.subtotal.toFixed(0)} />
              <span className="product-card__symbol">֏</span>
            </td>
          </tr>
        </thead>
        <tbody className="cart__totals-body"></tbody>
      </React.Fragment>
    )
  }

  const renderCart = () => {

    const updateCartButton = (
      <AsyncAction
        action={() =>
          dispatch(cartUpdateQuantities(
            quantities,
            cart.cartItems,
            customer,
            cartToken,
          ))
        }
        render={({ run, loading }) => {
          const classes = classNames(
            'btn  rounded-pill  update-cart-button-fms',
            {
              'btn-loading': loading,
            },
          )

          return (
            <button
              type="button"
              onClick={run}
              className={classes}
              disabled={!cartNeedUpdate()}
            >
              <FormattedMessage id="updateCart" defaultMessage="Update Cart" />
            </button>
          )
        }}
      />
    )

    return (
      <div className="cart block mt-0">
        <div className="container cart-page-container">
          <table className="cart__table cart-table">
            <thead className="cart-table__head">
              <tr className="cart-table__row">
                <th className="cart-table__column cart-table__column--image text-right">
                  {/*<FormattedMessage*/}
                  {/*  id="wishList.image"*/}
                  {/*  defaultMessage="Image"*/}
                  {/*/>*/}
                  <FormattedMessage
                    id="global.product"
                    defaultMessage="Product"
                  />
                </th>
                <th className="cart-table__column cart-table__column--product">
                  {/*<FormattedMessage*/}
                  {/*  id="global.product"*/}
                  {/*  defaultMessage="Product"*/}
                  {/*/>*/}
                </th>
                <th className="cart-table__column cart-table__column--price text-right">
                  <FormattedMessage id="price" defaultMessage="Price" />
                </th>
                <th className="cart-table__column cart-table__column--quantity ">
                  <FormattedMessage id="qty" defaultMessage="Quantity" />
                </th>
                <th className="cart-table__column cart-table__column--total ">
                  <FormattedMessage id="total" defaultMessage="Total" />
                </th>
                <th
                  className="cart-table__column cart-table__column--remove"
                  aria-label="Remove"
                />
              </tr>
            </thead>
            <tbody className="cart-table__body">{renderItems()}</tbody>
          </table>
          <div className="cart__actions">
            <div className="cart__buttons d-flex justify-content-between">
              <div className="continue--arrow continue-shopping-title">
                <ArrowBackSvg className="continue--arrow" />
                <Link href="/">
                  <a>
                    <FormattedMessage
                      id="continue.shopping"
                      defaultMessage="Continue Shopping"
                    />
                  </a>
                </Link>
              </div>
              <div className="chekout-total-fms">
                <div className="total-pr-fms">
                  <FormattedMessage
                    id="total.price"
                    defaultMessage="Total Price:"
                  />{' '}
                </div>
                <div>
                  {/*{removeCurrencyTemp(cart.total)}  /!* temporary version *!/*/}
                   <Currency value={cart.total} />
                </div>
              </div>

              {/* {updateCartButton} */}
            </div>
          </div>
          <div className="cart__totals-td">
            <Link
              href="/shop/checkout"
              className="btn text-light btn-orange btn-block  btn-lg cart__checkout-button f16"
            >
              <a className="btn text-light btn-orange btn-block  btn-lg cart__checkout-button f16">
                <FormattedMessage id="checkout" defaultMessage="Checkout" />
              </a>
            </Link>
          </div>

          {/* <div className="row justify-content-end  shopping-cart-mobile-fms shopping-cart-fms">
            <div className="shopping-cart-totals">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Cart Totals</h3>

                  <table className="cart__totals">
                     {this.renderTotals()}
                    <tfoot className="cart__totals-footer">

                      <tr>
                        <th>
                          {" "}
                          <FormattedMessage
                            id="tax"
                            defaultMessage="Tax"
                          />{" "}
                        </th>
                        <td>{cart.tax}</td>
                      </tr>
                      <tr>
                        <th>
                          {" "}
                          <FormattedMessage
                            id="total"
                            defaultMessage="Total"
                          />{" "}
                        </th>
                        <td>
                          <Currency value={cart.total} />
                        </td>
                      </tr>
                      <tr>

                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    )
  }

  const breadcrumb = [
    { title: <FormattedMessage id="home" defaultMessage="Home" />, url: '' },
    {
      title: (
        <FormattedMessage id="shopping.cart" defaultMessage="Shopping Cart" />
      ),
      url: '',
    },
  ]

  let content
  if (cart.quantity) {
    content = renderCart()
  } else {
    content = (
      <div className="block block-empty">
        <div className="container">
          <div className="block-empty__body block-empty-fms">
            <h3 className="text-center">
              <FormattedMessage
                id="empty-cart"
                defaultMessage="Your shopping cart is empty!"
              />
            </h3>
            <div className="block-empty__actions">
              <Link href="/">
                <a className="btn btn-orange btn-primary px-4 f16">
                  <FormattedMessage id="continue" defaultMessage="continue" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <React.Fragment>
      <Helmet>
        <title>{`Shopping Cart — ${theme.name}`}</title>
      </Helmet>

      <PageHeader header="Shopping Cart" breadcrumb={breadcrumb} />
      <div className="shopping-cart-text">
        <FormattedMessage id="shopping.cart" defaultMessage="Shopping Cart" />
      </div>

      {content}
    </React.Fragment>
  )
}

export default ShopPageCart

// commented by Tigran

//*************** CLASS COMPONENT *************//
// class ShopPageCart extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       /** example: [{itemId: 8, value: 1}] */
//       quantities: [],
//       newItems: [],
//       cartToken: this.props.cartToken,
//       customer: this.props.customer,
//     };
//   }
//
//   componentDidMount() {
//     const {
//       cart: { items },
//     } = this.props;
//     const qty = items.map((item) => {
//       return {
//         cartItem: 1,
//         itemId: item.id,
//         value: item.quantity,
//       };
//     });
//     this.setState({ quantities: qty });
//   }
//
//   getItemQuantity(item) {
//     const { quantities } = this.state;
//     const quantity = quantities.find((x) => x.itemId === item.id);
//     return quantity ? quantity.value : item.quantity;
//   }
//
//   handleChangeQuantity = (item, quantity, cartItem) => {
//     const quantities = JSON.parse(JSON.stringify(this.state.quantities));
//     let found = false;
//     quantities.filter((x) => {
//       if (x.itemId === item.id) {
//         x.value = quantity;
//         found = true;
//       }
//       return x;
//     });
//
//     if (!found) {
//       quantities.push({
//         itemId: item.id,
//         value: quantity,
//         cartItem: cartItem,
//       });
//     }
//
//     this.setState({ quantities });
//     return quantities;
//   };
//
//   cartNeedUpdate() {
//     const { quantities } = this.state;
//     const { cart } = this.props;
//     return (
//       quantities.filter((x) => {
//         const item = cart.items.find((item) => item.id === x.itemId);
//
//         return item && item.quantity !== x.value && x.value !== "";
//       }).length > 0
//     );
//   }
//
//   renderItems() {
//     const { cart, cartRemoveItem, cartUpdateQuantities } = this.props;
//
//     return cart.items.map((item, index) => {
//       let image;
//       let options;
//       let id;
//
//       const maxQty = this.props.bOrder ? 50000 : item.product.qty;
//       if (item.product.images && item.product.images.length > 0) {
//         id = cart.items[index].cartItemId;
//
//         image = (
//           <div className="product-image">
//             <Link
//               href={url.product(item.product)}
//               className="product-image__body "
//             >
//               <a>
//                 <Image
//                   className="product-image__img product-small-img"
//                   // src={item.product.images[0].small_image_url}
//                   // src={urlLink + '/cache/medium/' + item.product.images[0] || urlLink + '/cache/medium/' + item.product.images[0].path}    urlLink + "/cache/medium/" + item.product.images[0]
//                   src={
//                     item.product.images[0].medium_image_url ||
//                     urlLink + "/cache/medium/" + item.product.images[0] ||
//                     "david"
//                   }
//                   alt=""
//                   layout="fill"
//                 />
//               </a>
//             </Link>
//           </div>
//         );
//       }
//       if (item.options.length > 0) {
//         options = (
//           <ul className="cart-table__options">
//             {item.options.map((option, index) => (
//               <li
//                 key={index}
//               >{`${option.optionTitle}: ${option.valueTitle}`}</li>
//             ))}
//           </ul>
//         );
//       }
//       let cartItemId;
//       for (var i = 0; i < cart.cartItems.length; i++) {
//         if (cart.cartItems[i].productID === item.product.product_id) {
//           cartItemId = cart.cartItems[i].cartItemId;
//           break;
//         }
//       }
//
//       const removeButton = (
//         <AsyncAction
//           action={() =>
//             cartRemoveItem(
//               cartItemId,
//               item,
//               this.state.cartToken,
//               this.state.customer
//             )
//           }
//           render={({ run, loading }) => {
//             const classes = classNames(
//               "btn btn-light btn-sm btn-svg-icon del-icon-fms",
//               {
//                 "btn-loading": loading,
//               }
//             );
//
//             return (
//               <button type="button" onClick={run} className={classes}>
//                 <CartTrash />
//               </button>
//             );
//           }}
//         />
//       );
//
//       const alternativelyRemoveButton = (
//         <AsyncAction
//           action={() =>
//             cartRemoveItem(
//               cartItemId,
//               item,
//               this.state.cartToken,
//               this.state.customer
//             )
//           }
//           render={({ run, loading }) => {
//             const classes = classNames(
//               "btn btn-light btn-sm btn-svg-icon del-icon-fms delete-btn-position",
//               {
//                 "btn-loading": loading,
//               }
//             );
//
//             return (
//               <button type="button" onClick={run} className={classes}>
//                 <CartTrash />
//               </button>
//             );
//           }}
//         />
//       );
//
//       const product = cart.items[index].product;
//       const CONFIG = "simple";
//       let price;
//
//       let newDate = new Date();
//       const date_from = moment
//         .unix(product.special_price_from)
//         .format("YYYY-MM-DD");
//       const date_now = moment(newDate).format("YYYY-MM-DD");
//       const date_to = moment
//         .unix(product.special_price_to)
//         .format("YYYY-MM-DD");
//
//       if (!product?.special_price && CONFIG === "configurable") {
//         price = (
//           <div className="product-card__prices">
//             <Currency value={product.formatted_price} />
//           </div>
//         );
//       } else if (
//         product?.special_price &&
//         date_now >= date_from &&
//         date_now <= date_to
//       ) {
//         price = (
//           <div className="product-card__prices">
//             <span className="product-card__new-price">
//               <span className="product-card__symbol">֏</span>
//               <Currency value={Number(product.special_price).toFixed(0)} />
//             </span>
//             {
//               <span className="product-card__old-price">
//                 <span className="product-card__symbol">֏</span>
//                 <Currency value={Number(product.price).toFixed(0)} />
//               </span>
//             }
//           </div>
//         );
//       } else if (product?.product?.type === "configurable") {
//         price = (
//           <div className="product-card__prices">
//             <span className="product-card__symbol">֏</span>
//             <Currency value={Number(product.min_price).toFixed(0)} />
//           </div>
//         );
//       } else {
//         price = (
//           <div className="product-card__prices">
//             <span className="product-card__symbol">֏</span>
//             <Currency value={Number(product.price).toFixed(0)} />
//           </div>
//         );
//       }
//       //comented by Manvel
//       // if (!product?.special_price) {
//       //   price = (
//       //       <div className="product-card__prices">
//       //         <Currency value={product.formatted_price} />
//       //       </div>
//       //   );
//       // } else if (
//       //     (date_now > date_from &&
//       //         date_now < date_to &&
//       //         product.special_price < product.price &&
//       //         product.special_price) ||
//       //     (product.special_price_to == null &&
//       //         date_from < date_now &&
//       //         product.special_price < product.price &&
//       //         product.special_price) ||
//       //     (product.special_price_from == null &&
//       //         date_to > date_now &&
//       //         product.special_price < product.price &&
//       //         product.special_price) ||
//       //     (product.special_price_to == null &&
//       //         product.special_price_from == null &&
//       //         product.special_price < product.price &&
//       //         product.special_price) ||
//       //     (product.special_price &&
//       //         product.special_price_to == null &&
//       //         product.special_price_from == null)
//       // ) {
//       //   price = (
//       //       <div className="product-card__prices">
//       //       <span className="product-card__new-price">
//       //         <Currency value={product.formatted_special_price} />
//       //       </span>
//       //         {
//       //           <span className="product-card__old-price">
//       //           <Currency value={product.formatted_price} />
//       //         </span>
//       //         }
//       //       </div>
//       //   );
//       // } else if (product?.product?.type === "configurable") {
//       //   price = (
//       //       <div className="product-card__prices">
//       //         <Currency value={product.price_html} />
//       //       </div>
//       //   );
//       // } else {
//       //   price = (
//       //       <div className="product-card__prices">
//       //         <Currency value={product.formatted_price} />
//       //       </div>
//       //   );
//       // }
//       let prodId = cart.items.map((id) => {
//         return id.product.id;
//       });
//       return (
//         <tr
//           key={item.id}
//           className="cart-table__row font-for-cart-responsive-parent"
//         >
//           <td className="cart-table__column cart-table__column--image">
//             {image}
//           </td>
//           <td className="cart-table__column cart-table__column--product">
//             <Link
//               href={url.product(item.product)}
//               className="cart-table__product-name"
//             >
//               {item.product.name}
//             </Link>
//
//             {options}
//           </td>
//           <td className="cart-table__column cart-table__column--price">
//             {price}
//           </td>
//
//           <td className="cart-table__column cart-table__column--quantity">
//             <span className="d-none data-title-mob">
//               {" "}
//               <FormattedMessage id="quantity" defaultMessage="Quantity" />:
//             </span>
//             <div className="delete-btn_shipping">
//               {this.getItemQuantity(item) <= 1 && alternativelyRemoveButton}
//             </div>
//             <InputNumber
//               onChange={(quantity) => {
//                 const quantities = this.handleChangeQuantity(
//                   item,
//                   quantity,
//                   prodId
//                 );
//                 cartUpdateQuantities(
//                   quantities,
//                   this.props.cart.cartItems,
//                   this.state.customer,
//                   this.state.cartToken
//                 );
//               }}
//               hideMiusButton={this.getItemQuantity(item) <= 1}
//               value={this.getItemQuantity(item)}
//               min={1}
//               max={maxQty}
//             />
//           </td>
//           <td className="cart-table__column  cart-table__column--total column--total-fms pr-4">
//             <span className="d-none data-title-mob">
//               <FormattedMessage id="total" defaultMessage="Total" />:
//             </span>
//             <span className="cart-table__column-fm">
//               {/*need to refactor when start working in currency*/}
//               <Currency
//                 value={
//                   item?.product.special_price &&
//                   date_now >= date_from &&
//                   date_now <= date_to
//                     ? Number(item.product.special_price).toFixed(0) *
//                       item.quantity
//                     : Number(item.product.price).toFixed(0) * item.quantity
//                 }
//               />
//               <span className="product-card__symbol">֏</span>
//             </span>
//           </td>
//           <td className="cart-table__column cart-table__column--remove">
//             {removeButton}
//           </td>
//         </tr>
//       );
//     });
//   }
//
//   renderTotals() {
//     const { cart } = this.props;
//     return (
//       <React.Fragment>
//         <thead className="cart__totals-header">
//           <tr>
//             <th>Subtotal</th>
//             <td>
//               <Currency value={cart.subtotal.toFixed(0)} />
//               <span className="product-card__symbol">֏</span>
//             </td>
//           </tr>
//         </thead>
//         <tbody className="cart__totals-body"></tbody>
//       </React.Fragment>
//     );
//   }
//
//   renderCart() {
//     const { cart, cartUpdateQuantities } = this.props;
//     const { quantities } = this.state;
//
//     const updateCartButton = (
//       <AsyncAction
//         action={() =>
//           cartUpdateQuantities(
//             quantities,
//             cart.cartItems,
//             this.state.customer,
//             this.state.cartToken
//           )
//         }
//         render={({ run, loading }) => {
//           const classes = classNames(
//             "btn  rounded-pill  update-cart-button-fms",
//             {
//               "btn-loading": loading,
//             }
//           );
//
//           return (
//             <button
//               type="button"
//               onClick={run}
//               className={classes}
//               disabled={!this.cartNeedUpdate()}
//             >
//               <FormattedMessage id="updateCart" defaultMessage="Update Cart" />
//             </button>
//           );
//         }}
//       />
//     );
//
//     return (
//       <div className="cart block mt-0">
//         <div className="container cart-page-container">
//           <table className="cart__table cart-table">
//             <thead className="cart-table__head">
//               <tr className="cart-table__row">
//                 <th className="cart-table__column cart-table__column--image text-right">
//                   {/*<FormattedMessage*/}
//                   {/*  id="wishList.image"*/}
//                   {/*  defaultMessage="Image"*/}
//                   {/*/>*/}
//                   <FormattedMessage
//                     id="global.product"
//                     defaultMessage="Product"
//                   />
//                 </th>
//                 <th className="cart-table__column cart-table__column--product">
//                   {/*<FormattedMessage*/}
//                   {/*  id="global.product"*/}
//                   {/*  defaultMessage="Product"*/}
//                   {/*/>*/}
//                 </th>
//                 <th className="cart-table__column cart-table__column--price text-right">
//                   <FormattedMessage id="price" defaultMessage="Price" />
//                 </th>
//                 <th className="cart-table__column cart-table__column--quantity ">
//                   <FormattedMessage id="qty" defaultMessage="Quantity" />
//                 </th>
//                 <th className="cart-table__column cart-table__column--total ">
//                   <FormattedMessage id="total" defaultMessage="Total" />
//                 </th>
//                 <th
//                   className="cart-table__column cart-table__column--remove"
//                   aria-label="Remove"
//                 />
//               </tr>
//             </thead>
//             <tbody className="cart-table__body">{this.renderItems()}</tbody>
//           </table>
//           <div className="cart__actions">
//             <div className="cart__buttons d-flex justify-content-between">
//               <div className="continue--arrow continue-shopping-title">
//                 <ArrowBackSvg className="continue--arrow" />
//                 <Link href="/">
//                   <a>
//                     <FormattedMessage
//                       id="continue.shopping"
//                       defaultMessage="Continue Shopping"
//                     />
//                   </a>
//                 </Link>
//               </div>
//               <div className="chekout-total-fms">
//                 <div className="total-pr-fms">
//                   <FormattedMessage
//                     id="total.price"
//                     defaultMessage="Total Price:"
//                   />{" "}
//                 </div>
//                 <div>
//                   <Currency value={cart.total} />
//                 </div>
//               </div>
//
//               {/* {updateCartButton} */}
//             </div>
//           </div>
//           <div className="cart__totals-td">
//             <Link
//               href="/shop/checkout"
//               className="btn text-light btn-orange btn-block  btn-lg cart__checkout-button f16"
//             >
//               <a className="btn text-light btn-orange btn-block  btn-lg cart__checkout-button f16">
//                 <FormattedMessage id="checkout" defaultMessage="Checkout" />
//               </a>
//             </Link>
//           </div>
//
//           {/* <div className="row justify-content-end  shopping-cart-mobile-fms shopping-cart-fms">
//             <div className="shopping-cart-totals">
//               <div className="card">
//                 <div className="card-body">
//                   <h3 className="card-title">Cart Totals</h3>
//
//                   <table className="cart__totals">
//                      {this.renderTotals()}
//                     <tfoot className="cart__totals-footer">
//
//                       <tr>
//                         <th>
//                           {" "}
//                           <FormattedMessage
//                             id="tax"
//                             defaultMessage="Tax"
//                           />{" "}
//                         </th>
//                         <td>{cart.tax}</td>
//                       </tr>
//                       <tr>
//                         <th>
//                           {" "}
//                           <FormattedMessage
//                             id="total"
//                             defaultMessage="Total"
//                           />{" "}
//                         </th>
//                         <td>
//                           <Currency value={cart.total} />
//                         </td>
//                       </tr>
//                       <tr>
//
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div> */}
//         </div>
//       </div>
//     );
//   }
//
//   render() {
//     const { cart } = this.props;
//
//     const breadcrumb = [
//       { title: <FormattedMessage id="home" defaultMessage="Home" />, url: "" },
//       {
//         title: (
//           <FormattedMessage id="shopping.cart" defaultMessage="Shopping Cart" />
//         ),
//         url: "",
//       },
//     ];
//
//     let content;
//     if (cart.quantity) {
//       content = this.renderCart();
//     } else {
//       content = (
//         <div className="block block-empty">
//           <div className="container">
//             <div className="block-empty__body block-empty-fms">
//               <h3 className="text-center">
//                 <FormattedMessage
//                   id="empty-cart"
//                   defaultMessage="Your shopping cart is empty!"
//                 />
//               </h3>
//               <div className="block-empty__actions">
//                 <Link href="/">
//                   <a className="btn btn-orange rounded-pill px-4 f16">
//                     <FormattedMessage id="continue" defaultMessage="continue" />
//                   </a>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return (
//       <React.Fragment>
//         <Helmet>
//           <title>{`Shopping Cart — ${theme.name}`}</title>
//         </Helmet>
//
//         <PageHeader header="Shopping Cart" breadcrumb={breadcrumb} />
//         <div className="shopping-cart-text">
//           <FormattedMessage id="shopping.cart" defaultMessage="Shopping Cart" />
//         </div>
//
//         {content}
//       </React.Fragment>
//     );
//   }
// }
//
// const mapStateToProps = (state) => ({
//   cart: state.cart,
//   customer: state.customer,
//   cartToken: state.cartToken,
//   bOrder: state.general.bOrder,
// });
//
// const mapDispatchToProps = {
//   cartRemoveItem,
//   cartUpdateQuantities,
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCart);

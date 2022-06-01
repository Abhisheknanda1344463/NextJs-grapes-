import { toast } from "react-toastify";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_UPDATE_QUANTITIES,
  UPDATE_CART_DATA,
  CART_DELETE_ALL,
  CART_UPDATE_LANGUAGE,
  SET_POPUP,

} from "./cartActionTypes";
import { url, apiUrlWithStore } from "../../helper";
import React from "react";
import { FormattedMessage } from "react-intl";
import { CheckToastSvg, FailSvg } from "svg";
import { runFbPixelEvent } from "../../services/utils";

// const translations = {
//     product: {
//         hy: 'Ապրանք',
//         ru: 'товар',
//         en: "Product"
//     },
//     added: {
//         hy: 'Ավելացվել է զամբյուղ',
//         ru: 'добавлен в корзину',
//         en: "Product added to cart"
//     },
//     warningQty:{
//         hy: 'Հասանելի առավելագույն քանակը ',
//         ru: 'добавлен в корзину',
//         en: "The maximum available quantity is"
//     }

// }

// export function getUpSellAndCrossSellProducts(locale, product, currency) {
//   try {
//     fetch(
//       apiUrlWithStore(
//         `/db/get-crosell-upsell-products?locale=${locale}&product_id=${product.product_id}&currency=${currency}`
//       )
//     )
//       .then((response) => response.json())
//       .then((res) => {
//         // console.log(res, 'get-crosell-upsell-products');
//       });
//   } catch (e) {
//     console.log(e);
//   }
// }
// export const popUp = (payload) => ({
//   type: SET_POPUP,
//   payload
// });

export function cartAddItemSuccessAfterLogin(
  product,
  options = [],
  quantity = 1,
  cartItems,
  locale
) {
  return {
    type: CART_ADD_ITEM,
    product,
    options,
    quantity,
    cartItems,
  };
}

export function cartAddItemSuccess(
  product,
  options = [],
  quantity = 1,
  cartItems,
  locale
) {
  runFbPixelEvent({ name: "Add To Cart" });
  let overWriteProductName = cartItems.items.map((item) => {
    if (item.product.id === product.product_id) {
      product.name = item.product.name;
      return product;
    }
  });
  const newProduct = Object.assign({}, ...overWriteProductName);

  toast.success(
    <span className="d-flex chek-fms">
      <CheckToastSvg />
      <FormattedMessage
        id="add-cart"
        defaultMessage={`Product "${newProduct.name ? newProduct.name : ""
          }" added to cart`}
      />
    </span>,
    {
      hideProgressBar: true,
    }
  );
  return {
    type: CART_ADD_ITEM,
    newProduct,
    options,
    quantity,
    cartItems,
  };
}

export function cartUpdateData(payload) {
  return {
    type: UPDATE_CART_DATA,
    payload,
  };
}

export function cartRemoveItemSuccess(itemId, item, cartData) {

  return {
    type: CART_REMOVE_ITEM,
    itemId,
    item,
    cartData,
  };
}

export function cartRemoveAllItems(quantities) {
  return {
    type: CART_DELETE_ALL,
  };
}

export function cartUpdateQuantitiesSuccess(payload) {
  return {
    type: CART_UPDATE_QUANTITIES,
    payload,
  };
}

export function cartUpdateLanguage(payload) {
  return {
    type: CART_UPDATE_LANGUAGE,
    payload,
  };
}

export function cartAddItemAfterLogin(
  product,
  options = [],
  quantity = 1,
  cartToken,
  customer,
  locale,
  dispatch,
  data
) {
  const as = () => {
    dispatch(
      cartAddItemSuccessAfterLogin(
        product,
        options,
        quantity,
        data.data,
        locale
      )
    );
  };
  return as();
}

export function cartAddItem(
  product,
  options = [],
  quantity = 1,
  cartToken,
  customer,
  locale,
  bundleProductInfo = null,
  pageFrom = ""
) {
  let body;
  if (customer && customer.token) {
    body = {
      api_token: cartToken.cartToken,
      product_id: product.product_id,
      quantity: quantity,
      token: customer.token,
    };
    // console.log(body.product_id,"with customer")
    // console.log(body.cartToken,"with carttoken in cartActions")
  } else {
    body = {
      api_token: cartToken.cartToken,
      product_id: product.product_id,
      quantity: quantity,
    };
  }
  // console.log(product, "product in cart action")

  if (bundleProductInfo) {
    const { options, selectedOptions } = bundleProductInfo;
    const keys = Object.keys(selectedOptions);
    const collection = keys
      .map((key) => {
        const filed = options.options.find((e) => e.type == key);
        if (filed) {
          const arrayOfIds = selectedOptions[key].map((e) => e.id);
          return {
            [filed.id]: arrayOfIds,
          };
        }
        return null;
      })
      .reduce((acc, next) => {
        const key = Object.keys(next);
        return {
          ...acc,
          [key]: next[key],
        };
      }, {});
  }

  return (dispatch) =>
    fetch(
      apiUrlWithStore(
        "/api/checkout/cart/add/" +
        `${pageFrom == "homePage" && product.product_id !== undefined
          ? product.product_id
          : product.product_id
        }`
      ),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res, "response")
        if (!res.error) {
          dispatch(
            cartAddItemSuccess(product, options, quantity, res.data, locale)
          );
        } else {
          if (body.quantity >= product.qty) {
            toast(
              <span className="d-flex faild-toast-fms">
                <FailSvg />
                <FormattedMessage
                  id="sign-or-register"
                  defaultMessage="This product is not available"
                />
              </span>,
              {
                hideProgressBar: true,
                className: "wishlist-toast product-not-available-fms",
              }
            );
          }
          console.log(res.error.message);
        }
      });
}

export function cartRemoveItemAfterLogin(itemId, item, dispatch) {
  return dispatch(cartRemoveItemSuccess(itemId, item));
}

//Create By Manvel
export function cartTranslation(cartToken, customer, locale) {
  return (dispatch) =>
    fetch(
      apiUrlWithStore(
        `/api/checkout/cart?api_token=${cartToken.cartToken}${customer && customer.token ? "&token=" + customer.token : ""
        }&locale=${locale}`
      )
    )
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          const {
            formated_grand_total,
            items,
            sub_total,
            items_qty,
            formated_base_sub_total,
          } = res.data;
          const quantities = items.map((item) => {
            return {
              cartItem: 1,
              itemId: item.id,
              value: item.quantity,
            };
          });
          dispatch(
            cartUpdateLanguage({
              quantities,
              formated_grand_total,
              items,
              sub_total,
              items_qty,
            })
          );
        }
      });
}

export function cartRemoveItem(itemId, item, cartToken, customer) {
  return (dispatch) =>
    fetch(
      apiUrlWithStore(
        `/api/checkout/cart/remove-item/${itemId}?api_token=${cartToken.cartToken
        }${customer.token ? "&token=" + customer.token : ""}`
      )
    )
      .then((res) => res.json())
      .then((responce) => {
        return responce
          ? dispatch(cartRemoveItemSuccess(itemId, item, responce.data))
          : console.error(responce.error);
      })
      .catch((error) => console.error(error));
}

export function cartUpdateQuantities(
  quantities,
  cartItems,
  customerToken,
  ApiToken
) {
  let qty = {};
  let options;
  quantities.map((upitems, index) => {
    qty[cartItems[index].cartItemId] = upitems.value;
  });

  const body = {
    token: customerToken,
    api_token: ApiToken.cartToken,
    qty: qty,
  };
  if (customerToken.token) {
    options = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: customerToken.token,
        api_token: ApiToken.cartToken,
        qty: qty,
      }),
    };
  } else {
    options = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_token: ApiToken.cartToken,
        qty: qty,
      }),
    };
  }
  return (dispatch) =>
    fetch(apiUrlWithStore("/api/checkout/cart/update"), options)
      .then((res) => res.json())
      .then((responce) => {
        if (responce.data) {
          const {
            formated_grand_total,
            items,
            sub_total,
            items_qty,
            formated_base_sub_total,
          } = responce.data;
          dispatch(
            cartUpdateQuantitiesSuccess({
              quantities,
              formated_grand_total,
              items,
              sub_total,
              items_qty,
            })
          );
        } else {
          console.error(responce.error);
        }
      })
      .catch((error) => console.error(error));
}

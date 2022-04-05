import { toast } from "react-toastify";
import { WISHLIST_ADD_ITEM, WISHLIST_REMOVE_ITEM } from "./wishlistActionTypes";
import React from "react";
import { FormattedMessage } from "react-intl";
import { CheckToastSvg } from "svg";

export function wishlistAddItemSuccess(product, locale) {
  // toast.success(
  //   <span className="d-flex chek-fms">
  //     <CheckToastSvg />
  //     <FormattedMessage
  //       id="add-wish-list"
  //       defaultMessage={`Product "${product.name}" added to wish list`}
  //     />
  //   </span>,
  // {
  //   hideProgressBar: true,
  // }
  // );

  return {
    type: WISHLIST_ADD_ITEM,
    product,
  };
}

export function wishlistRemoveItemSuccess(productId) {
  return {
    type: WISHLIST_REMOVE_ITEM,
    productId,
  };
}

export function wishlistAddItem(product, locale) {
  return (dispatch) =>
    new Promise((resolve) => {
      setTimeout(() => {
        dispatch(wishlistAddItemSuccess(product, locale));
        resolve();
      }, 500);
    });
}

export function wishlistRemoveItem(productId) {
  ////console.log(productId, "productId");
  return (dispatch) =>
    new Promise((resolve) => {
      setTimeout(() => {
        dispatch(wishlistRemoveItemSuccess(productId));
        resolve();
      }, 500);
    });
}

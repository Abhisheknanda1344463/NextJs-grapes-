import {
  EMPTY_CART,
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_UPDATE_QUANTITIES,
  UPDATE_CART_DATA,
  CART_DELETE_ALL,
  CART_UPDATE_LANGUAGE,
  CART_CROSS_SELL,
  CART_UP_SELL,
  SET_POPUP,
} from "./cartActionTypes";
import currencyReducer from "../currency";
import store from "../../store";

/**
 * @param {array} items
 * @param {object} product
 * @param {array} options
 * @return {number}
 */

function findItemIndex(items, product, options) {
  return items.findIndex((item) => {
    if (
      item.product.id !== product.id ||
      item.options.length !== options.length
    ) {
      return false;
    }

    for (let i = 0; i < options.length; i += 1) {
      const option = options[i];
      const itemOption = item.options.find(
        (itemOption) =>
          itemOption.optionId === option.optionId &&
          itemOption.valueId === option.valueId
      );

      if (!itemOption) {
        return false;
      }
    }

    return true;
  });
}

function calcSubtotal(items) {
  return (
    "$" + items.reduce((subtotal, item) => subtotal + item.total, 0) + ".00"
  );
}

function calcQuantity(items) {
  return items.reduce((quantity, item) => quantity + item.quantity, 0);
}

function calcTotal(subtotal, extraLines) {
  // return (
  //   subtotal +
  //   extraLines.reduce((total, extraLine) => total + extraLine.price, 0)
  // );
  return subtotal;
}

function removeAllItems(state) {
  return {
    ...state,
    tax: 0,
    total: 0,
    items: [],
    subtotal: 0,
    quantity: 0,
    cartItems: [],
  };
}

function addItem(state, product, options, quantity, CartItemID) {
  const { formated_tax_total, formated_taxes } = CartItemID;
  let fmCartProductPrice;
  let fmCartProductPriceTotal;
  const cartItems = CartItemID.items.map((pr) => {
    if (product.id == pr.product.id) {
      fmCartProductPrice = pr.formated_price;
      fmCartProductPriceTotal = pr.formated_total;
    }
    return {
      cartItemId: pr.id,
      productID: pr.product.id,
      productPrice: pr.formated_price,
      cartItemstotal: pr.formated_total,
    };
  });

  const itemIndex = findItemIndex(state.items, product, options);

  let newItems;
  let { lastItemId } = state;

  if (itemIndex === -1) {
    lastItemId += 1;
    newItems = [
      ...state.items,
      {
        id: lastItemId,

        product: JSON.parse(JSON.stringify(product)),
        options: JSON.parse(JSON.stringify(options)),
        price: fmCartProductPrice || product.price,
        total: fmCartProductPriceTotal,
        quantity,
        tax: formated_tax_total,
      },
    ];
  } else {
    const item = state.items[itemIndex];
    newItems = [
      ...state.items.slice(0, itemIndex),
      {
        ...item,

        quantity: item.quantity + quantity,
        price: fmCartProductPrice || product.price,
        total: fmCartProductPriceTotal,
      },
      ...state.items.slice(itemIndex + 1),
    ];
  }

  // const subtotal = calcSubtotal(newItems);
  //so when we use formated_grand_total with spaces please check // take into consideration grand_total
  const subtotal = CartItemID.formated_grand_total;
  const total = calcTotal(subtotal, state.extraLines);
  return {
    ...state,
    lastItemId,
    subtotal,
    total,
    items: newItems,
    quantity: calcQuantity(newItems),
    cartItems: cartItems,
    tax: formated_tax_total,
  };
}

function removeItem(state, itemId, item, cartData) {
  const { items, cartItems } = state;
  const newCartItems = cartItems.filter(
    (it) => it.productID !== item.product.product_id
  );
  const newItems = items.filter((el) => el.id !== item.id);

  ///const subtotal = calcSubtotal(newItems);
  const subtotal = cartData ? cartData.formated_grand_total : 0;
  const total = calcTotal(subtotal, state.extraLines);

  return {
    ...state,
    items: newItems,
    cartItems: newCartItems,
    quantity: calcQuantity(newItems),
    subtotal,
    total,
    tax: cartData?.formated_tax_total || 0,
  };
}

function updateCartLanguage(
  state,
  {
    quantities,
    formated_grand_total,
    items: responseItemsLanguage,
    sub_total,
    items_qty,
  }
) {
  let needUpdate = false;
  const newItemsLanguage = state.items.map((item) => {
    const quantity = quantities.find(
      (x) => x.itemId === item.id && x.value !== item.quantity
    );
    const updatedItem = responseItemsLanguage.find(
      (e) => item.product.product_id === e.product.id
    );
    const updateName = responseItemsLanguage.find((elem) => {
      if (item.product.product_id === elem.product.id) {
        item.product.name = elem.product.name;
      }
    });
    needUpdate = true;
    return {
      ...item,
      price: updatedItem.sub_total,
      name: updatedItem,
      quantity: updatedItem.quantity ? updatedItem.quantity : quantity.value,
      total: updatedItem
        ? updatedItem.formated_grand_total
        : quantity.value * item.price,
    };
  });
  if (needUpdate) {
    const subtotal = formated_grand_total;
    const total = calcTotal(formated_grand_total, state.extraLines);

    return {
      ...state,
      items: newItemsLanguage,
      quantity: calcQuantity(newItemsLanguage),
      subtotal,
      total,
    };
  }

  return state;
}

function updateQuantities(
  state,
  {
    quantities,
    formated_grand_total,
    items: responseItems,
    sub_total,
    items_qty,
    formated_base_sub_total,
  }
) {
  let needUpdate = false;
  const newItems = state.items.map((item) => {
    const quantity = quantities.find(
      (x) => x.itemId === item.id && x.value !== item.quantity
    );
    const updatedItem = responseItems.find(
      (e) => item.product.product_id === e.product.id
    );

    if (!quantity) {
      return item;
    }
    needUpdate = true;
    return {
      ...item,
      // name: updateName,
      price: updatedItem.sub_total,
      quantity: updatedItem.quantity ? updatedItem.quantity : quantity.value,
      total: updatedItem
        ? updatedItem.formated_grand_total
        : quantity.value * item.price,
    };
  });
  if (needUpdate) {
    const subtotal = formated_grand_total;
    const total = calcTotal(formated_grand_total, state.extraLines);
    return {
      ...state,
      items: newItems,
      quantity: calcQuantity(newItems),
      subtotal,
      total,
    };
  }

  return state;
}

/*
 * item example:
 * {
 *   id: 1,
 *   product: {...}
 *   options: [
 *     {optionId: 1, optionTitle: 'Color', valueId: 1, valueTitle: 'Red'}
 *   ],
 *   price: 250,
 *   quantity: 2,
 *   total: 500
 * }
 * extraLine example:
 * {
 *   type: 'shipping',
 *   title: 'Shipping',
 *   price: 25
 * }
 */
const initialState = {
  lastItemId: 0,
  quantity: 0,
  items: [],
  subtotal: 0,
  // extraLines: [ // shipping, taxes, fees, .etc
  // {
  //     type: 'shipping',
  //     title: 'Shipping',
  //     price: 25,
  // },
  // {
  //     type: 'tax',
  //     title: 'Tax',
  //     price: 0,
  // },
  // ],
  total: 0,
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case EMPTY_CART:

    case CART_ADD_ITEM:
      return addItem(
        state,
        action.newProduct,
        action.options,
        action.quantity,
        action.cartItems
      );

    case UPDATE_CART_DATA:
      return {
        ...state,
        ...action.payload,
      };
    case CART_REMOVE_ITEM:
      return removeItem(state, action.itemId, action.item, action.cartData);

    case CART_UPDATE_QUANTITIES:
      return updateQuantities(state, action.payload);
    case CART_UPDATE_LANGUAGE:
      return updateCartLanguage(state, action.payload);
    case CART_DELETE_ALL:
      return removeAllItems(state);
    case CART_UP_SELL:
      return getCartUpSell(state, action.payload)
    case CART_CROSS_SELL:
      return getCartCrossSell(state, action.payload)
    case SET_POPUP:
      return {
        ...state,
        popUpName: action.payload,
      };
    default:
      return state;
  }
}

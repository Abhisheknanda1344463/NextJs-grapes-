// react
import React, { useState } from "react";
import Image from "components/hoc/Image";
import InputNumber from "components/shared/InputNumber";
export default function BundleRadio(props) {
  console.log(props, "props in bundleRadio")
  // const [quantity, setQuantity] = useState(1);
  let [backgroundColor, setBackgroundColor] = useState("#f3f3f3");
  const changeBackgroundColor = (id) => {
    setBackgroundColor(id);
  };
  // let handleChangeQuantity = (quantity) => {
  //   setQuantity(quantity++);
  // };
  // const product = props.praduct.products;
  const product = [
    {
      id: 1,
      name: "poxos",
      base_image: {
        small_image_url: "https://4lada.ru/forum/data/avatars/l/0/56.jpg?1491721563"
      },
      price: "1500",
      label: "head",
      qty: 5,
    },
    {
      id: 2,
      name: "petros",
      base_image: {
        small_image_url: "https://papacarlo72.ru/wp-content/uploads/2021/09/PapaCarloLogo.png"
      },
      price: "3500",
      label: "body",
      qty: 5,
    },
    {
      id: 3,
      name: "hayk",
      base_image: {
        small_image_url: "https://papacarlo72.ru/wp-content/uploads/2021/09/PapaCarloLogo.png"
      },
      price: "3500",
      label: "body",
      qty: 5,
    },
  ]

  const products = product.map((elem, index) => {
    return (
      <div
        key={index}
        className="bundle-radio-products"
        onClick={() => changeBackgroundColor(elem.id)}
      >
        <span className="input-radio__body h25 bundle-input-fm">
          <input
            type="radio"
            className="input-radio__input"
            name="checkout_billing_method"
            id={`${elem.name}` + "radio"}
            onClick={() => {
              props.handleTakeProd(elem, props.praduct.type);
            }}
          />

          <span className="input-radio__circle bundles-radio__circle mr-2" />
        </span>
        <div className="">
          <label
            className="bundle-product-image-fm"
            htmlFor={`${elem.name}` + "radio"}
          >
            <Image
              className="product-image__img product-small-img"
              src={elem.base_image.small_image_url}
              width={50}
              height={50}
            />
          </label>
        </div>
        <label
          className="bundle-product-name-fm"
          htmlFor={`${elem.name}` + "radio"}
        >
          <div>{elem.name}</div>
        </label>

        <div className="bundle-product-price-fm">
          {elem.price}
        </div>
        <div className="product__actions-item product-inner-quantity bundle-quantity-fm">
          <InputNumber
            id="product-quantity"
            aria-label="Quantity"
            className="product__quantity-bundle-fm"
            size="lg"
            min={1}
            max={elem.qty}
            // value={
            //   props.selectedBundleProducts[props.praduct.type]?.find(
            //     (e) => e.id == elem.id
            //   )?.quantity || 1
            // }
            value={props.quantity}
            changeQuantity={(PlusOrMinus) => {
              if (props.selectedBundleProducts[props.praduct.type]) {
                const qt = props.selectedBundleProducts[props.praduct.type][0].quantity;

                if (
                  PlusOrMinus == 'plus' && qt < elem.qty ||
                  PlusOrMinus == 'minus' && qt > 1
                ) {
                  props.handleId(elem.id, props.praduct.type, PlusOrMinus);
                }
              }
            }}
            style={
              backgroundColor == elem.id
                ? { backgroundColor: "white" }
                : { backgroundColor: "#f3f3f3" }
            }
          />
        </div>
      </div>
    );
  });

  return (
    <div className="bundle-filters-fm">
      <div className="bundle-border"></div>
      <div className="bundle-radio">
        <div className="bundle-title-fm">
          {/*<h4>{props.praduct.label}</h4>*/}
          <h4>Radio button</h4>
          <span>*</span>
        </div>
        <div className="bundle-radio-body-fm">{products}</div>
      </div>
    </div>
  );
}

// react
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import InputNumber from "components/shared/InputNumber";
import Image from "components/hoc/Image";
// third-party

const product = [
  {
    name: "poxos",
    base_image: {
      small_image_url: "https://4lada.ru/forum/data/avatars/l/0/56.jpg?1491721563"
    },
    price: "1500",
    label: "head"
  },
  {
    name: "petros",
    base_image: {
      small_image_url: "https://papacarlo72.ru/wp-content/uploads/2021/09/PapaCarloLogo.png"
    },
    price: "2500",
    label: "body"
  },
  {
    name: "hayk",
    base_image: {
      small_image_url: "https://papacarlo72.ru/wp-content/uploads/2021/09/PapaCarloLogo.png"
    },
    price: "3500",
    label: "body"
  },
  {
    name: "test",
    base_image: {
      small_image_url: "https://papacarlo72.ru/wp-content/uploads/2021/09/PapaCarloLogo.png"
    },
    price: "3500",
    label: "body"
  },
  {
    name: "prod",
    base_image: {
      small_image_url: "https://papacarlo72.ru/wp-content/uploads/2021/09/PapaCarloLogo.png"
    },
    price: "3500",
    label: "body"
  },
  {
    name: "image",
    base_image: {
      small_image_url: "https://papacarlo72.ru/wp-content/uploads/2021/09/PapaCarloLogo.png"
    },
    price: "3500",
    label: "body"
  },
]

export default function BundleMultiselect(props) {
  let [backgroundColor, setBackgroundColor] = useState(null);
  const changeBackgroundColor = (id) => {
    setBackgroundColor(id);
  };
  // const product = props.praduct.products;
  const products = product.map((elem, index) => {
    return (
      <div
        key={index}
        className="bundle-radio-products"
        // style={
        //   backgroundColor == elem.id ? { backgroundColor: "#ffc400" } : null
        // }
      >
        <div className="bundle-input-fm multiselect-style">
          <input
            // id="bundle-product"
            type="checkbox"
            id={`${elem.name}` + "multiselect"}
            name={elem.name}
            className="styled-checkbox"
            onClick={() => {
              props.handleTakeProd(elem, props.praduct.type);
            }}
          />
        </div>

        <label
          htmlFor={`${elem.name}` + "multiselect"}
          onClick={() => changeBackgroundColor(elem.id)}
          className="bundle-product-image-fm"
        >
          <Image
            className="product-image__img product-small-img"
            src={elem.base_image.small_image_url}
            width={50}
            height={50}
          />
        </label>

        <label
          htmlFor={`${elem.name}` + "multiselect"}
          className="bundle-product-name-fm"
          onClick={() => changeBackgroundColor(elem.id)}
        >
          <div> {elem.name}</div>
        </label>
        <div className="bundle-product-price-fm">
          {elem.price}
        </div>
        <div className="bundle-quantity-fm"></div>
      </div>
    );
  });

  return (
    <div className="bundle-filters-fm">
      <div className="bundleborder"></div>
      <div className="bundle-multiselect">
        <div className="bundle-title-fm">
          {/*<h4>{props.praduct.label}</h4>*/}
          <h4>multiselect</h4>
          <span>*</span>
        </div>
        <div className="bundle-multyselect-body-fm">{products}</div>
      </div>
    </div>
  );
}

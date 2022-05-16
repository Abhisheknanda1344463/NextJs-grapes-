// react
import React from "react";
import {FormattedMessage} from "react-intl";
import Image from "components/hoc/Image";

// third-party
//only for testing
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
]

export default function BundleCheckbox(props) {
  // const product = props.praduct.products;
  const prodType = "checkbox"
  const products = product.map((elem, index) => {
    return (
      <div className="bundle-radio-products" key={index}>
        <div className="bundle-input-fm checkbox-style">
          <input
            // id="bundle-product"
            type="checkbox"
            id={`${elem.name}` + "checkbox"}
            name={elem.name}
            className="styled-checkbox"
            onClick={() => {
              // alert(JSON.stringify(elem))
              // props.handleTakeProd(elem, props.praduct.type);
              props.handleTakeProd(elem, prodType);
            }}
          />
        </div>

        <label
          htmlFor={`${elem.name}` + "checkbox"}
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
          htmlFor={`${elem.name}` + "checkbox"}
          className="bundle-product-name-fm"
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
      <div className="bundle-border"></div>
      <div className="bundle-chekbox">
        <div className="bundle-title-fm">
          {/*<h4>{props.praduct.label}</h4>*/}
          <h4>checkbox</h4>
          <span>*</span>
        </div>
        <div className="bundle-chekbox-body-fm">{products}</div>
      </div>
    </div>
  );
}

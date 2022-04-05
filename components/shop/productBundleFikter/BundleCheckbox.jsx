// react
import React from "react";
import { FormattedMessage } from "react-intl";
import Image from "components/hoc/Image";

// third-party

export default function BundleCheckbox(props) {
  const product = props.praduct.products;
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
              props.handleTakeProd(elem, props.praduct.type);
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
          {elem.price.final_price.formated_price}
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
          <h4>{props.praduct.label}</h4>
          <span>*</span>
        </div>
        <div className="bundle-chekbox-body-fm">{products}</div>
      </div>
    </div>
  );
}

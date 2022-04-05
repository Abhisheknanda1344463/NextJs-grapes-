// react
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import InputNumber from "components/shared/InputNumber";
import Image from "components/hoc/Image";
// third-party

export default function BundleMultiselect(props) {
  let [backgroundColor, setBackgroundColor] = useState(null);
  const changeBackgroundColor = (id) => {
    setBackgroundColor(id);
  };
  const product = props.praduct.products;
  const products = product.map((elem, index) => {
    return (
      <div
        key={index}
        className="bundle-radio-products"
        style={
          backgroundColor == elem.id ? { backgroundColor: "#ffc400" } : null
        }
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
          {elem.price.final_price.formated_price}
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
          <h4>{props.praduct.label}</h4>
          <span>*</span>
        </div>
        <div className="bundle-multyselect-body-fm">{products}</div>
      </div>
    </div>
  );
}

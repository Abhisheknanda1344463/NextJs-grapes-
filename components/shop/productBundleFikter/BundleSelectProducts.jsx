// react
import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "components/hoc/Image";
import { FormattedMessage } from "react-intl";
import InputNumber from "components/shared/InputNumber";
import { ArrowDown } from "../../../svg";

export default function BundleSelectProducts(props) {
  const product = props.products;
  const products = product.map((elem, index) => {
    return (
      <div
        key={index}
        className="bundle-radio-products select-products"
        onClick={() => {
          props.handleTakeProd(elem, props.praduct.type);
          props.setSelectProduct(elem);
          props.isOpen(false);
        }}
      >
        <div className="bundle-product-imag-fm">
          <Image
            className="product-image__img product-small-img"
            src={elem.base_image.small_image_url}
            width={50}
            height={50}
          />
        </div>
        <div className="bundle-product-nam-fm"> {elem.name}</div>
        <div className="bundle-product-pric-fm">
          {elem.price.final_price.formated_price}
        </div>
      </div>
    );
  });

  return <div className="bundle-select"> {products}</div>;
}

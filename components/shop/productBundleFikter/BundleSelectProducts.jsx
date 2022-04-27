// react
import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "components/hoc/Image";
import { FormattedMessage } from "react-intl";
import InputNumber from "components/shared/InputNumber";
import { ArrowDown } from "../../../svg";

const product = [
  {
    name: "poxos",
    base_image: {
      small_image_url: "https://4lada.ru/forum/data/avatars/l/0/56.jpg?1491721563"
    },
    price: {
      final_price: {
        formated_price: "1500"
      }
    },
    label: "head"
  },
  {
    name: "petros",
    base_image: {
      small_image_url: "https://papacarlo72.ru/wp-content/uploads/2021/09/PapaCarloLogo.png"
    },
    price: {
      final_price: {
        formated_price: "3500"
      }
    },
    label: "body"
  },
  {
    name: "hayk",
    base_image: {
      small_image_url: "https://papacarlo72.ru/wp-content/uploads/2021/09/PapaCarloLogo.png"
    },
    price: {
      final_price: {
        formated_price: "3500"
      }
    },
    label: "body"
  },
]

export default function BundleSelectProducts(props) {
  // const product = props.products;
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

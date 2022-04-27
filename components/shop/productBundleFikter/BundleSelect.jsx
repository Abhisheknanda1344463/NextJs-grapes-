// react
import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "components/hoc/Image";
import { FormattedMessage } from "react-intl";
import InputNumber from "components/shared/InputNumber";
import { ArrowDown } from "../../../svg";
import BundleSelectProducts from "./BundleSelectProducts";

// third-party

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

export default function BundleSelect(props) {
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectProduct, setSelectProduct] = useState({});

  // const product = props.praduct.products;
  let handleChangeQuantity = (quantity) => {
    setQuantity(quantity++);
  };

  return (
    <div className="bundle-filters-fm bundle-select">
      <div className="bundle-border"></div>
      <div className="">
        <div className="bundle-title-fm">
          {/*<h4>{props.praduct.label}</h4>*/}
          <h4>BundleSelect</h4>
          <span>*</span>
        </div>
        <div className="bundle-select-products bundle-radio-products">
          <div className="bundle-select-list">
            <div
              className="bundle-select-title-fm"
              onClick={(e) => {
                setIsOpen(!isOpen);
              }}
            >
              <label
                // htmlFor={props.praduct.products.name}
                htmlFor={product[0].name}
                className="bundle-select-name-fm"
              >
                <div>
                  {" "}
                  {selectProduct.name ? selectProduct.name : product[0].name}
                </div>
              </label>
              <div className="bundle-select-price-fm">
                {selectProduct.price?.final_price?.formated_price
                  ? selectProduct.price?.final_price?.formated_price
                  : product[0].price?.final_price?.formated_price}
              </div>
              <ArrowDown className={isOpen ? "d-block rott_fms" : "d-block"} />
            </div>
            <div
              className={
                isOpen
                  ? "dropdown-group active filter-list__list"
                  : "dropdown-group"
              }
            >
              {/*<BundleSelectProducts*/}
              {/*  products={props.praduct.products}*/}
              {/*  setSelectProduct={setSelectProduct}*/}
              {/*  isOpen={setIsOpen}*/}
              {/*  {...props}*/}
              {/*/>*/}
              <BundleSelectProducts
                products={product}
                setSelectProduct={setSelectProduct}
                isOpen={setIsOpen}
                {...props}
              />
            </div>
          </div>
          <div className="product__actions-item product-inner-quantity bundle-quantity-fm">
            <InputNumber
              id="product-quantity"
              aria-label="Quantity"
              className="product__quantity-bundle-fm"
              size="lg"
              min={1}
              // max={elem.qty}
              value={quantity}
              onChange={handleChangeQuantity}
            // disabled={Addtocartdisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

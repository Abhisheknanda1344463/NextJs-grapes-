// react
import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "components/hoc/Image";
import { FormattedMessage } from "react-intl";
import InputNumber from "components/shared/InputNumber";
import { ArrowDown } from "../../../svg";
import BundleSelectProducts from "./BundleSelectProducts";

// third-party

export default function BundleSelect(props) {
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectProduct, setSelectProduct] = useState({});

  const product = props.praduct.products;
  let handleChangeQuantity = (quantity) => {
    setQuantity(quantity++);
  };

  return (
    <div className="bundle-filters-fm bundle-select">
      <div className="bundle-border"></div>
      <div className="">
        <div className="bundle-title-fm">
          <h4>{props.praduct.label}</h4>
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
                htmlFor={props.praduct.products.name}
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
              <BundleSelectProducts
                products={props.praduct.products}
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

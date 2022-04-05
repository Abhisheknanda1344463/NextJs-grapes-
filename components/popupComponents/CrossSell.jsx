// react
import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { CrosselSvg } from "svg";
import CrosselCard from "components/shared/CrosselCard";

function CrossSell(props) {
  let rr = {
    Memory: null,
    Memory_label: null,
    RAM: null,
    RAM_label: null,
    brand: "11",
    brand_label: "Iphone",
    channel: "default",
    color: 1,
    color_label: "Red",
    cost: null,
    created_at: "2021-06-17 22:50:18",
    depth: "0.0000",
    description:
      "<ul>\r\n<li>8MP primary camera and 5MP front facing camera</li>\r\n<li>25.54 centimeters (10-inch) with 1920 x 1200 pixels resolution</li>\r\n<li>Android v9.0 operating system with 1.8GHz+1.6GHz Exynos 7904 octa core processor, 2GB RAM, 32GB internal memory expandable up to 512GB, Single SIM</li>\r\n<li>6000mAH lithium-ion battery</li>\r\n<li>1 year manufacturer warranty for device and 6 months manufacturer warranty for in-box accessories including batteries from the date of purchase</li>\r\n<li>Country of Origin: Vietnam</li>\r\n</ul>",
    featured: 0,
    formatted_price: "$430.00",
    formatted_special_price: "$0.00",
    height: "0.0000",
    id: 50,
    images: [
      "demo-zega-black/product/50/CxWh8Tds1Ub30bXsrr4FyI0l486NxZTgoGaAhvKS.png",
    ],
    locale: "en",
    max_price: "430.0000",
    meta_description: "",
    meta_keywords: "",
    meta_title: "",
    min_price: "430.0000",
    name: "Galaxy Tab A10.1 LTE",
    new: 1,
    parent_id: null,
    price: "430.0000",
    price_html: "$430.00",

    product_id: 50,
    product_number: "3",
    short_description:
      "<p>Full HD Corner-to-Corner Display, 32GB 4G LTE Tablet &amp; Phone (Makes Calls) GSM Unlocked SM-T515, International Model (32 GB, Black)</p>",
    size: null,
    size_label: null,
    sku: "003",
    special_price: null,
    special_price_from: null,
    special_price_to: null,
    status: 1,
    thumbnail: null,
    updated_at: "2021-06-17 22:50:18",
    url_key: "galaxy-tab-a101-lte",
    visible_individually: 1,
    weight: "0.0000",
    width: "0.0000",
  };
  return (
    <div className="crossel-content">
      <div className="crossel-title">
        <div>
          <CrosselSvg />
          <span>
            <FormattedMessage
              id="crosselTitle"
              defaultMessage="Your product has been successfully replaced"
            />
          </span>
        </div>
      </div>

      <CrosselCard product={rr} />
      <span className="no-thanks">
        <FormattedMessage id="noThanks" defaultMessage="No, Thanks" />
      </span>
    </div>
  );
}

export default CrossSell;

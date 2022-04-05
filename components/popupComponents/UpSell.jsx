// react
import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import ProductCard from "components/shared/ProductCard";
import CrosselCard from "components/shared/CrosselCard";

function UpSell(props) {
  return (
    <div className="upsell-content">
      <h3 className="uPsell-title">
        <FormattedMessage
          id="upSell-title"
          defaultMessage="You are $19.99 away from this item"
        />
      </h3>

      {/* <ProductCard product={rr} /> */}

      <div className="no-thanks">
        <FormattedMessage id="noThanks" defaultMessage="No, Thanks" />
      </div>
    </div>
  );
}

export default UpSell;

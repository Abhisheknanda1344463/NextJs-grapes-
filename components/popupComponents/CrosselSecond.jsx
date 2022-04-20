 // react
import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

function CrosselSecond(props) {
  return (
    <div className="upsell-content">
      <h3 className="uPsell-title crossel-second">
        <FormattedMessage
          id="also-buy"
          defaultMessage="People also buy these products"
        />
      </h3>

      <div className="prod"></div>
      <div className="no-thanks">
        <FormattedMessage id="noThanks" defaultMessage="No, Thanks" />
      </div>
    </div>
  );
}

export default CrosselSecond;

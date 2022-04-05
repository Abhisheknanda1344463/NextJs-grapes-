// react
import React from "react";

// third-party
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

// application
import {
  Fi24Hours48Svg,
  FiFreeDelivery48Svg,
  FiPaymentSecurity48Svg,
} from "../../svg";

function BlockFeatures(props) {
  const { layout } = props;

  return (
    <div
      className={`block block-features block-features--layout--${layout} d-flex justify-content-center`}
    >
      <div className="block-features__list">
        <div className="block-features__item">
          <div className="block-features__icon">
            <FiFreeDelivery48Svg />
          </div>
          <div className="block-features__content">
            <div className="block-features__title">
              <FormattedMessage id="delivery" defaultMessage="Delivery" />
            </div>
            <div className="block-features__subtitle">
              <FormattedMessage id="inArmenian" defaultMessage="" />
            </div>
          </div>
        </div>
        <div className="block-features__item">
          <div className="block-features__icon">
            <Fi24Hours48Svg />
          </div>
          <div className="block-features__content">
            <div className="block-features__title">
              <FormattedMessage
                id="payment.method"
                defaultMessage="Payment method"
              />
            </div>
            <div className="block-features__subtitle">
              <FormattedMessage
                id="payMethods"
                defaultMessage="Cash, American Express,ARCA, VISA, MasterCard"
              />
            </div>
          </div>
        </div>
        <div className="block-features__item">
          <div className="block-features__icon">
            <FiPaymentSecurity48Svg />
          </div>
          <div className="block-features__content">
            <div className="block-features__title">
              <FormattedMessage id="payment" defaultMessage="Payment" />
            </div>
            <div className="block-features__subtitle">
              <FormattedMessage
                id="serviceTime"
                defaultMessage="Online service"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

BlockFeatures.propTypes = {
  layout: PropTypes.oneOf(["classic", "boxed"]),
};

BlockFeatures.defaultProps = {
  layout: "classic",
};

export default React.memo(BlockFeatures);

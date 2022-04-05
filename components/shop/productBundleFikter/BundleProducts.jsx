// react
import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import BundleCheckbox from "./BundleCheckbox";
import BundleMultiselect from "./BundleMultiselect";
import BundleRadio from "./BundleRadio";
import BundleSelect from "./BundleSelect";

// third-party

export default function BundleProducts(props) {
  let bundls = props.options.map((elements, index) => {
    if (elements !== undefined && elements.type == "radio") {
      return <BundleRadio key={index} praduct={elements} {...props} />;
    } else if (elements !== undefined && elements.type == "multiselect") {
      return <BundleMultiselect key={index} praduct={elements} {...props} />;
    } else if (elements !== undefined && elements.type == "select") {
      return <BundleSelect key={index} praduct={elements} {...props} />;
    } else if (elements !== undefined && elements.type == "checkbox") {
      return <BundleCheckbox key={index} praduct={elements} {...props} />;
    } else {
      return null;
    }
  });

  return (
    <div className="bundle-main-container">
      <div className="bundle-title-fms">
        <FormattedMessage
          id="bundle.discount"
          defaultMessage="Buy his bundle and get the discount. Hurry up !"
        />
      </div>
      <div className="bundls-fm">{bundls}</div>
    </div>
  );
}

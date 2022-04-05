import React from "react";
import { FormattedMessage } from "react-intl";

function BlockHeaderCustom(props) {
  const name = props.title.props.defaultMessage;
  const id = props.title.props.id;

  return (
    <div className="block-header">
      <h2 className="block-header__title__custom">
        <span className="title-line-fms"></span>
        <span className="title-name-fms">
          {" "}
          <FormattedMessage id={id} defaultMessage={name} />
        </span>
        <span className="title-line-fms"></span>
      </h2>
    </div>
  );
}

export default BlockHeaderCustom;

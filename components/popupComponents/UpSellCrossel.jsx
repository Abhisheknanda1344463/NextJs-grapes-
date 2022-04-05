// react
import React from "react";
import { setPopup, setPopupName } from "../../store/general";
import { connect } from "react-redux";
import UpSell from "./UpSell";
import CrossSell from "./CrossSell";
import CrosselSecond from "./CrosselSecond";
import PasswordChangePoup from "components/account/PasswordChangePoup";

import IndicatoDropDownBody from "components/header/IndicatoDropDownBody";

function UpSellCrossel(props) {
  const { setPopup, popUpName, product, customer } = props;

  if (!popUpName) {
    return null;
  }

  let content;

  if (popUpName == "register") {
    content = <IndicatoDropDownBody />;
  } else if (popUpName == "passwordChange") {
    content = <PasswordChangePoup />;
  }

  return (
    <div
      className={props.active ? "modalss active" : "modalss"}
      onClick={() => setPopup(false)}
    >
      <div
        className={
          props.active ? `modal-content active ${popUpName}` : "modal-content"
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* <CrosselSecond /> */}
        {/* <CrossSell /> */}
        {content}
        {/*<UpSell product={product} customer={customer} />*/}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  popUpName: state.general.popUpName,
});
const mapDispatchToProps = {
  setPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpSellCrossel);

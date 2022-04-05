// react
import React from "react";
import Dropdown from "./Dropdown";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { changeCurrency } from "../../store/currency";

function DropdownCurrency(props) {

  const {
    // locale: code,
    current,
    currency,
    changeCurrency,
    currencies,
  } = props;

  if (!props.currency || currencies.length < 2) {
    return null;
  }

  const title = (
    <React.Fragment>
      <span>
        <FormattedMessage id="Topbar.currency" defaultMessage="Currency" />
      </span>
    </React.Fragment>
  );

  const currencyList = currencies.filter((e) => {
    return e.code == currency.code;
  });

  const currencyL = currencies.filter((e) => {
    return currencyList[0]?.code === e.code ? null : e;
  });

  return (
    <Dropdown
      for={"currency"}
      title={currencyList}
      current={current}
      items={currencyL}
      onClick={(item) => changeCurrency(item.id)}
    />
  );
}

const mapStateToProps = ({ currency: { current, list } }) => {
  return {
    current: current,
    currency: current,
    currencies: list,
  };
};

const mapDispatchToProps = {
  changeCurrency,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropdownCurrency);

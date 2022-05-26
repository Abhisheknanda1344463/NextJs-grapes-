// react
import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { connect, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { changeRate, getExchangeRate } from "../../store/rate";
import { getExchange } from "../../store/selector";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
function DropdownCurrency(props) {
  const [currentCurrency, setCurrentCurrency] = useState("USD");
  const { current, currency, changeRate, currencies } = props;
  const dispatch = useDispatch();
  /// var nreData = useSelector(getExchange);
  if (currencies.length < 2) {
    return null;
  }

  const nreData = true;
  // if (nreData) {
  //   dispatch(getExchangeRate(currencies));
  // }
  // useEffect(() => {
  //   /// const nreData = useSelector(getExchange);
  //   return () => {};
  // }, []);
  const router = useRouter();

  const handleRoute = (currencies) => {
    setCurrentCurrency(currencies);
    changeRate(currencies);
    /// dispatch(getExchangeRate(currencies));

    console.log(nreData);
    let checkUrl = window.location.href.indexOf("?");
    if (checkUrl > 0 && nreData) {
      router.query.currencies = currencies;
      router.push(router);
    } else if (!nreData) {
      window.history.replaceState(null, "", window.location.href);
    } else {
      window.history.replaceState(
        null,
        "",
        window.location.href + "?currencies=" + currencies
      );
    }
  };
  const title = (
    <React.Fragment>
      <span>
        <FormattedMessage id="Topbar.currency" defaultMessage="Currency" />
      </span>
    </React.Fragment>
  );

  const currencyList = currencies.filter((e) => {
    return e.code == currency?.code;
  });

  const currencyL = currencies.filter((e) => {
    return currencyList[0]?.code === e.code ? null : e;
  });

  return (
    <Dropdown
      for={"currency"}
      title={currencyList}
      current={currentCurrency}
      items={currencyL}
      onClick={(item) => handleRoute(item.code)}
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
  changeRate,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropdownCurrency);

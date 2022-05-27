// react
import React, { useState } from "react";
import Dropdown from "./Dropdown";
import { connect, useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { changeRate, getExchangeRate } from "../../store/rate";
import { useRouter } from "next/router";
function DropdownCurrency(props) {
  const router = useRouter();
  const rateList = useSelector(state => state.rate.list)
  const defaultCurrencyValue = useSelector(state => state.rate.defaultCurrency)
  const { currency, changeRate, currencies } = props;
  const dispatch = useDispatch();

  const [currentCurrency, setCurrentCurrency] = useState(router.query.currencies || defaultCurrencyValue);

  if (currencies.length < 2) {
    return null;
  }

  const nreData = true;
  const handleRoute = (currencies) => {
    setCurrentCurrency(currencies);
    dispatch(changeRate(currencies));
    rateList.forEach((item) => {
      if (item.code === currencies) {
        dispatch(getExchangeRate(item))
      }
    })
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
      current={currentCurrency || defaultCurrencyValue}
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

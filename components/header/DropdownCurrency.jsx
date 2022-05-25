// react
import React, {useEffect, useState} from "react";
import Dropdown from "./Dropdown";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {changeCurrency} from "../../store/currency";
import {changeRate} from "../../store/rate";
import {useRouter} from "next/router";

function DropdownCurrency(props) {
  const [currentCurrency, setCurrentCurrency] = useState("USD")
  // console.log(props, "props in dropdow currency")
  const {
    // locale: code,
    current,
    currency,
    // changeCurrency,
    changeRate,
    currencies,
  } = props;

  if (currencies.length < 2) {
    return null;
  }
  const router = useRouter();

  const {currencies: currenciesRouter} = router.query;
  const handleRoute = (currencies) => {
    setCurrentCurrency(currencies);
    ///  changeLocale(locale);
    // changeCurrency(currencies);
    changeRate(currencies);
    // console.log(currencies, "currencies++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    let checkUrl = window.location.href.indexOf("?");
    if (checkUrl > 0) {
      router.query.currencies = currencies;
      router.push(router);
    } else {
      window.history.replaceState(
        null,
        "",
        window.location.href + "?currencies=" + currencies
      );
    }

    // router.push(
    //   router.asPath != "/" ? router.asPath : "",
    //   router.asPath != "/" ? router.asPath : "",
    //   {
    //     currencies: currencies,
    //   }
    // );
  };
  const title = (
    <React.Fragment>
      <span>
        <FormattedMessage id="Topbar.currency" defaultMessage="Currency"/>
      </span>
    </React.Fragment>
  );

  const currencyList = currencies.filter((e) => {
    return e.code == currency?.code;
  });

  const currencyL = currencies.filter((e) => {
    return currencyList[0]?.code === e.code ? null : e;
  });

  // console.log(currencyL, "currency _____ ");
  // console.log(current, "currentcurrentcurrent _____ ");
  // console.log(item.code, "item.code _____ ");

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

const mapStateToProps = ({currency: {current, list}}) => {
  return {
    current: current,
    currency: current,
    currencies: list,
  };
};

const mapDispatchToProps = {
  // changeCurrency,
  changeRate,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropdownCurrency);

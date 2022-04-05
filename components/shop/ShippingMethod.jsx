// react
import React, { useCallback, useState, useEffect } from "react";
import { url, apiUrlWithStore } from "../../helper";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

function ShippingMethod({
  setShipingMethod,
  shippingMethod,
  locale,
  updateShippingValue,
  country,
}) {
  const [ShippingMethods, setShippingMethods] = useState(false);
  const [onexCountry, setOnexCountry] = useState(false);
  const [onexName, setOnexName] = useState();
  const token = useSelector((state) => state.customer.token);

  useEffect(() => {
    fetch(apiUrlWithStore(`/api/shipping?locale=${locale}`))
      .then((responce) => responce.json())
      .then((res) => {
        updateShippingValue(res[0].code, res[0].default_rate);
        setShippingMethods(res);
      })
      .catch((err) => console.error(err));
  }, []);

  // url + `/api/shipping?token=${token}&country=${country}`

  useEffect(() => {
    // if(country == "Russia" || country == "United States" || country == "Belarus" || country == "Kazakhstan" || country == "Kyrgyzstan"){
    //     setOnexCountry(true)
    // }
    if (country == "Russia") {
      setOnexCountry(true);
      setOnexName("Russia");
    } else if (country == "United States") {
      setOnexCountry(true);
      setOnexName("US");
    } else if (
      country == "Belarus" ||
      country == "Kazakhstan" ||
      country == "Kyrgyzstan"
    ) {
      setOnexCountry(true);
      setOnexName("other");
    } else {
      setOnexCountry(false);
      setOnexName("");
    }
  }, [country]);

  function palit() {
    fetch(apiUrlWithStore(`/api/shipping?token=${token}&country=${onexName}`))
      .then((res) => res.json())
      .then((res) => updateShippingValue(res[2].code, res[2].default_rate));
  }

  let content = "";
  if (ShippingMethods) {
    content = ShippingMethods.map(function (ShippingMethods, i) {
      if (ShippingMethods.active) {
        if (ShippingMethods.method === "onex") {
          return (
            <div>
              <span
                style={{ opacity: !onexCountry ? "0.5" : "1" }}
                className="input-radio__body my-2 h25"
              >
                <input
                  type="radio"
                  className="input-radio__input"
                  id={ShippingMethods.title}
                  disabled={!onexCountry}
                  value={ShippingMethods.code}
                  defaultChecked={i == 0 ? true : false}
                  name="shippingmethods"
                  data-default_rate={ShippingMethods.default_rate}
                  onChange={(e) => setShipingMethod(e.target)}
                  onClick={() => palit()}
                />
                <span className="input-radio__circle mr-3" />

                <label
                  className="shipping-methods__item-title shipping-methods__item-title-fms s"
                  htmlFor={ShippingMethods.title}
                >
                  <FormattedMessage
                    id={ShippingMethods.title}
                    defaultMessage={ShippingMethods.title}
                  />
                </label>
              </span>
            </div>
          );
        }
        return (
          <div>
            <span className="input-radio__body my-2 h25 chakout-radio-titles">
              <input
                type="radio"
                className="input-radio__input"
                id={ShippingMethods.title}
                value={ShippingMethods.code}
                defaultChecked={i == 0 ? true : false}
                name="shippingmethods"
                data-default_rate={ShippingMethods.default_rate}
                onChange={(e) => setShipingMethod(e.target)}
                checked={shippingMethod == ShippingMethods.code ? true : false}
              />
              <span className="input-radio__circle mr-2 " />
              <label
                className="shipping-methods__item-title shipping-methods__item-title-fms s"
                htmlFor={ShippingMethods.title}
              >
                <FormattedMessage
                  id={ShippingMethods.title.toLowerCase().replace(/ /g, ".")}
                  defaultMessage={ShippingMethods.title}
                />
              </label>
            </span>
          </div>
        );
      }
    });
  }

  return (
    <div className="shipping-methods-content">
      <h3 className="checkout-card-title-fms card-title-met-fms">
        <FormattedMessage
          id="shipping.mthods"
          defaultMessage="Shipping Methods"
        />
      </h3>
      <div className="shipping-methods">{content}</div>
    </div>
  );
}

export default ShippingMethod;

import React, { useEffect, useState, memo } from "react";
import { FormattedMessage } from "react-intl";
import { url, apiUrlWithStore } from "../../helper";
import TextField from "@mui/material/TextField";
function ShippingAddress({ passOption, handleInputChange, state }) {
  const [countryList, setCountryList] = useState();
  const [countryStates, setCountryStates] = useState();
  const [newAddress, setNewAddress] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(true);
  const [newAddressInputs, setNewAddressInputs] = useState("none");
  const [input, setInput] = useState({});

  function addNew() {
    setDefaultAddress(false);
    setNewAddress(true);
    setNewAddressInputs("block");
    passOption({});
  }

  function setDefault(id) {
    const selectedAddress = state.pastOrders.filter((e) => e.id === id)[0];

    if (selectedAddress) {
      passOption(selectedAddress);
    }
    setDefaultAddress(true);
    setNewAddress(false);
    setNewAddressInputs("none");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleInputChange({ name, value });

    // setInput({
    //   ...input,
    //   [e.target.name]: e.target.value,
    // });
  };

  const setFree = () => {
    handleInputChange({ name: "shippingMethod", value: "free_free" });
  };

  useEffect(() => {
    fetch(apiUrlWithStore(`/api/country-states?pagination=0`))
      .then((res) => res.json())
      .then((res) => setCountryStates(res));
  }, []);




  console.log(countryList, ';countryListcountryListcountryList');
  useEffect(() => {

    fetch(apiUrlWithStore(`/api/countries?pagination=0`))
      .then((res) => res.json())
      .then((res) => setCountryList(res.data.reverse()));
  }, []);

  let selectCountry;
  let selectState;
  let countryCode;

  if (countryList) {
    selectCountry = (
      <div className="select-container">
        <select
          className={`checkout-select checkout-input custom-select-mark ${state.country.name ? "dark-opacity" : ""
            }`}
          name="country"
          onChange={(e) => {
            handleChange(e);

            // check why it is working
            // setFree()
          }}
          value={state.country.name}
        >
          <FormattedMessage id="select.country" defaultMessage="Select Country">
            {(placeholder) => (
              <option selected="true" disabled="disabled">
                {placeholder}
              </option>
            )}
          </FormattedMessage>
          {countryList.map((option, index) => {
            return (
              <option key={index} e={option.name} >
                {option.name}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
  // shippingMethod
  if (countryList && state.country.code) {
    for (let i = 0; i <= countryList.length; i++) {
      if (countryList[i] && countryList[i].name == state.country.name) {
        countryCode = countryList[i].code;
      }
    }
  }

  if (
    countryCode &&
    countryStates &&
    countryStates.data &&
    countryStates.data[countryCode]
  ) {
    selectState = (
      <div className="form-group checkout-style col-12 col-md-6 pl-2">
        <div className="select-container">
          <select
            name="states"
            onChange={handleChange}
            className={`checkout-select checkout-input custom-select-mark ${state.country.name ? "dark-opacity" : ""
              }`}
          >
            <option selected="true" disabled="disabled">
              Select State
            </option>
            {countryStates.data[countryCode].map((option, index) => (
              <option key={index} value={option.default_name}>
                {option.default_name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  } else {
    selectState = "";
  }

  let pastAddresses = state.pastOrders.map((address, index) => {
    const description = `${address.city} ${address.address1} ${address.postcode} ${address.first_name} ${address.last_name}`;
    return (
      <div
        key={address.id}
        className="input-radio__body my-2 custom-address-min-height"
      >
        <input
          type="radio"
          id={address.id}
          className="input-radio__input"
          name="addressOption"
          defaultChecked={index == 0 ? true : false}
          onClick={() => {
            setDefault(address.id);
            handleInputChange({ name: "country", value: address.country });
          }}
        />
        <span className="input-radio__circle mr-2" />
        <label
          htmlFor={address.id}
          className="shipping-methods__item-title-fms"
        >
          {description}
        </label>
      </div>
    );
  });

  // custom-style-for-long-adresses

  return (
    <div className="mx-4 mt-4">
      {state.customer.authenticated &&
        state.pastOrders &&
        state.pastOrders.length > 0 ? (
        <>
          <div className="checkout-card-title-fms ">
            <FormattedMessage
              id="shipping-address"
              defaultMessage="Shipping address"
            />
          </div>

          {pastAddresses}

          <span className="input-radio__body my-2">
            <input
              type="radio"
              id="checkout-add-new"
              className="input-radio__input"
              // name="checkout_shipping_method"
              name="addressOption"
              // value="default address"
              checked={newAddress}
              onChange={addNew}
            />

            <span className="input-radio__circle mr-2" />
            <span className="payment-methods__item-title">
              <label
                className="payment-methods__item-title payment-methods__item-title-fms shipping-methods__item-title-fms"
                htmlFor="checkout-add-new"
              >
                <FormattedMessage
                  id="addNewAdress"
                  defaultMessage="Add new addsress "
                />
              </label>
            </span>
          </span>
        </>
      ) : (
        <div className="checkout-card-title-fms shipping-address">
          <FormattedMessage
            id="shipping-address"
            defaultMessage="Shipping address"
          />
        </div>
      )}
      <div
        className="row"
        style={{
          display:
            state.customer.authenticated &&
              state.pastOrders &&
              state.pastOrders.length > 0
              ? newAddressInputs
              : "block",
        }}
      >

        <div className="mobile-checkout-style">
          <form className="d-flex flex-wrap">
            <div className="form-group checkout-style col-12 col-md-6 my-2 my-md-4 c-pr-2">
              <TextField
                id="outlined-fullName-input"
                label={
                  <FormattedMessage
                    id="Checkout.name"
                    defaultMessage="First name"
                  />
                }
                type="text"
                autoComplete="current-first_name"
                onChange={handleChange}
                name="fullName"
              />

              {state.errors.fullName.length > 0 && (
                <span className="alert-danger">
                  {" "}
                  <FormattedMessage
                    id="name.error"
                    defaultMessage="Name field is required"
                  />
                </span>
              )}
            </div>
            <div className="form-group checkout-style col-12 col-md-6 my-2 my-md-4 c-pl-2">
              <TextField
                id="outlined-lname-input"
                label={
                  <FormattedMessage
                    id="Checkout.lname"
                    defaultMessage="Last name"
                  />
                }
                type="text"
                autoComplete="current-lname"
                onChange={handleChange}
                name="lname"
              />
              {state.errors.lname.length > 0 && (
                <span className="alert-danger">
                  {" "}
                  <FormattedMessage
                    id="errors.lname"
                    defaultMessage="Surname field is required"
                  />
                </span>
              )}
            </div>
            <div className="form-group checkout-style col-12 col-md-12 outlined-street-input">
              <TextField
                id="outlined-street-input"
                label={
                  <FormattedMessage
                    id="account.address"
                    defaultMessage="Address"
                  />
                }
                type="text"
                autoComplete="current-street"
                onChange={handleChange}
                name="street"
              />

              {state.errors.street.length > 0 && (
                <span className="alert-danger">
                  <FormattedMessage
                    id="address.error"
                    defaultMessage="Address field is required"
                  />
                </span>
              )}
            </div>
            <div className="form-group checkout-style col-12 col-md-6 c-pr-2">
              <TextField
                id="outlined-apartment-input"
                label={
                  <FormattedMessage
                    id="account.apartment"
                    defaultMessage="Apartment, suite"
                  />
                }
                type="text"
                autoComplete="current-apartment"
                onChange={handleChange}
                name="apartment"
              />

              {state.errors.apartment.length > 0 && (
                <span className="alert-danger">
                  {" "}
                  <FormattedMessage
                    id="errors.apartment"
                    defaultMessage="Apartment field is required"
                  />
                </span>
              )}
            </div>
            <div className="form-group checkout-style col-12 col-md-6 c-pl-2">
              <TextField
                id="outlined-city-input"
                label={<FormattedMessage id="city" defaultMessage="City" />}
                type="text"
                autoComplete="current-city"
                onChange={handleChange}
                name="city"
              />

              {state.errors.city.length > 0 && (
                <span className="alert-danger">
                  {" "}
                  <FormattedMessage
                    id="errors.city"
                    defaultMessage="City field is required"
                  />
                </span>
              )}
            </div>
            <div className="form-group checkout-style col-12 col-md-6 c-pr-2">
              {selectCountry}
              {state.errors.country.length > 0 && (
                <span className="alert-danger">
                  {" "}
                  <FormattedMessage
                    id="errors.country"
                    defaultMessage="Country field is required"
                  />
                </span>
              )}
            </div>
            {selectState}
            <div
              className={`form-group checkout-style col-12 col-md-6 ${selectState == "" ? "c-pl-2" : "c-pr-2"
                }`}
            >
              <TextField
                id="outlined-postal-input"
                label={
                  <FormattedMessage
                    id="account.postal"
                    defaultMessage="Postal code"
                  />
                }
                type="text"
                autoComplete="current-postal"
                onChange={handleChange}
                name="postal"
              />
              {state.errors.postal.length > 0 && (
                <span className="alert-danger">
                  <FormattedMessage
                    id="postal.error"
                    defaultMessage="Postal code is required"
                  />
                </span>
              )}
            </div>
            <div
              className={`form-group checkout-style col-12 col-md-6 ${selectState == "" ? "c-pr-2" : "c-pl-2"
                }`}
            >
              <TextField
                id="outlined-phone-input"
                label={
                  <FormattedMessage
                    id="checkout.phone"
                    defaultMessage="Phone"
                  />
                }
                type="text"
                autoComplete="current-phone"
                onChange={handleChange}
                name="phone"
              />
              {state.errors.phone.length > 0 && (
                <span className="alert-danger">
                  <FormattedMessage
                    id="phone.error"
                    defaultMessage="Phone field is required"
                  />
                </span>
              )}
            </div>
            {/* selectState */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ShippingAddress;

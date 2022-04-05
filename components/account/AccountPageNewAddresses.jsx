// react
import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { url } from "../../helper";
import { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";

const AccountPageNewAddresses = () => {
  const form = useRef(null);
  const customer = useSelector((state) => state.customer);
  const [errors, setErrors] = useState();
  const [success, setSuccess] = useState(false);
  const [successData, setSuucessData] = useState();
  const [input, setInput] = useState({});
  const [countryList, setCountryList] = useState();
  const history = useRouter();

  useEffect(() => {
    let timer1;
    if (success || errors) {
      timer1 = setTimeout(() => {
        setErrors(false);
        setSuccess(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timer1);
    };
  }, [errors, success]);

  useEffect(() => {
    fetch(`${url}/api/countries?pagination=0`)
      .then((res) => res.json())
      .then((res) => setCountryList(res.data.reverse()));
  }, []);

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  let selectCountry;

  if (countryList) {
    selectCountry = (
      <div className="select-container form-group col-md-6">
        <select
          className={
            input.country_name
              ? "dark-opacity checkout-select checkout-input"
              : "checkout-select checkout-input"
          }
          name="country_name"
          onChange={handleChange}
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
              <option key={index} value={option.name}>
                {option.name}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let option = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: customer.token,
        first_name: input.first_name,
        last_name: input.last_name,
        address1: [input.address1],
        apartment: input.apartment,
        city: input.city,
        country: input.country_name,
        country_name: input.country_name,
        phone: input.phone,
        postcode: input.postcode,
        state: input.state || "no state",
      }),
    };

    fetch(`${url}/api/addresses/create`, option)
      .then((response) => response.json())
      .then((res) => {
        if (res.errors) {
          setErrors(res.errors);
        } else {
          setSuccess(true);
          setSuucessData(res.message);
          setInput({
            first_name: "",
            last_name: "",
            address1: "",
            apartment: "",
            city: "",
            country_name: "",
            postcode: "",
            phone: "",
            state: "",
          });
        }
      });
    // window.scrollTo({top: 0, left: 0, behavior: "smooth"});
    history.push("/account/addresses");
  };

  useEffect(() => {
    fetch(`${url}/api/countries?pagination=0`)
      .then((res) => res.json())
      .then((res) => setCountryList(res.data.reverse()));
  }, []);

  const ErrorsOutput = () => {
    const arr = [];
    for (let error in errors) {
      arr.push(<div>{errors[error]}</div>);
    }
    return arr;
  };

  return (
    <>
      {errors ? <div className="alert alert-danger">{ErrorsOutput()}</div> : ""}
      {success ? <div className="alert alert-success">{successData}</div> : ""}
      <div className="card add-new-address-body">
        <h5 className="address-page-title">
          <FormattedMessage
            id="add-an-address"
            defaultMessage="Add an address"
          />
        </h5>
        <div className="card-divider mb-5" />

        <form ref={form} onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row no-gutters">
              <div className="col-12">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <FormattedMessage id="name" defaultMessage="First name">
                      {(placeholder) => (
                        <input
                          onChange={handleChange}
                          name="first_name"
                          value={input.first_name}
                          defaultValue=""
                          type="text"
                          className={
                            input.first_name
                              ? "dark-opacity form-control checkout-input f15"
                              : "form-control checkout-input f15"
                          }
                          id="checkout-first-name"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className="form-group col-md-6">
                    <FormattedMessage id="lname" defaultMessage="Last name">
                      {(placeholder) => (
                        <input
                          value={input.last_name}
                          defaultValue=""
                          onChange={handleChange}
                          name="last_name"
                          type="text"
                          className={
                            input.last_name
                              ? "dark-opacity form-control checkout-input f15"
                              : "form-control checkout-input f15"
                          }
                          id="checkout-last-name"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </div>

                <div className="form-group">
                  <FormattedMessage id="address" defaultMessage="Address">
                    {(placeholder) => (
                      <input
                        onChange={handleChange}
                        value={input.address1}
                        defaultValue=""
                        name="address1"
                        type="text"
                        className={
                          input.address1
                            ? "dark-opacity form-control checkout-input f15"
                            : "form-control checkout-input f15"
                        }
                        id="checkout-street-address"
                        placeholder={placeholder}
                      />
                    )}
                  </FormattedMessage>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <FormattedMessage
                      id="account.apartment"
                      defaultMessage="Apartment, suite"
                    >
                      {(placeholder) => (
                        <input
                          onChange={handleChange}
                          name="apartment"
                          value={input.apartment}
                          defaultValue=""
                          type="text"
                          className={
                            input.apartment
                              ? "dark-opacity form-control checkout-input f15"
                              : "form-control checkout-input f15"
                          }
                          id="checkout-apartment"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className="form-group col-md-6">
                    <FormattedMessage id="city" defaultMessage="City">
                      {(placeholder) => (
                        <input
                          onChange={handleChange}
                          name="city"
                          value={input.city}
                          defaultValue=""
                          type="text"
                          className={
                            input.city
                              ? "dark-opacity form-control checkout-input f15"
                              : "form-control checkout-input f15"
                          }
                          id="checkout-city"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </div>

                <div className="form-row">
                  {selectCountry}

                  <div className="form-group col-md-6">
                    <FormattedMessage id="state" defaultMessage="State">
                      {(placeholder) => (
                        <input
                          onChange={handleChange}
                          name="state"
                          value={input.state}
                          defaultValue=""
                          type="text"
                          className={
                            input.state
                              ? "dark-opacity form-control checkout-input f15"
                              : "form-control checkout-input f15"
                          }
                          id="checkout-state"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <FormattedMessage
                      id="account.postal"
                      defaultMessage="Postal Code"
                    >
                      {(placeholder) => (
                        <input
                          onChange={handleChange}
                          defaultValue=""
                          value={input.postcode}
                          name="postcode"
                          type="text"
                          className={
                            input.postcode
                              ? "dark-opacity form-control checkout-input f15"
                              : "form-control checkout-input f15"
                          }
                          id="checkout-postcode"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className="form-group col-md-6">
                    <FormattedMessage
                      id="reg.phone"
                      defaultMessage="Phone number"
                    >
                      {(placeholder) => (
                        <input
                            onChange={handleChange}
                          defaultValue=""
                          value={input.phone}
                          name="phone"
                          type="text"
                          className={
                            input.phone
                              ? "dark-opacity form-control checkout-input f15"
                              : "form-control checkout-input f15"
                          }
                          id="checkout-phone"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </div>

                <div className="form-group mt-3 mb-0">
                  <button className="btn btn-primary btn-lg f15" type="submit">
                    <FormattedMessage id="save" defaultMessage="Save" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AccountPageNewAddresses;

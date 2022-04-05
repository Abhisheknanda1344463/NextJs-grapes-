// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";
import Link from "next/link";
// data stubs
import theme from "../../data/theme";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { url, apiUrlWithStore } from "../../helper";
import BlockLoader from "../blocks/BlockLoader";

import { RemoveAddress, AddNewAddress, EditAddress } from "../../svg";

import { FormattedMessage } from "react-intl";

export default function AccountPageAddresses() {
  const customer = useSelector((state) => state.customer);
  const [address, setAddress] = useState();
  const [message, setMessage] = useState("");
  const [input, setInput] = useState({});

  useEffect(() => {
    const abortController = new AbortController();
    const single = abortController.single;

    if (customer.token) {
      fetch(apiUrlWithStore(`/api/addresses?pagination=0&token=` + customer.token), {
        single: single,
      })
        .then((responce) => responce.json())
        .then((res) => {
          if (res.data) {
            setAddress(res.data);
          }
        })
        .catch((err) => console.error(err));
    }

    return function cleaup() {
      abortController.abort();
    };
  }, [customer.token, message]);

  const removeAddress = (event, id) => {
    event.preventDefault();

    if (customer.token) {
      let option = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: customer.token,
        }),
      };
      fetch(`${url}/api/addresses/${id}`, option)
        .then((responce) => responce.json())
        .then((res) => {
          setMessage(res.message + id);
        })
        .catch((err) => console.error(err));
    }
  };

  const addresses = address?.map((address) => (
    <React.Fragment key={address.id}>
      <div className="addresses-list__item card address-card">
        <div className="address-card__body">
          <div className="address-card__name">{`${address.first_name} ${address.last_name}`}</div>
          <div className="address-card__row">
            {address.country_name}
            <br />
            {address.postcode}, {address.city}
            <br />
            {address.address1[0]}
          </div>
          {/*<div className="address-card__row">*/}
          {/*    <div className="address-card__row-title">*/}
          {/*        <FormattedMessage id="phone" defaultMessage="Tel. number:" />*/}
          {/*    </div>*/}
          {/*    <div className="address-card__row-content">{address.phone}</div>*/}
          {/*</div>*/}

          <div className="address-card__footer">
            <Link href={`/account/addresses/${address.id}`}>
              <a>
                <EditAddress />
              </a>
            </Link>
            &nbsp;&nbsp;
            {/*<Link href="/" onClick={(event) => removeAddress(event, address.id)}>*/}
            {/*    <a><FormattedMessage id="remove" defaultMessage="Remove" /></a>*/}
            {/*</Link>*/}
            <span
              className="address-remove-btn"
              onClick={(event) => removeAddress(event, address.id)}
            >
              <RemoveAddress />
            </span>
          </div>
        </div>
      </div>
      <div className="addresses-list__divider" />
    </React.Fragment>
  ));

  if (!address) {
    return null;
    // return <BlockLoader />; // if it will work will be loader bug
  }
  return (
    <div className="address-page-body">
      <h5 className="address-page-title">
        <FormattedMessage
          id="shipping-address"
          defaultMessage="Shipping address"
        />
      </h5>

      <div className="card-divider mb-5" />
      <div className="addresses-list">
        <Helmet>
          <title>{`Address List — ${theme.name}`}</title>
        </Helmet>

        {addresses}

        <div className="addresses-list__divider" />

        <Link href="/account/addresses/new">
          <a className="addresses-list__item addresses-list__item--new">
            <AddNewAddress />
            <FormattedMessage id="addNew" defaultMessage="Add an address" />
          </a>
        </Link>
      </div>
    </div>
  );
}

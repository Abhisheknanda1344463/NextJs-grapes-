// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";
import Link from 'next/link';
import { FormattedMessage } from "react-intl";

// data stubs
// import addresses from '../../data/accountAddresses';

import allOrders from "../../data/accountOrders";
import theme from "../../data/theme";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { url } from "../../helper";

export default function AccountPageDashboard() {
    const customer = useSelector((state) => state.customer);
    const [addresss, setAddress] = useState();
    useEffect(() => {
        const abortController = new AbortController();
        const single = abortController.single;

        if (customer.token) {
            fetch(url + "/api/addresses?token=" + customer.token)
                .then((responce) => responce.json())
                .then((res) => setAddress(res.data))
                .catch((err) => console.error(err));
        }

        return function cleaup() {
            abortController.abort();
        };
    }, [customer.token]);

    if (!addresss) {
        return "";
    }

    const address = addresss[0];

    // const orders = allOrders.slice(0, 3).map((order) => (
    //     <tr key={order.id}>
    //         <td>
    //             <Link href="/account/orders/107">
    //                 #
    //                 {order.id}
    //             </Link>
    //         </td>
    //         <td>{order.date}</td>
    //         <td>{order.status}</td>
    //         <td>{order.total}</td>
    //     </tr>
    // ));

    return (
        <div className="dashboard">
            <Helmet>
                <title>{`${theme.name}`}</title>
            </Helmet>

            {address ? (
                <div className="dashboard__address card address-card address-card--featured">
                    {address && (
                        <div className="address-card__badge">
                            <FormattedMessage id="account.defaultAddress" defaultMessage="Main address" />{" "}
                        </div>
                    )}
                    <div className="address-card__body">
                        <div className="address-card__name">{`${address.first_name} ${address.last_name}`}</div>
                        <div className="address-card__row">
                            {address.country}
                            <br />
                            {address.postcode},{address.city}
                            <br />
                            {address.address1[0]}
                        </div>
                        <div className="address-card__row">
                            <div className="address-card__row-title">
                                <FormattedMessage id="phone" defaultMessage="Tel։" />
                            </div>
                            <div className="address-card__row-content">{address.phone}</div>
                        </div>
                        {/* <div className="address-card__row">
                        <div className="address-card__row-title">Email Address</div>
                        <div className="address-card__row-content">{address.email}</div>
                    </div> */}
                        <div className="address-card__footer">
                            <Link href={`/account/addresses/${address.id}`}>
                                <FormattedMessage id="editAddress" defaultMessage="Edit address" />
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="dashboard__address card address-card address-card--featured">
                    <h2>
                        <FormattedMessage id="please.create.address" defaultMessage="Please create address" />{" "}
                    </h2>
                </div>
            )}
        </div>
    );
}

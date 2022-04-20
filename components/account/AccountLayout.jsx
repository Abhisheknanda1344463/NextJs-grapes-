// react
import React from "react";

// third-party
import classNames from "classnames";
import Link from "next/link";
// import { matchPath, Redirect, Switch, Route } from "react-router-dom";

// application
import PageHeader from "../shared/PageHeader";

// pages
// import AccountPageAddresses from "./AccountPageAddresses";
// import AccountPageDashboard from "./AccountPageDashboard";
// import AccountPageEditAddress from "./AccountPageEditAddress";
// import AccountPageOrderDetails from "./AccountPageOrderDetails";
// import AccountPageOrders from "./AccountPageOrders";
// import AccountPageProfile from "./AccountPageProfile";
// import AccountPageNewAddresses from "./AccountPageNewAddresses";

import { FormattedMessage } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { url } from "../../helper";
import { Account, History, Location, LogOut } from "../../svg";

export default function AccountLayout(props) {
  const customer = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const { match, location, children } = props;
  const history = useRouter();

  const logout = (e) => {
    e.preventDefault();
    dispatch({ type: "AUTHENTICATED", payload: false });
    dispatch({ type: "CUSTOMER_TOKEN", payload: "" });

    fetch(`${url}/api/customer/logout?token=${customer.token}`)
    //   .catch((error) =>
    //   alert("Server Error , contact with administrator" + error)
    // );
    history.push("/");
  };

  const breadcrumb = [
    {
      title: <FormattedMessage id="home" defaultMessage="Home" />,
      url: "/"
    },
    {
      title: (
        <FormattedMessage id="topbar.myAccount" defaultMessage="My account" />
      ),
      url: ""
    }
  ];

  const accountIcon = <Account/>;
  const historyIcon = <History className="historyIcon-svg"/>;
  const locationIcon = <Location/>;
  const exitIcon = <LogOut/>;

  const links = [
    {
      title: <FormattedMessage id="account.personalInformation" defaultMessage="Personal information"/>,
      url: "profile",
      icon: accountIcon
    },
    {
      title: <FormattedMessage id="account-my-orders" defaultMessage="My orders" />,
      url: "orders",
      icon: historyIcon
    },
    {
      title: <FormattedMessage id="account.address" defaultMessage="Address" />,
      url: "addresses",
      icon: locationIcon
    },
    {
      title: <FormattedMessage id="account.logout" defaultMessage="Exit" />,
      url: "logout",
      icon: exitIcon
    }
  ].map((link) => {
    let isActive;
    let currentPage = window.location.href.split("/").splice(-1, 1)[0];
    {
      currentPage == link.url ? (isActive = true) : (isActive = false);
    }
    const classes = classNames("account-nav__item", {
      // "account-nav__item--active": true,
      "account-nav__item--active": isActive
    });

    return (
      <li key={link.url} className={classes}>
        {link.url === "logout" ? (
          <Link href="/account/logout">
            <a onClick={logout} style={{display: "flex", alignItems: "center", gap: "5px"}}>
              <span style={{display: "flex", width: "30px"}}>{exitIcon}</span>
              <FormattedMessage id="account.logout" defaultMessage="Log out" />
            </a>
          </Link>
        ) : (
          <Link href={`/account/${link.url}`}>
            <a style={{display:"flex", alignItems: "center", gap: "5px"}}>
              <span style={{display: "flex", width: "30px"}}>{link.icon}</span>
              {link.title}
            </a>
          </Link>
        )}
      </li>
    );
  });

  return (
    <>
      <PageHeader header={breadcrumb[1].title} breadcrumb={breadcrumb} />
      <h1 className="account-nav__title">
        <FormattedMessage id="myAccount" defaultMessage="My Account" />
      </h1>
      <div className="block">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-3 d-flex mb-2">
              <div className="account-nav flex-grow-1 mb-4">
                <ul>
                  <div className="account-links-body">{links}</div>
                </ul>
              </div>
            </div>
            <div className="col-12 col-lg-9 mt-4 mt-lg-0">
              <div className="account-layout-content-margin">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

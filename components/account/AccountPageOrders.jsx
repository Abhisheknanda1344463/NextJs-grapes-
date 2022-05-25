// react
import React from "react";

// third-party
import Link from "next/link";
import { Helmet } from "react-helmet-async";

// application
import Pagination from "../shared/Pagination";

import theme from "../../data/theme";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { url, apiUrlWithStore } from "../../helper";
import BlockLoader from "../blocks/BlockLoader";
import { FormattedMessage } from "react-intl";

const AccountPageOrders = () => {
  const customer = useSelector((state) => state.customer);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer.token) {
      let urlPage = "";
      if (page) {
        urlPage = "&page=" + page;
      }
      fetch(
        apiUrlWithStore(
          `/api/orders?customer_id=${customer.customerId}&token=${customer.token}` +
          urlPage)
      )
        .then((response) => response.json())

        .then((res) => {
          setOrders(res);
          setLoading(false);
        });
    }
  }, [customer.token, page]);

  const handlePageChange = (page) => {
    setPage(page);
    setLoading(true);
  };

  if (!orders || loading) {
    return null;
    // return <BlockLoader />; // if it will work will be loader bug
  }

  function formatDate(date) {
    let cleared = date.split("-");
    let year = cleared[0];
    let month = cleared[1];
    let day = cleared[2].slice(0, 2);
    return day + "/" + month + "/" + year;
  }

  const ordersList = orders.data.map((order) => {
    let date = formatDate(order.created_at);
    console.log(order,);
    return (
      <tr key={order.id}>
        <td>
          <Link href={`/account/orders/${order.id}`}>
            <a className="underline">{`#${order.id}`}</a>
          </Link>
        </td>
        <td>{date}</td>
        <td>{order.formated_sub_total}</td>
        <td>{order.formated_tax_amount}</td>
        <td>{order.formated_shipping_amount}</td>
        {
          order.formated_base_discount_amount !== "$0.00" ? (
            <td>{order.formated_base_discount_amount}</td>
          ) : (
            <td></td>
          )
        }
        <td>{order.formated_grand_total || 0}</td>
        <td>
          {" "}
          <FormattedMessage
            id={order.status.toLowerCase()}
            defaultMessage={order.status}
          />
        </td>
      </tr>
    );
  });

  const mobileOrderList = orders.data.map((order) => {
    let date = formatDate(order.created_at);
    return (
      <div key={order.id} className="card order-history-card-mobile">
        <table>
          <tr>
            <td className="order-card-mobile-title">
              <FormattedMessage id="order-id" defaultMessage="Id" />
              <Link href={`/account/orders/${order.id}`}>
                <a>{`#${order.id}`}</a>
              </Link>
            </td>
          </tr>
          <tr>
            <th>
              <FormattedMessage id="date" defaultMessage="Date" />
            </th>
            <td>{date}</td>
          </tr>
          <tr>
            <th>
              <FormattedMessage id="price" defaultMessage="Price" />
            </th>
            <td>{order.formated_sub_total}</td>
          </tr>
          <tr>
            <th>
              <FormattedMessage id="tax" defaultMessage="Tax" />
            </th>
            <td>{order.formated_tax_amount}</td>
          </tr>
          <tr>
            <th>
              <FormattedMessage id="shipping" defaultMessage="Shipping" />
            </th>
            <td>{order.formated_shipping_amount}</td>
          </tr>
          {
            order.formated_base_discount_amount !== "$0.00" ? (
              <tr>
                <th>
                  <FormattedMessage id="discount.cupon" defaultMessage="Discount" />
                </th>
                <td>{order.formated_base_discount_amount}</td>
              </tr>
            ) : (
              <td></td>
            )
          }
          <tr>
            <th>
              <FormattedMessage id="total" defaultMessage="Total" />
            </th>
            <td>{order.formated_grand_total || 0}</td>
          </tr>
          <tr>
            <th>
              <FormattedMessage id="status" defaultMessage="Status" />
            </th>
            <td>{order.status}</td>
          </tr>
        </table>
      </div>
    );
  });

  return (
    <>
      <div className="card orders-page-desktop">
        <Helmet>
          <title>{`Order History — ${theme.name}`}</title>
        </Helmet>
        {orders.data.length > 0 ? (
          <div className="card-table ">
            <div className="table-responsive-sm">
              <table>
                <thead>
                  <tr>
                    <th>
                      <FormattedMessage id="order.id" defaultMessage="ID" />
                    </th>
                    <th>
                      <FormattedMessage id="date" defaultMessage="Date" />
                    </th>
                    <th>
                      <FormattedMessage id="price" defaultMessage="Price" />
                    </th>
                    <th>
                      <FormattedMessage id="tax" defaultMessage="Tax" />
                    </th>
                    <th>
                      <FormattedMessage
                        id="shipping"
                        defaultMessage="Shipping"
                      />
                    </th>
                    <th>
                      <FormattedMessage id="discount.cupon" defaultMessage="Discount" />
                    </th>
                    <th>
                      <FormattedMessage id="total" defaultMessage="Total" />
                    </th>
                    <th>
                      <FormattedMessage id="status" defaultMessage="Status" />
                    </th>
                  </tr>
                </thead>
                <tbody>{ordersList}</tbody>
              </table>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="card-divider" />
        <div className="card-footer">
          {orders.data.length > 0 ? (
            <Pagination
              current={page}
              total={1}
              onPageChange={handlePageChange}
            />
          ) : (
            <FormattedMessage
              id="empty.order.list"
              defaultMessage="Yor order list is empoty"
            />
          )}
        </div>
      </div>

      <div className="orders-page-mobile">
        {mobileOrderList}
        <div className="card-footer">
          {orders.data.length > 0 ? (
            <Pagination
              current={page}
              total={1}
              onPageChange={handlePageChange}
            />
          ) : (
            <FormattedMessage
              id="empty.order.list"
              defaultMessage="Yor order list is empty"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AccountPageOrders;

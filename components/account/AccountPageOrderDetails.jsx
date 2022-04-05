// react
import React from "react";
import { connect } from "react-redux";
// third-party
import { Helmet } from "react-helmet-async";
import Link from "next/link";

// data stubs
import theme from "../../data/theme";
import { useEffect } from "react";
import { url } from "../../helper";
import { useSelector } from "react-redux";
import { useState } from "react";
import BlockLoader from "../blocks/BlockLoader";
import { FormattedMessage } from "react-intl";
import { cartAddItem } from "../../store/cart";

function AccountPageOrderDetails({ orderId, cartToken, cartAddItem }) {
  const customer = useSelector((state) => state.customer);
  const [order, setOrder] = useState();

  useEffect(() => {
    const abortController = new AbortController();
    const single = abortController.single;

    if (orderId && customer.token) {
      fetch(url + `/api/orders/${orderId}?token=` + customer.token, {
        single: single,
      })
        .then((responce) => responce.json())
        .then((res) => {
          if (res.data) {
            setOrder(res.data);
          }
        })
        .catch((err) => console.error(err));
    }

    return function cleaup() {
      abortController.abort();
    };
  }, [orderId]);

  if (!order) {
    return null;
    // return <BlockLoader />; // if it will work will be loader bug
  }

  function handlerReorder() {
    const { items } = order;
    new Promise((resolve) => {
      setTimeout(() => {
        items.forEach((item, index) => {
          let product = null;
          if (customer.role == "subUser") {
            product = item;
            delete product["id"];
            product["id"] = item.product_id;
          } else {
            product = item.product;
          }

          cartAddItem(
            product,
            [],
            +item.additional.quantity,
            cartToken,
            customer.token ? customer.token : null,
            resolve,
            index + 1 == items.length ? true : false
          );
        });
      }, 500);
    }).then((res) => {
      history.push("/shop/cart");
    });
  }

  const orderDetails = (
    <table className="order-details-info-table order-details-info-table-mobile">
      <tr>
        <th>
          <FormattedMessage id="subtotal" defaultMessage="Subtotal" />
        </th>
        <td>{order.formated_sub_total}</td>
      </tr>
      <tr>
        <th>
          <FormattedMessage id="shipping" defaultMessage="Shipping" />
        </th>
        <td>{order.formated_shipping_amount}</td>
      </tr>
      <tr>
        <th>
          <FormattedMessage id="tax" defaultMessage="Tax" />
        </th>
        <td>{order.formated_tax_amount}</td>
      </tr>
      <tr>
        <th>
          <FormattedMessage id="total.price" defaultMessage="Total" />
        </th>
        <td>{order.formated_grand_total}</td>
      </tr>
      <tr>
        <th>
          <FormattedMessage id="status" defaultMessage="Status" />
        </th>
        <td>
          <FormattedMessage
            id={order.status.toLowerCase()}
            defaultMessage={order.status}
          />
        </td>
      </tr>
    </table>
  );

  const productNamesForMobile = order.items.map((item, index) => {
    return (
      <div key={index} className="d-flex flex-row justify-content-between">
        <span className="order-details-name-width">{item.name}</span>
        <span>
          {item.qty_ordered} <span className="mx-1">x</span>
        </span>
        <span>{item.formatted_price}</span>
        <span>{item.formatted_total}</span>
      </div>
    );
  });

  return (
    <>
      <Helmet>
        <title>{`Order Details — ${theme.name}`}</title>
      </Helmet>

      <div className="card order-details-desktop">
        <div className="order-header">
          <h5 className="order-header__title">
            <FormattedMessage id="order" defaultMessage="Order" /> #{order.id}
          </h5>
          <div className="order-header__actions">
            <Link href="/account/orders">
              <a className="btn btn-sm btn-secondary">
                <FormattedMessage
                  id="backToList"
                  defaultMessage="Back to list"
                />
              </a>
            </Link>
          </div>
        </div>

        <div className="order-details-body-details">
          <span className="order-details-title">
            <FormattedMessage
              id="shipping-address"
              defaultMessage="Shipping address"
            />
          </span>
          <span className="order-details-title">
            <FormattedMessage
              id="billingAddress"
              defaultMessage="Billing address"
            />
          </span>
          <span className="order-details-title">
            <FormattedMessage
              id="payment.method"
              defaultMessage="Payment method"
            />
          </span>
        </div>
        <div className="card-divider" />

        <div className="order-details-body-details">
          <span className="order-details-info">
            {order.shipping_address.address1[0]}
          </span>
          <span className="order-details-info">
            {order.billing_address.address1[0]}
          </span>

          <span className="order-details-info">
            <FormattedMessage
              id={order.payment_title.toLowerCase().replace(/\s/g, "")}
              defaultMessage={order.payment_title}
            />
          </span>
        </div>
        <div className="card-divider" />

        <div className="order-details-2nd-layer-title">
          <span className="order-details-title">
            <FormattedMessage id="product" defaultMessage="Product" />
          </span>
          <span className="order-details-title">
            <FormattedMessage id="price" defaultMessage="Price" />
          </span>
          <span className="order-details-title">
            <FormattedMessage id="qty" defaultMessage="Quantity" />
          </span>
          <span className="order-details-title">
            <FormattedMessage id="total.price" defaultMessage="Total price" />
          </span>
        </div>
        <div className="card-divider" />

        <div className="order-details-2nd-layer-title">
          <span className="">{order.items[0].name}</span>
          <span className="">{order.formated_sub_total}</span>
          <span className="">{order.total_qty_ordered}</span>
          <span className="">{order.formated_grand_total}</span>
        </div>

        <div className="card-divider" />

        <div className="order-details-bottom-info">
          <div>
            {orderDetails}
            <div className="reorder-btn-parent">
              <button
                className="btn btn-primary f16 btn-primary-fms reorder-btn"
                onClick={handlerReorder}
              >
                <FormattedMessage id="reorder" defaultMessage="Reorder" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card px-2 py-3 order-details-mobile">
        <div className="d-flex justify-content-between mb-5">
          <span className="font-weight-bold f18">
            <FormattedMessage id="order-inner-title" defaultMessage="Order" /> #
            {order.id}
          </span>
          <Link href="/account/orders">
            <a className="btn btn-xs btn-secondary f14">
              <FormattedMessage id="backToList" defaultMessage="Back to list" />
            </a>
          </Link>
        </div>
        <div className="orders-inner-details-mobile d-flex flex-column">
          <div className="d-flex flex-row justify-content-between">
            <span className="table-heading-descriptions">
              <FormattedMessage
                id="shipping-address"
                defaultMessage="Shipping address"
              />
            </span>
            <span className="f14">{order.shipping_address.address1[0]}</span>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <span className="table-heading-descriptions">
              <FormattedMessage
                id="billingAddress"
                defaultMessage="Billing address"
              />
            </span>
            <span className="f14">{order.billing_address.address1[0]}</span>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <span className="table-heading-descriptions">
              <FormattedMessage
                id="payment.method"
                defaultMessage="Payment method"
              />
            </span>
            <span className="f14">{order.payment_title}</span>
          </div>
          {productNamesForMobile}
        </div>

        <div className="order-details-info-mobile">
          {orderDetails}
          <div className="reorder-btn-parent">
            <button className="btn btn-primary f16 btn-primary-fms reorder-btn">
              <FormattedMessage
                id="reorder"
                defaultMessage="Reorder"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  cartToken: state.cartToken,
});

const mapDispatchToProps = {
  cartAddItem,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountPageOrderDetails);

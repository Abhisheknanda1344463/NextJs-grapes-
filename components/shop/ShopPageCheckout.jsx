import React from "react";
import Link from "next/link";
import Router from "next/router";
import { url, apiUrlWithStore } from "../../helper";
import shopApi from "../../api/shop";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Check9x7Svg, IdramPosSVG, TelcellPosSVG, PaypalPosSVG } from "../../svg";
import Currency from "../shared/Currency";
import Collapse from "../shared/Collapse";
import PageHeader from "../shared/PageHeader";
import ShippingMethod from "./ShippingMethod";
// import payments from "../../data/shopPayments";
import ShippingAddress from "./ShippingAddress";
import { FormattedMessage, injectIntl } from "react-intl";
import { cartUpdateData, cartRemoveAllItems } from "../../store/cart";
import CreditCartSvg from "../../svg/creditCart.svg";
import { runFbPixelEvent } from "../../services/utils";
import TextField from "@mui/material/TextField";
//momemt js
import moment from "moment";
const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validateForm = (errors) => {
  let arr = Object.values(errors);
  let isValid = true;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length > 0) {
      isValid = false;
    }
  }
  return isValid;
};

const phonenumber = RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/);

class ShopPageCheckout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: this.props.customer,
      cart: this.props.cart,
      loading: false,
      inputsValues: null,
      checkbox: false,
      token: this.props.token,
      locale: this.props.locale,
      payment: "cashondelivery",
      payments: this.props.payments,
      inputsDataForParent: false,
      notes: "",
      fullName: "",
      lname: "",
      name: "",
      shippingMethod: "",
      shippingMethodRate: "",
      street: "",
      shipingStreet: "",
      shipingPhone: "",
      phone: "",
      email: "",
      country: "",
      states: "",
      city: "",
      apartment: "",
      postal: "",
      defaultAddress: true,
      newBillingAddress: false,
      input: null,

      billStreet: "",
      billPhone: "",
      billApartment: "",
      billCity: "",
      billPost: "",
      billCountry: "",
      billState: "",

      billCountryList: [],
      billCountryStates: [],
      isSelectedCustomAddress: false,
      pastOrders: [],
      addressOption: {},
      addCupone: "",
      errors: {
        fullName: "",
        name: "",
        lname: "",
        street: "",
        shipingStreet: "",
        shipingPhone: "",
        phone: "",
        email: "",
        country: "",
        city: "",
        apartment: "",
        postal: "",
        checkbox: "",
      },
    };
  }

  componentDidMount() {
    this.abortController = new AbortController();
    this.single = this.abortController;
    runFbPixelEvent({ name: "Checkout Page" });

    fetch(apiUrlWithStore(`/api/country-states?pagination=0`))
      .then((res) => res.json())
      .then((res) => this.setState({ billCountryStates: res }));

    fetch(apiUrlWithStore(`/api/countries?pagination=0`))
      .then((res) => res.json())
      .then((res) => this.setState({ billCountryList: res.data.reverse() }));

    if (this.state.customer.token != "") {
      fetch(
        apiUrlWithStore(`/api/addresses?token=${this.state.customer.token}`)
      )
        .then((res) => res.json())
        .then((res) => {
          this.setState({
            pastOrders: res.data,
            street: res.data[0]?.address1[0],
            city: res.data[0]?.city,
            country: res.data[0]?.country,
            fullName: res.data[0]?.first_name,
            lname: res.data[0]?.last_name,
            phone: res.data[0]?.phone,
            postal: res.data[0]?.postcode,
            state: res.data[0]?.state,
            apartment: res.data[0]?.apartment,
          });
        });

      fetch(
        apiUrlWithStore("/api/customer/get?token=" + this.state.customer.token),
        {
          single: this.single,
        }
      )
        .then((responce) => responce.json())
        .then((res) => {
          this.setState({ email: res.data.email });
        });
    }
  }

  //***************** OLD CODE ******************
  // componentDidUpdate(prevState) {
  //   if (this.props.locale !== prevState.locale) {
  //     alert(5)
  //
  //     shopApi
  //       .getPaymentsMethods({
  //         local: this.props.locale,
  //       })
  //       .then((res) => {
  //         console.log(res, "resultTTTTTTTT")
  //         const data = res.map((e) => {
  //           return {
  //             ...e,
  //             key: e.method,
  //           };
  //         });
  //         this.setState({ payments: data });
  //       })
  //       .catch((err) => console.error(err));
  //   }
  // }
  //****************** NEW CHANGE CODE ******************
//   componentWillReceiveProps(nextProps) {
//     if (nextProps) {
//       shopApi
//         .getPaymentsMethods({
//           local: this.props.locale,
//         })
//         .then((res) => {
//           console.log(res, 'resultTTTTTTTT')
//           const data = res.map((e) => {
//             return {
//               ...e,
//               key: e.method,
//             }
//           })
//           this.setState({ payments: data })
//         })
//         .catch((err) => console.error(err));
//   }
// }

  handlePaymentChange = (event) => {
    if (event.target.checked) {
      this.setState({ payment: event.target.value });
    }
  };

  setShipingMethod = (val) => {
    this.setState({ shippingMethod: val.value });
    this.setState({
      shippingMethodRate: val.getAttribute("data-default_rate"),
    });
  };

  getCartCustomer = () => {
    if (this.state.customer && this.state.customer.token) {
      fetch(
        apiUrlWithStore(
          `/api/checkout/cart?token=` + this.state.customer.token
        ),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((res) => {
          if (!res.data.coupon_code) {
            this.setState({ addCupone: "" });
          }
          this.props.cartUpdateData({
            total: res.data.base_grand_total,
            coupon_code: res.data.coupon_code,
            coupon_discount: res.data.base_discount,
          });
        });
    }
  };

  addCuponeCode = (methods) => {
    //  this.getCartCustomer();
    const requestOptions = {
      method: methods,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: this.state.addCupone,
        token: this.state.customer.token,
      }),
    };
    if (this.state.addCupone || methods == "DELETE") {
      fetch(apiUrlWithStore(`/api/checkout/cart/coupon`, requestOptions))
        .then((response) => response.json())
        .then((res) => {
          if (res.message) {
            if (res.success) {
              toast.success(`${res.message}`,{ hideProgressBar: true});
              this.props.cartUpdateData({
                coupon_name: res.CouponName,
              });

              this.getCartCustomer();
            } else {
              toast.error(`${res.message}`, { hideProgressBar: true});
            }
          }
        })
        .catch((error) => console.log(error));
    }
  };

  renderTotals() {
    const { cart } = this.props;

    if (cart.extraLines.length <= 0) {
      return null;
    }
    const extraLines = cart.extraLines.map((extraLine, index) => (
      <tr key={index}>
        <th>{extraLine.title}</th>
        <td>
          <Currency value={extraLine.price} />
        </td>
      </tr>
    ));

    return (
      <React.Fragment>
        <tbody className="checkout__totals-subtotals">
          <tr>
            <th>Subtotal</th>
            <td>
              <Currency value={cart.subtotal} />
            </td>
          </tr>
          {extraLines}
        </tbody>
      </React.Fragment>
    );
  }

  renderCupone() {
    return (
      <div className="coupon-code">
        <div className="coupon-code__list">
          {/* <FormattedMessage id="coupon.code" defaultMessage="Coupon Code">
            {(placeholder) => (
              <input
                type="text"
                name="couponcode"
                placeholder={placeholder}
                value={
                  this.props.cart.coupon_code
                    ? this.props.cart.coupon_code
                    : this.state.addCupone
                }
                className={
                  this.props.cart.coupon_code || this.state.addCupone
                    ? "dark-opacity form-control checkout-input"
                    : "form-control checkout-input cupon-input-fms "
                }
                onChange={(e) => this.setState({ addCupone: e.target.value })}
              />
            )}
          </FormattedMessage> */}
          <TextField
            id="outlined-email-input"
            label={
              <FormattedMessage id="coupon.code" defaultMessage="Coupon Code" />
            }
            type="email"
            autoComplete="current-email"
            onChange={(e) => this.setState({ addCupone: e.target.value })}
            name="couponcode"
          />

          <button
            type="submit"
            onClick={
              this.props.cart.coupon_code
                ? () => {
                    this.addCuponeCode("DELETE");
                  }
                : () => {
                    this.addCuponeCode("POST");
                  }
            }
            className="coupon-code-button-apply"
          >
            {/* <FormattedMessage id="Apply" defaultMessage="Apply" /> */}
            {this.props.cart.coupon_code ? (
              <FormattedMessage id="remove" defaultMessage="Remove" />
            ) : (
              <FormattedMessage id="apply" defaultMessage="Apply" />
            )}
          </button>
        </div>
      </div>
    );
  }

  renderCuponeName() {
    let couponname = this.props.cart.coupon_code ? (
      <th>{this.props.cart.coupon_name}</th>
    ) : (
      ""
    );
    let coupondiscount = this.props.cart.coupon_code ? (
      <th>-{this.props.cart.coupon_discount}</th>
    ) : (
      ""
    );
    return (
      <tr>
        {couponname}
        {coupondiscount}
      </tr>
    );
  }

  renderCart() {
    const { cart } = this.props;
    let newDate = new Date();
    const date_now = moment(newDate).format("YYYY-MM-DD");
    const items = cart.items.map((item) => (
      <tr key={item.id}>
        <td>{`${item.product.name}`}</td>
        <td className="responsive-checkout-text">
          {console.log("item",item)}
          {`${item.quantity} ×`}
          {item.product?.special_price &&
          date_now >= item.product.special_price_from &&
          date_now <= item.product.special_price_to ? (
            <Currency value={Number(item.product.special_price).toFixed(0)} />
          ) : item.product?.special_price
            ? <Currency value={Number(item.product.special_price).toFixed(0)} /> : (
            <Currency value={Number(item.product.price).toFixed(0)} />
          )}
          {/*{item.product.formatted_price*/}
          {/*  ? item.product.formatted_special_price != "$0.00"*/}
          {/*    ? item.product.formatted_special_price*/}
          {/*    : item.product.formatted_price*/}
          {/*  : item.product.formated_special_price &&*/}
          {/*    item.product.formated_special_price != "$0.00"*/}
          {/*    ? item.product.formated_special_price*/}
          {/*    : item.product.formated_price}*/}
        </td>
      </tr>
    ));
    return (
      <table className="checkout__totals">
        <tbody className="checkout__totals-products">{items}</tbody>
        <tfoot className="checkout__totals-footer">
          {cart.tax > 0 ? (
            <tr>
              <th className="font-weight-bold pt-5">
                <FormattedMessage id="tax" defaultMessage="Tax" />
              </th>
              <th className="responsive-checkout-text pt-5"> {cart.tax}</th>
            </tr>
          ) : null}
          {this.state.shippingMethodRate ? (
            <tr className="checkout-shipimg-title-fms">
              <th className="font-weight-bold">
                {" "}
                <FormattedMessage
                  id="shipping"
                  defaultMessage="Shipping"
                />{" "}
              </th>
              <td className="responsive-checkout-text">
                <Currency value={this.state.shippingMethodRate} />
              </td>
            </tr>
          ) : (
            ""
          )}
          <tr>
            <td colSpan="2">{this.renderCupone()}</td>
            {this.renderCuponeName()}
          </tr>
          <tr>
            <th className="font-weight-bold">
              <FormattedMessage id="total" defaultMessage="Total" />
            </th>
            <td className="responsive-checkout-text">
              <Currency value={cart.total} />
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }

  renderPaymentsList() {
    const { payment: currentPayment } = this.state;
    const payments = this.state.payments.map((payment) => {
      const renderPayment = ({ setItemRef, setContentRef }, index) => (
        <li className="payment-methods__item" ref={setItemRef} key={index}>
          <label className="payment-methods__item-header">
            <span className="payment-methods__item-radio input-radio">
              <span className="input-radio__body">
                <input
                  type="radio"
                  className="input-radio__input"
                  name="checkout_payment_method"
                  value={payment.key}
                  checked={currentPayment === payment.key}
                  onChange={this.handlePaymentChange}
                />

                <span className="input-radio__circle pay-side cash-visa-fms"  style={{marginRight: "12px"}}/>
              </span>
            </span>
            <span className="payment-methods__item-title">
              {payment.method == "newevoca_vpos" ||
              payment.method == "ineco_vpos" ||
              payment.method == "ameria_vpos"
                ? <CreditCartSvg/>
                : payment.method == "idram_vpos" ? <IdramPosSVG />
                : payment.method == "telcell_vpos" ? <TelcellPosSVG />
                // : payment.method == "paypal_vpos" ? <PaypalPosSVG />
               : (
                <FormattedMessage
                  id={payment.key}
                  defaultMessage={payment.title}
                />
              )}
            </span>
          </label>
          <div className="payment-methods__item-container" ref={setContentRef}>
            {/*<Image*/}
            {/*    style={{*/}
            {/*        margin: "auto",*/}
            {/*        display: "block",*/}
            {/*        width: "200px",*/}
            {/*        minHeight: "100%",*/}
            {/*        paddingBottom: "10px",*/}
            {/*    }}*/}
            {/*    src={urlLink + "/" +payment.img.src}*/}
            {/*    alt=""*/}
            {/*    layout='fill'*/}
            {/*/>*/}
          </div>
        </li>
      );

      return (
        <Collapse
          key={payment.key}
          open={currentPayment === payment.key}
          toggleClass="payment-methods__item--active"
          render={renderPayment}
        />
      );
    });
    return (
      <div>
        <div className="payment-methods">
          <div className="payment-method-title">
            <FormattedMessage
              id="payment.method"
              defaultMessage="Payment method"
            />
          </div>
          <ul className="payment-methods__list">{payments}</ul>
        </div>
      </div>
    );
  }

  // openAddress() {
  //     this.setState({ ShippingAddress: !this.state.ShippingAddress });
  // }

  openBillingAddress() {
    this.setState({ newBillingAddress: true });
  }

  closeBillingAddress() {
    this.setState({ newBillingAddress: false });
  }

  onclick = (event) => {
    this.setState({ checkbox: !this.state.checkbox });
  };

  chacking = (resolve) => {
    const {
      fullName,
      lname,
      email,
      street,
      phone,
      country,
      city,
      apartment,
      postal,
      checkbox,
    } = this.state;
    let object = {};

    if (email === "" || validEmailRegex.test(this.state.email) == false) {
      object.email = "Email is not valid!";
    }

    if (fullName === "") {
      object.fullName = "Full Name must be 3 characters long!";
    }
    if (lname === "") {
      object.lname = "Last Name must be 3 characters long!";
    }
    // if (email === "" || validEmailRegex.test(this.state.email) == false) {
    //   object.email = "Email is not valid!";
    // }

    if (street === "") {
      object.street = "Street is not valid!";
    }

    if (apartment === "") {
      object.apartment = "Apartment is not valid!";
    }

    if (postal === "") {
      object.postal = "Postal code is not valid!";
    }

    if (country === "") {
      object.country = "Country is not valid!";
    }

    if (city === "") {
      object.city = "City is not valid!";
    }

    if (phone === "" || phonenumber.test(this.state.phone) == false) {
      object.phone = "Phone is not valid!";
    }

    if (checkbox === false) {
      object.checkbox = "This field is required";
    } else {
      object.checkbox = "";
    }

    if (Object.keys(object).length > 0) {
      this.setState(
        {
          errors: {
            ...this.state.errors,
            ...object,
          },
        },
        () => {
          resolve();
        }
      );
    }
    if (Object.keys(this.state.addressOption).length > 0) {
      this.setState({
        street: this.state.addressOption.address1[0],
        fullName: this.state.addressOption.first_name,
        lname: this.state.addressOption.last_name,
        city: this.state.addressOption.city,
        country: this.state.addressOption.country,
        states: this.state.state || "no state",
        postal: this.state.addressOption.postcode,
        phone: this.state.addressOption.phone,
        email: this.state.email,
        apartment: this.state.addressOption.apartment,
        errors: {
          street: "",
          fullName: "",
          lname: "",
          city: "",
          country: "",
          states: "",
          postal: "",
          phone: "",
          apartment: "",
          checkbox: object.checkbox,
          email: this.state.email ? "" : "Invalid Email",
        },
      });
    }
  };

  requestOrder() {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    let shippingDetalies, options, options_payment, save_shipping;
    if (this.state.ShippingAddress) {
      shippingDetalies = {
        address1: this.state.shipingStreet,
        name: this.state.name,
        phone: this.state.shipingPhone,
      };
    }

    // const billing = {
    //     use_for_shipping: true,
    //     address1: street,
    //     email: this.state.email,
    //     first_name: this.state.fullName,
    //     last_name: this.state.lname,
    //     city: this.state.city,
    //     country: "AM",
    //     state: "Yerevan",
    //     postcode: "75017",
    //     phone: this.state.phone,
    //     company_name: 'FIdem',
    // }
    //
    // if (this.state.ShippingAddress) {
    //     let street1 = this.state.shipingStreet
    //     if (typeof street1 == 'string')
    //         street1 = [street1]
    //     shipping = {
    //         email: this.state.shipingEmail,
    //         last_name: this.state.shipingLname,
    //         city: this.state.shipingCity,
    //         first_name: this.state.name,
    //         country: "AM",
    //         state: "Yerevan",
    //         postcode: "75017",
    //         // company_name: '',
    //         address1: street1,
    //         phone: this.state.shipingPhone
    //     }

    let billing;
    if (Object.keys(this.state.addressOption).length > 0) {
      billing = {
        use_for_shipping: true,
        save_as_address: false,
        address1: [this.state.addressOption.address1[0]],
        address2: [this.state.addressOption.apartment],
        email: this.state.email,
        first_name: this.state.addressOption.first_name,
        last_name: this.state.addressOption.last_name,
        city: this.state.addressOption.city,
        country: this.state.addressOption.country,
        state: this.state.state || "no state",
        postcode: this.state.addressOption.postcode,
        phone: this.state.addressOption.phone,
        // apartment: this.state.addressOption.apartment,
        company_name: "",
        additional: this.state.notes,
      };
    } else {
      if (this.state.pastOrders.length > 0) {
        const {
          street,
          city,
          country,
          fullName,
          lname,
          phone,
          postal,
          state,
          apartment,
        } = this.state;

        const {
          city: cityTwo,
          country: countryTwo,
          first_name: fullNameTwo,
          last_name: lnameTwo,
          phone: phoneTwo,
          postcode: postalTwo,
          state: stateTwo,
          apartment: apartmentTwo,
        } = this.state.pastOrders[0];

        const aJson = JSON.stringify({
          street,
          city,
          country,
          fullName,
          lname,
          phone,
          postal,
          state,
          apartment,
        });

        const bJson = JSON.stringify({
          street: this.state.pastOrders[0].address1[0],
          city: cityTwo,
          country: countryTwo,
          fullName: fullNameTwo,
          lname: lnameTwo,
          phone: phoneTwo,
          postal: postalTwo,
          state: stateTwo,
          apartment: apartmentTwo,
        });
        if (aJson == bJson) {
          billing = {
            use_for_shipping: true,
            save_as_address: false,
            address1: [this.state.street],
            address2: [this.state.apartment],
            email: this.state.email,
            first_name: this.state.fullName,
            last_name: this.state.lname,
            city: this.state.city,
            country: this.state.country,
            state: this.state.state || "no state",
            postcode: this.state.postal,
            phone: this.state.phone,
            // apartment: this.state.apartment,
            company_name: "",
            additional: this.state.notes,
          };
        } else {
          billing = {
            use_for_shipping: true,
            save_as_address: true,
            address1: [this.state.street],
            address2: [this.state.apartment],
            email: this.state.email,
            first_name: this.state.fullName,
            last_name: this.state.lname,
            city: this.state.city,
            country: this.state.country,
            state: this.state.state || "no state",
            postcode: this.state.postal,
            phone: this.state.phone,
            // apartment: this.state.apartment,
            company_name: "",
            additional: this.state.notes,
          };
        }
      } else {
        billing = {
          use_for_shipping: true,
          save_as_address: true,
          address1: [this.state.street],
          address2: [this.state.apartment],
          email: this.state.email,
          first_name: this.state.fullName,
          last_name: this.state.lname,
          city: this.state.city,
          country: this.state.country,
          state: this.state.state || "no state",
          postcode: this.state.postal,
          phone: this.state.phone,
          // apartment: this.state.apartment,
          company_name: "",
          additional: this.state.notes,
        };
      }
    }

    //hereeeeeeeeeeeeee
    const shipping = {
      address1: [this.state.shipingStreet],
      address2: [this.state.apartment || this.state.addressOption.apartment],
      name: this.state.name,
      phone: this.state.shipingPhone,
    };

    if (this.state.customer.token) {
      options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          billing: billing,
          shipping: shipping,
          api_token: this.state.token.cartToken,
          token: this.state.customer.token,
        }),
      };
      options_payment = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          payment: { method: this.state.payment },
          api_token: this.state.token.cartToken,
          token: this.state.customer.token,
        }),
      };

      save_shipping = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          shipping_method: this.state.shippingMethod,
          api_token: this.state.token.cartToken,
          token: this.state.customer.token,
        }),
      };
    } else {
      options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          billing: billing,
          shipping: shipping,
          api_token: this.state.token.cartToken,
        }),
      };
      options_payment = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          payment: { method: this.state.payment },
          api_token: this.state.token.cartToken,
        }),
      };

      save_shipping = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          shipping_method: this.state.shippingMethod,
          api_token: this.state.token.cartToken,
        }),
      };
    }

    fetch(apiUrlWithStore("/api/checkout/save-address"), options)
      .then((response) => {
        if (response.ok) {
          fetch(
            apiUrlWithStore(
              `/api/checkout/save-shipping${
                this.state.customer.token
                  ? `?token=${this.state.customer.token}`
                  : ""
              }`
            ),
            save_shipping
          )
            .then((res) => {
              if (res.ok) {
                fetch(
                  apiUrlWithStore("/api/checkout/save-payment"),
                  options_payment
                )
                  .then((rsponce) => {
                    if (rsponce.ok) {
                      let body;
                      if (this.state.customer.token) {
                        body = {
                          api_token: this.state.token.cartToken,
                          token: this.state.customer.token,
                          // description: this.state.notes,
                        };
                      } else {
                        body = {
                          api_token: this.state.token.cartToken,
                          // description: this.state.notes,
                        };
                      }

                      fetch(apiUrlWithStore("/api/checkout/save-order"), {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify(body),
                      })
                        .then((res) => res.json())
                        .then((res) => {
                          if (res.success) {
                            if (res?.redirect_url?.backURL) {
                              window.location = res.redirect_url.backURL;
                            } else {
                              let url = "";
                              if (res?.redirect_url) {
                                url = res.redirect_url;
                              } else if (res?.order?.id) {
                                url = `/thanks?orderID=${res.order.id}`;
                              } else {
                                url = `/thanks?orderID=${res.id}`;
                              }
                              Router.push(url);
                            }

                            this.props.cartRemoveAllItems();
                          }
                        })
                        .catch((err) => console.log(err, "err"));
                    }
                  })
                  .then((res) => {
                    // console.log(res, "lplplpl");
                  });
              }
            })
            .catch((err) => console.log(err, "err"));
        }
      })
      .catch((err) => console.log(err, "err"));
    //   return <Redirect to="/thanks" />;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    new Promise((resolve) => {
      this.setState({ loading: true });
      this.chacking(resolve);
    }).then(() => {
      if (validateForm(this.state.errors)) {
        this.requestOrder();
      } else {
        this.setState({ loading: false });
      }
    });
  };

  handleInputChange = (object) => {
    let name, value;
    name = object?.target?.name || object.name;
    value = object?.target?.value || object.value;

    this.setState({
      [name]: value,
    });

    this.setState({
      errors: {
        ...this.state.errors,
        [name]: "",
      },
    });

    //// old logic for update input values
    // let errors = this.state.errors;
    // this.setState({
    //   [event.target.name]: event.target.value,
    //   [name]: value,
    // });
  };

  chosenAddress = (obj) => {
    this.setState({
      addressOption: { ...obj },
    });
  };

  render() {
    let selectCountry;
    let selectState;
    let countryCode;

    if (this.state.billCountryList) {
      selectCountry = (
        <div className="form-group checkout-style col-12 col-md-6 px-2">
          <select
            name="billCountry"
            className={
              this.state.billCountry
                ? "dark-opacity checkout-input checkout-select-billing"
                : "checkout-input checkout-select-billing"
            }
            onChange={this.handleInputChange}
            value={this.state.billCountry}
          >
            <FormattedMessage
              id="select.country"
              defaultMessage="Select Country"
            >
              {(placeholder) => (
                <option selected="true" disabled="disabled">
                  {placeholder}
                </option>
              )}
            </FormattedMessage>
            {this.state.billCountryList.map((option, index) => (
              <option value={option.name} key={index}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (this.state.billCountryList && this.state.billCountry) {
      for (let i = 0; i <= this.state.billCountryList.length; i++) {
        if (
          this.state.billCountryList[i] &&
          this.state.billCountryList[i].name == this.state.billCountry
        ) {
          countryCode = this.state.billCountryList[i].code;
        }
      }
    }

    if (
      countryCode &&
      this.state.billCountryStates.data &&
      this.state.billCountryStates.data[countryCode]
    ) {
      selectState = (
        <div className="form-group checkout-style col-12 col-md-12 px-2">
          <select
            name="billState"
            className={
              this.state.billState
                ? "dark-opacity checkout-input checkout-select-billing"
                : "checkout-input checkout-select-billing"
            }
            onChange={this.handleInputChange}
          >
            <option selected="true" disabled="disabled">
              Select State
            </option>
            {this.state.billCountryStates.data[countryCode].map(
              (option, index) => (
                <option value={option.default_name} key={index}>
                  {option.default_name}
                </option>
              )
            )}
          </select>
        </div>
      );
    } else {
      selectState = "";
    }

    const { cart } = this.props;
    const { errors } = this.state;
    const { locale } = this.props;

    if (cart.items.length < 1) {
      // return Router.push('/shop/cart')
    }

    const breadcrumb = [
      {
        title: (
          <FormattedMessage id="home" defaultMessage="home" />
        ),
        url: "/",
      },
      {
        title: <FormattedMessage id="checkout" defaultMessage="Checkout" />,
        url: url + "/shop/checkout",
      },
    ];

    return (
      <React.Fragment>
        <PageHeader breadcrumb={breadcrumb} />
        <div className="checkout block">
          <div className="container">
            <h3 className="checkout-page-title">
              <FormattedMessage id="checkout" defaultMessage="Checkout" />
            </h3>
            <div className="row ">
              <div className="col-12 col-lg-6 col-xl-7">
                <div className="card mb-lg-0">
                  <div className="form-group checkout-style col-12 col-md-12 mt-md-2 px-4">
                    <div className="already-have-account-fms">
                      <div className="checkout-card-title">
                        <FormattedMessage
                          id="foot.contactinformation"
                          defaultMessage="Contact information"
                        />
                      </div>
                      {!this.state.customer.authenticated ? (
                        <div className="already-have-account-responsive">
                          <FormattedMessage
                            id="reg.alreadyHaveAnAccount"
                            defaultMessage="Already have an account ?"
                          />
                          <Link href="/login">
                            <a className="link-underline">
                              <FormattedMessage
                                id="login.log.in"
                                defaultMessage=" Log In"
                              />
                            </a>
                          </Link>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <span className="already-have-account-mail-fms">
                      <TextField
                        id="outlined-email-input"
                        label={
                          <FormattedMessage
                            id="email"
                            defaultMessage="E-mail"
                          />
                        }
                        type="email"
                        autoComplete="current-email"
                        onChange={this.handleInputChange}
                        name="email"
                      />
                    </span>
                    {errors.email.length > 0 && (
                      <span className="alert-danger">
                        <FormattedMessage
                          id="account.error.email"
                          defaultMessage="E-mail is required"
                        />
                      </span>
                    )}
                  </div>
                  <ShippingAddress
                    state={this.state}
                    passOption={this.chosenAddress}
                    handleInputChange={this.handleInputChange}
                  />
                  <div className="card-body p-4">
                    <h3 className="checkout-card-title-fms card-title-fms">
                      <FormattedMessage
                        id="checkout.billing"
                        defaultMessage="Billing address"
                      />
                    </h3>
                    <span className="input-radio__body chakout-radio-titles h25">
                      <input
                        id="checkout-some-shiping"
                        type="radio"
                        className="input-radio__input"
                        name="checkout_billing_method"
                        checked={!this.state.newBillingAddress}
                        onChange={this.closeBillingAddress.bind(this)}
                      />

                      <span className="input-radio__circle mr-2 " />
                      <label
                        className="payment-methods__item-title payment-methods__item-title-fms shipping-methods__item-title-fms"
                        htmlFor="checkout-some-shiping"
                      >
                        <FormattedMessage
                          id="checkout-sameBilling"
                          defaultMessage="Same as shipping address"
                        />
                      </label>
                    </span>

                    <span className="input-radio__body chakout-radio-titles my-2">
                      <input
                        id="checkout-different-shiping"
                        type="radio"
                        className="input-radio__input"
                        name="checkout_billing_method"
                        onChange={this.openBillingAddress.bind(this)}
                      />

                      <span className="input-radio__circle mr-2  other-shipping-adress-circle" />
                      <label
                        className="payment-methods__item-title payment-methods__item-title-fms shipping-methods__item-title-fms"
                        htmlFor="checkout-different-shiping"
                      >
                        <FormattedMessage
                          id="checkout-billingDifferent"
                          defaultMessage="Use a different billing address"
                        />
                      </label>
                    </span>

                    {this.state.newBillingAddress ? (
                      <div className="d-flex flex-wrap pt-4 billing-fms">
                        <div className="form-group checkout-style col-12 col-md-6 px-2">
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
                            onChange={this.handleInputChange}
                            name="shipingStreet"
                          />
                        </div>

                        <div className="form-group checkout-style col-12 col-md-6 px-2">
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
                            onChange={this.handleInputChange}
                            name="shipingPhone"
                          />
                        </div>

                        <div className="form-group checkout-style col-12 col-md-6 px-2">
                          <TextField
                            id="outlined-apartment-input"
                            label={
                              <FormattedMessage
                                id="account.apartment"
                                defaultMessage="Apartment"
                              />
                            }
                            type="text"
                            autoComplete="current-apartment"
                            name="billingApartment"
                            onChange={this.handleInputChange}
                          />
                        </div>

                        <div className="form-group checkout-style col-12 col-md-6 px-2">
                          <TextField
                            id="outlined-city-input"
                            label={
                              <FormattedMessage
                                id="city"
                                defaultMessage="City"
                              />
                            }
                            type="text"
                            autoComplete="current-city"
                            onChange={this.handleInputChange}
                            name="billingCity"
                          />
                        </div>

                        <div className="form-group checkout-style col-12 col-md-6 px-2">
                          <TextField
                            id="outlined-city-input"
                            label={
                              <FormattedMessage
                                id="account.postal"
                                defaultMessage="Postal code"
                              />
                            }
                            type="text"
                            autoComplete="current-city"
                            onChange={this.handleInputChange}
                            name="billingPost"
                          />
                        </div>

                        {selectCountry}
                        {selectState}
                      </div>
                    ) : (
                      ""
                    )}

                    <ShippingMethod
                      setShipingMethod={this.setShipingMethod}
                      shippingMethod={this.state.shippingMethod}
                      locale={this.state.locale}
                      updateShippingValue={(value, rate) => {
                        this.setState({
                          shippingMethod: value,
                          shippingMethodRate: rate,
                        });
                      }}
                      country={this.state.country}
                    />
                    <div className="form-group checkout-style">
                      <label
                        htmlFor="checkout-comment"
                        className=" color-lightgray-comm-fms checkout-comment-margin "
                      >
                        <FormattedMessage
                          id="contact.comment"
                          defaultMessage="Comment"
                        />
                      </label>
                      <textarea
                        onChange={this.handleInputChange}
                        name="notes"
                        id="checkout-comment"
                        className="form-control checkout-comment"
                        rows="4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6 col-xl-5 mt-4 mt-lg-0">
                <div className="card mb-0 p-4">
                  <div className="card-body card-body-fms">
                    <h3 className="checkout-card-title">
                      <FormattedMessage
                        id="order"
                        defaultMessage="Order Summary"
                      />
                    </h3>

                    {this.renderCart()}
                    {this.renderPaymentsList()}

                    <div className="checkout__agree form-group mb-3 checkout-style">
                      <div className="form-check">
                        <span className="form-check-input input-check">
                          <span className="input-check__body">
                            <input
                              type="checkbox"
                              id="checkout-terms"
                              className="input-check__input"
                              onChange={() =>
                                this.handleInputChange({
                                  name: "checkbox",
                                  value: !this.state.checkbox,
                                })
                              }
                            />
                            <span className="input-check__box" />
                            <Check9x7Svg className="input-check__icon" />
                          </span>
                        </span>
                        <label
                          className="form-check-label"
                          htmlFor="checkout-terms"
                        >
                          <span className="agree-privacy-text">
                            <Link href="/page/privacy-policy" target="_blank">
                              <a className="agree-privacy-text">
                                <FormattedMessage
                                  id="privacy.police"
                                  defaultMessage="I agree with Privacy Policy"
                                />
                              </a>
                            </Link>
                          </span>
                          <span style={{ color: "red" }}>*</span>
                        </label>
                      </div>
                      {this.state.errors?.checkbox?.length > 0 && (
                        <span className="alert-danger privacy-fms">
                          <FormattedMessage
                            id="checkbox.error"
                            defaultMessage="This field is required"
                          />
                        </span>
                      )}
                    </div>

                    <button
                      onClick={this.handleSubmit}
                      type="submit"
                      style={{ width: "50%", fontSize: "18px" }}
                      className={
                        !this.state.loading
                          ? "btn btn-primary btn-primary-fms custon-btn-padding"
                          : "btn btn-primary  btn-primary-fms btn-loading"
                      }
                    >
                      <FormattedMessage id="pay" defaultMessage="Pay" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  cart: state.cart,
  locale: state.locale.code,
  token: state.cartToken,
  customer: state.customer,
  fbPixel: state.general.fbPixel,
});

const mapDispatchToProps = (dispatch) => ({
  cartUpdateData: (data) => dispatch(cartUpdateData(data)),
  cartRemoveAllItems: (data) => dispatch(cartRemoveAllItems(data)),
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(ShopPageCheckout)
);

import React, { useEffect } from "react";
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FormattedMessage } from "react-intl";
import { FailSvg, CreditCardStripe, CVV } from 'svg'
import Router from 'next/router'
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { apiUrlWithStore } from '../../helper'

function CheckoutFormStripe({ isCallStripePayment, callFunctionPay }) {
    const api_token = useSelector((state) => state.cartToken);
    const customer = useSelector((state) => state.customer);
    const stripe = useStripe();
    const elements = useElements();


    useEffect(() => {
        if (isCallStripePayment) {
            const payMoney = async () => {
                if (!stripe || !elements) {
                    return;
                }
                //get card value for elements.getElement()
                let elem = elements.getElement(CardNumberElement);
                elements.getElement(CardExpiryElement);
                elements.getElement(CardCvcElement);

                //create createPaymentMethod
                await stripe.createPaymentMethod({
                    type: 'card',
                    card: elem,
                    billing_details: { name: '' },
                }).then(response => {
                    //return Payment info
                    let id = response.paymentMethod.id
                    let obj = response.paymentMethod.object


                    //create stripe token
                    stripe.createToken(elem).then(res => {
                        if (res.token.id && id && obj) {
                            const requestOptions = {
                                method: "POST",
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    result: response,
                                    paymentMethodId: id,
                                    stripetoken: res.token.id,
                                    isSavedCard: false,
                                    token: customer.token || ''
                                }),
                            }

                            payCallbackForStripeHandler(requestOptions, elem)
                        }
                    }).catch(err => {
                        toast(
                            <span className="d-flex chek-fms">
                                <FailSvg />
                                <FormattedMessage
                                    id="type_valid_data"
                                    defaultMessage={err.message}
                                />
                            </span>,
                            {
                                hideProgressBar: true,
                            }
                        )
                        callFunctionPay()
                    })
                })
            };
            payMoney()
        }
    }, [isCallStripePayment])


    function payCallbackForStripeHandler(option, cardValue) {
        //save card API
        let data = fetch(apiUrlWithStore(`/api/checkout/save/card`), option)
            .then((card) => card.json())
            .then((cardResult) => {
                //check error message bacouse Stripe send bad request but don't work with catch {message is uniqe  for success status we haven't message} need to check
                if (cardResult.message) {
                    toast(
                        <span className="d-flex chek-fms">
                            <FailSvg />
                            <FormattedMessage
                                id="type_valid_data"
                                defaultMessage={cardResult.message}
                            />
                        </span>,
                        {
                            hideProgressBar: true,
                        }
                    )
                    callFunctionPay()
                    return false
                } else {
                    return cardResult
                }
            }).catch(err => {
                toast(
                    <span className="d-flex chek-fms">
                        <FailSvg />
                        <FormattedMessage
                            id="type_valid_data"
                            defaultMessage={err.message}
                        />
                    </span>,
                    {
                        hideProgressBar: true,
                    }
                )
                callFunctionPay()
            })


        //get token    
        data && data.then(() => {
            let tokenValue = customer.token ? customer.token : api_token.cartToken
            let tokenName = customer.token ? "token" : 'api_token'
            fetch(apiUrlWithStore(`/api/checkout/sendtoken?${tokenName}=${tokenValue}`))
                .then((token) => token.json())
                .then(tokenResult => {
                    stripe.confirmCardPayment(tokenResult.client_secret, {
                        payment_method: {
                            card: cardValue,
                            billing_details: { name: "" },
                        },
                    }).then(() => {
                        //dynamic name convert to send request
                        //charge and pay with stripe and after that redirect to thanks page
                        fetch(apiUrlWithStore(`/api/checkout/create/charge?${tokenName}=${tokenValue}`))
                            .then(card => card.json())
                            .then(redirect => {
                                callFunctionPay()
                                Router.push(redirect.data.route)
                            }).catch(err => {
                                toast(
                                    <span className="d-flex chek-fms">
                                        <FailSvg />
                                        <FormattedMessage
                                            id="type_valid_data"
                                            defaultMessage={err.message}
                                        />
                                    </span>,
                                    {
                                        hideProgressBar: true,
                                    }
                                )
                                callFunctionPay()
                            })
                    })
                }).catch(() => {
                    callFunctionPay()
                })
        })
    }

    return (
        <div className="stripe-container">
            <div className="stripe-container-header">
                <form className="stripe-container-header__form">
                    <div className="stripe-container-header__form-items">
                        <div className="stripe-container-header__form-items-card__number">
                            <label className="stripe-container-header__form-items-card__number-title">Card Number</label>
                            <CardNumberElement className="card" />
                            <CreditCardStripe className="credit_card" />
                        </div>
                        <div className="stripe-container-header__form-items-container">
                            <div className="stripe-container-header__form-items-card__cvv-block">
                                <label className="stripe-container-header__form-items-card__number-title">Expire Date</label>
                                <CardExpiryElement className="card" />
                            </div>
                            <div className="stripe-container-header__form-items-card__cvv">
                                <label className="stripe-container-header__form-items-card__number-title">CVC</label>
                                <CardCvcElement className="card card__cvv-element" />
                                <CVV className="credit_card" />
                            </div>
                        </div>
                    </div>
                </form >
            </div >
        </div >
    );
}

export default CheckoutFormStripe
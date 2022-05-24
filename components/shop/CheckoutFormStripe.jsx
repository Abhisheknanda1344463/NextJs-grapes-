import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import Router from 'next/router'
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { apiUrlWithStore } from '../../helper'

function CheckoutFormStripe({ isCallStripePayment, callFuntionPay }) {
    const [isPaymentLoading, setPaymentLoading] = useState(false);
    const api_token = useSelector((state) => state.cartToken);
    const stripe = useStripe();
    const elements = useElements();


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
            billing_details: {
                name: 'Jenny Rosen',
            },
        }).then(response => {
            //return Payment info
            let id = response.paymentMethod.id
            let obj = response.paymentMethod.object


            //create stripe token
            stripe.createToken(elem).then(res => {
                if (res.token.id && id && obj) {
                    setPaymentLoading(true);
                    const requestOptions = {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            result: response,
                            paymentMethodId: id,
                            stripetoken: res.token.id,
                            isSavedCard: false
                        }),
                    }

                    //save card API
                    let data = fetch(apiUrlWithStore(`/api/checkout/save/card`), requestOptions)
                        .then((card) => card.json())
                        .then((cardResult) => {
                            return cardResult
                        }).catch(err => console.log(err))

                    //get token    
                    data.then(() => {
                        fetch(apiUrlWithStore(`/api/checkout/sendtoken`))
                            .then((token) => token.json())
                            .then(tokenResult => {
                                stripe.confirmCardPayment(tokenResult.client_secret, {
                                    payment_method: {
                                        card: elem,
                                        billing_details: {
                                            name: "Faruq Yusuff",
                                        },
                                    },
                                }).then(() => {
                                    fetch(apiUrlWithStore(`/api/checkout/create/charge?api_token=${api_token.cartToken}`))
                                })
                            })
                    })
                }
            })
        })


        // const clientSecret = getClientSecret();
        // const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        //   payment_method: {
        //     card: elements.getElement(CardElement),
        //     billing_details: {
        //       name: "Faruq Yusuff",
        //     },
        //   },
        // });
    };

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
                    billing_details: {
                        name: 'Jenny Rosen',
                    },
                }).then(response => {
                    //return Payment info
                    let id = response.paymentMethod.id
                    let obj = response.paymentMethod.object


                    //create stripe token
                    stripe.createToken(elem).then(res => {
                        if (res.token.id && id && obj) {
                            setPaymentLoading(true);
                            const requestOptions = {
                                method: "POST",
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    result: response,
                                    paymentMethodId: id,
                                    stripetoken: res.token.id,
                                    isSavedCard: false
                                }),
                            }

                            //save card API
                            let data = fetch(apiUrlWithStore(`/api/checkout/save/card`), requestOptions)
                                .then((card) => card.json())
                                .then((cardResult) => {
                                    return cardResult
                                }).catch(err => console.log(err))

                            //get token    
                            data.then(() => {
                                fetch(apiUrlWithStore(`/api/checkout/sendtoken`))
                                    .then((token) => token.json())
                                    .then(tokenResult => {
                                        stripe.confirmCardPayment(tokenResult.client_secret, {
                                            payment_method: {
                                                card: elem,
                                                billing_details: {
                                                    name: "Faruq Yusuff",
                                                },
                                            },
                                        }).then(() => {
                                            fetch(apiUrlWithStore(`/api/checkout/create/charge?api_token=${api_token.cartToken}`))
                                                .then(card => card.json())
                                                .then(redirect => {
                                                    Router.push(redirect.data.route)
                                                }).catch(err => console.log(err))
                                        })
                                    })
                            })
                        }
                    })
                })


                // const clientSecret = getClientSecret();
                // const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                //   payment_method: {
                //     card: elements.getElement(CardElement),
                //     billing_details: {
                //       name: "Faruq Yusuff",
                //     },
                //   },
                // });
            };
            payMoney()
            // callFuntionPay(false)
        }
    }, [isCallStripePayment])
    return (
        <div className="stripe-container">
            <div className="stripe-container-header">
                <form className="stripe-container-header__form">
                    <div className="stripe-container-header__form-items">
                        <CardNumberElement className="card" />
                        <CardExpiryElement className="card" />
                        <CardCvcElement className="card" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CheckoutFormStripe
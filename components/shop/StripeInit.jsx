import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutFormStripe from './CheckoutFormStripe'

const StripeInit = ({ isCallStripePayment, callFunctionPay, publicKey }) => {

    const stripe = loadStripe(publicKey);
    return (
        <Elements stripe={stripe}>
            <CheckoutFormStripe
                isCallStripePayment={isCallStripePayment}
                callFunctionPay={callFunctionPay}
            />
        </Elements>
    );
};

export default StripeInit
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripe = loadStripe(
    "1111111111111111111111111111"
);
const StripeInit = () => {
    return (
        <Elements stripe={stripe}>
            111111111111111111111111111111111
        </Elements>
    );
};

export default StripeInit;
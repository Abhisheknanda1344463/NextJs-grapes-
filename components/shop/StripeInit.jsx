import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutFormStripe from './CheckoutFormStripe'
const stripe = loadStripe(
    "pk_test_51J5T7xHAP4qHhm1GnXCKxWIzHTFb5ZjtDoUBMV7M0C09Dhk48wH9sm7wEy80q3Rj2yf2qbNp5wUABT2dES8V7imr006WBSRkUb"
);
const StripeInit = ({ isCallStripePayment, callFuntionPay }) => {
    return (
        <Elements stripe={stripe}>
            <CheckoutFormStripe isCallStripePayment={isCallStripePayment} callFuntionPay={callFuntionPay} />
        </Elements>
    );
};

export default StripeInit
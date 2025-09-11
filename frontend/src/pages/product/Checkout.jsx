import React from "react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from "../../components/auth/user/payment-gatway/StripPaymentForm";
import { STRIPE_PUBLIC_KEY } from "../../components/Http";
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);


export default function Checkout() {


  


  return (
    <>
      <Elements stripe={stripePromise}>
        <StripePaymentForm/>
      </Elements>
    </>
  );
}

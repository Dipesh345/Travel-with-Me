import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51RhozD04WnqvgZDXXbFeCGU9sY4wPefwFc5jR4IFfOosH4BPJzxjiDhQWsfbUtpNTPN37VJLfLBJnh49XnbIh7OF00mpk0vAwJ");

const CheckoutForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!stripe || !elements) return;

    try {
      const token = localStorage.getItem("access_token");

      const { data } = await axios.post(
        "http://localhost:8000/api/payments/create-payment-intent/",
        { amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const clientSecret = data.clientSecret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        onError?.(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        const charges = result.paymentIntent.charges?.data || [];
        const chargeId = charges.length > 0 ? charges[0].id : result.paymentIntent.id;

        console.log("Using transaction_id:", chargeId);
        setSuccess("Payment successful!");
        onSuccess?.(chargeId);
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError(msg);
      onError?.(msg);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe || loading} style={{ marginTop: "20px" }}>
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: "10px" }}>{success}</div>}
    </form>
  );
};

const StripePayment = ({ amount, onSuccess, onError }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
  </Elements>
);

export default StripePayment;

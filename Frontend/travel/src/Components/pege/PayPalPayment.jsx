import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const PayPalPayment = ({ amount, onSuccess, onError }) => {
  const token = localStorage.getItem("access_token");

  // Handler for payment approval
  const handleApprove = async (data, actions) => {
    try {
      // Capture the order from PayPal
      const order = await actions.order.capture();
      const orderID = order.id;

      // Verify payment with backend
      const res = await axios.post(
        "http://localhost:8000/api/payments/verify-paypal-payment/",
        { orderID },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        onSuccess(orderID);
      } else {
        onError("Payment verification failed");
      }
    } catch (err) {
      console.error(err);
      onError("Something went wrong during PayPal payment");
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AZInNdZpQckkKZwFdW_i5x9tB1TGwJdASOt6sdOk3aDdIkWUWHIL_iuygTsVbK56OQ6vpAwsoCES9c-s",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount.toString() } }],
          });
        }}
        onApprove={handleApprove}
        onError={(err) => onError("PayPal payment error: " + err)}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;

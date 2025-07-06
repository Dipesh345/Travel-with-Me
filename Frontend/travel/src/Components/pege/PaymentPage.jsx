import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SiPaypal, SiCashapp, SiStripe } from "react-icons/si";

import StripePayment from "./StripePayment";
import PayPalPayment from "./PayPalPayment"; // Reusable PayPal component
import "../../styles/PaymentPage.css";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  // State
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paying, setPaying] = useState(false);

  // Fetch booking details
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/bookings/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBooking(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load booking.");
        setLoading(false);
      });
  }, [id, token]);

  // Calculate total amount
  const amount = booking ? booking.people * booking.tour__price : 0;

  // Manual cash payment handler
  const handleManualPayment = async () => {
    setPaying(true);
    try {
      await axios.put(
        `http://localhost:8000/api/bookings/${id}/pay/`,
        {
          payment_method: "cash",
          payment_amount: amount,
          transaction_id: null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Cash payment confirmed!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      toast.error("Payment failed: " + (err.response?.data?.detail || ""));
    } finally {
      setPaying(false);
    }
  };

  // Stripe payment success callback
  const onStripeSuccess = async (chargeId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/bookings/${id}/pay/`,
        {
          payment_method: "stripe",
          payment_amount: amount,
          transaction_id: chargeId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Stripe payment confirmed!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      toast.error("Stripe update failed: " + (err.response?.data?.detail || ""));
    }
  };

  // PayPal payment success callback
  const onPayPalSuccess = async (paypalTransactionId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/bookings/${id}/pay/`,
        {
          payment_method: "paypal",
          payment_amount: amount,
          transaction_id: paypalTransactionId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("PayPal payment confirmed!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      toast.error("PayPal update failed: " + (err.response?.data?.detail || ""));
    }
  };

  if (loading) return <div className="p-5 text-center">Loading booking...</div>;
  if (!booking) return <div className="p-5 text-center">Booking not found.</div>;

  // Payment options config
  const paymentOptions = [
    { id: "cash", label: "Cash", icon: <SiCashapp size={28} /> },
    { id: "paypal", label: "PayPal", icon: <SiPaypal size={28} /> },
    { id: "stripe", label: "Stripe", icon: <SiStripe size={28} /> },
  ];

  return (
    <div className="payment-container">
      <ToastContainer />
      <div className="payment-card">
        <h2 className="mb-4 text-center">💳 Payment for Booking</h2>

        <div className="info-group">
          <p><strong>Tour:</strong> {booking.tour__title}</p>
          <p><strong>People:</strong> {booking.people}</p>
          <p><strong>Total Amount:</strong> ${amount}</p>
        </div>

        <div className="form-group mb-3">
          <label className="mb-2 fw-semibold">Select Payment Method</label>
          <div className="payment-options">
            {paymentOptions.map(({ id, label, icon }) => (
              <div
                key={id}
                onClick={() => setPaymentMethod(id)}
                className={`payment-option ${paymentMethod === id ? "selected" : ""}`}
              >
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment method specific UI */}
        {paymentMethod === "cash" && (
          <>
            <div className="form-group mb-3">
              <small className="text-muted">Please pay cash on arrival.</small>
            </div>
            <button
              className="btn btn-success w-100 mt-2"
              onClick={handleManualPayment}
              disabled={paying}
            >
              {paying ? "Processing..." : "Confirm Cash Payment"}
            </button>
          </>
        )}

        {paymentMethod === "stripe" && (
          <StripePayment
            amount={amount}
            onSuccess={onStripeSuccess}
            onError={(msg) => toast.error(msg)}
          />
        )}

        {paymentMethod === "paypal" && (
          <PayPalPayment
            amount={amount}
            onSuccess={onPayPalSuccess}
            onError={(msg) => toast.error(msg)}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentPage;

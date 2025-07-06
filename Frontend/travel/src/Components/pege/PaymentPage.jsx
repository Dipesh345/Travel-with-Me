import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SiPaypal, SiCashapp, SiStripe } from "react-icons/si";
import StripePayment from "./StripePayment";
import "../../styles/PaymentPage.css";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [transactionId, setTransactionId] = useState("");
  const [paying, setPaying] = useState(false);

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

  const handlePayment = async () => {
    setPaying(true);
    try {
      await axios.put(
        `http://localhost:8000/api/bookings/${id}/pay/`,
        {
          payment_method: paymentMethod,
          payment_amount: booking.people * booking.tour__price,
          transaction_id: paymentMethod === "cash" ? null : transactionId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Payment successful!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      toast.error("Payment failed: " + (err.response?.data?.detail || ""));
    } finally {
      setPaying(false);
    }
  };

  const onStripeSuccess = async (chargeId) => {
    console.log("Stripe payment successful with charge ID:", chargeId);
    try {
      await axios.put(
        `http://localhost:8000/api/bookings/${id}/pay/`,
        {
          payment_method: "stripe",
          payment_amount: booking.people * booking.tour__price,
          transaction_id: chargeId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Stripe payment confirmed!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      toast.error("Failed to update payment status after Stripe payment: " +
        (err.response?.data?.detail || ""));
    }
  };

  if (loading) return <div className="p-5 text-center">Loading booking...</div>;
  if (!booking) return <div className="p-5 text-center">Booking not found.</div>;

  const amount = booking.people * booking.tour__price;

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
            {paymentOptions.map((method) => (
              <div
                key={method.id}
                onClick={() => {
                  setPaymentMethod(method.id);
                  setTransactionId("");
                }}
                className={`payment-option ${paymentMethod === method.id ? "selected" : ""}`}
              >
                {method.icon}
                <span>{method.label}</span>
              </div>
            ))}
          </div>
        </div>

        {(paymentMethod === "paypal" || paymentMethod === "cash") && (
          <div className="form-group mb-3">
            {paymentMethod === "paypal" && (
              <>
                <label className="fw-semibold">Transaction ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g., PAY123456789"
                  required
                />
              </>
            )}
            {paymentMethod === "cash" && (
              <small className="text-muted">Please pay cash on arrival. No transaction ID needed.</small>
            )}
          </div>
        )}

        {paymentMethod === "stripe" && (
          <StripePayment
            amount={amount}
            onSuccess={onStripeSuccess}
            onError={(msg) => toast.error(msg)}
          />
        )}

        {(paymentMethod === "cash" || paymentMethod === "paypal") && (
          <button
            className="btn btn-success w-100 mt-3"
            onClick={handlePayment}
            disabled={paying || (paymentMethod === "paypal" && !transactionId.trim())}
          >
            {paying ? "Processing..." : "Confirm Payment"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;

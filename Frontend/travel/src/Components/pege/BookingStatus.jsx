import React from "react";
import { Link } from "react-router-dom";

export default function BookingStatus({ booking }) {
  if (!booking) return null;

  return (
    <div style={{ marginTop: "1rem" }}>
      <p>
        Status: <strong>{booking.status}</strong>
      </p>
      <p>
        Payment Status: <strong>{booking.payment_status}</strong>
      </p>
      <p>
        Payment Method: <strong>{booking.payment_method || "N/A"}</strong>
      </p>
      <p>
        Payment Amount: <strong>${booking.payment_amount}</strong>
      </p>

      {/* Conditionally show payment button */}
      {booking.payment_status === "pending" && booking.status === "pending" && (
        <Link
          to={`/booking/${booking.id}/payment`}
          className="btn btn-sm btn-primary mt-2"
        >
          💳 Pay Now
        </Link>
      )}

      {booking.status === "partial_refunded" && (
        <p>
          Refunded Amount: <strong>${booking.refunded_amount}</strong>
        </p>
      )}

      {booking.refund_reason && (
        <p>Refund Reason: <em>{booking.refund_reason}</em></p>
      )}

      {booking.cancellation_reason && (
        <p>Cancellation Reason: <em>{booking.cancellation_reason}</em></p>
      )}
    </div>
  );
}

import React from "react";
import { FaSave, FaUndo } from "react-icons/fa";

export default function BookingModal({
  show,
  onClose,
  booking,
  tour,
  people,
  setPeople,
  saving,
  setSaving,
  newBookingData,
  setNewBookingData,
  onCreateBooking,
  onUpdateBooking,
}) {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">
              {booking && booking.status !== "cancelled" ? "Edit Booking" : "New Booking"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <div className="modal-body">
            {booking && booking.status !== "cancelled" ? (
              <form className="booking-form mt-4" onSubmit={onUpdateBooking}>
                <div className="form-group mb-3">
                  <label>Tour</label>
                  <input type="text" className="form-control" value={tour.title} readOnly />
                </div>

                <div className="form-group mb-3">
                  <label>Booking Date</label>
                  <input
                    type="text"
                    className="form-control"
                    value={booking.booking_date || ""}
                    readOnly
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Number of People</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Status</label>
                  <input type="text" className="form-control" value={booking.status} readOnly />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    disabled={saving}
                  >
                    <FaSave />
                    {saving ? "Saving..." : "Update Booking"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary d-flex align-items-center gap-2"
                    onClick={onClose}
                  >
                    <FaUndo />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form className="booking-form mt-4" onSubmit={onCreateBooking}>
                <div className="form-group mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newBookingData.name}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newBookingData.email}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={newBookingData.phone}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Number of People</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={newBookingData.people}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, people: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Booking Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newBookingData.booking_date}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, booking_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    disabled={saving}
                  >
                    <FaSave />
                    {saving ? "Saving..." : "Confirm Booking"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary d-flex align-items-center gap-2"
                    onClick={onClose}
                  >
                    <FaUndo />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

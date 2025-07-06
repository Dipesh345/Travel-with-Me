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
          <div className="modal-header border-0 pb-3">
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
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          <div className="modal-body pt-0">
            {booking && booking.status !== "cancelled" ? (
              <form className="booking-form mt-3" onSubmit={onUpdateBooking}>
                <div className="mb-3">
                  <label htmlFor="tourTitle" className="form-label">
                    Tour
                  </label>
                  <input
                    type="text"
                    id="tourTitle"
                    className="form-control"
                    value={tour.title}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="bookingDate" className="form-label">
                    Booking Date
                  </label>
                  <input
                    type="text"
                    id="bookingDate"
                    className="form-control"
                    value={booking.booking_date || ""}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="peopleInput" className="form-label">
                    Number of People
                  </label>
                  <input
                    type="number"
                    id="peopleInput"
                    className="form-control"
                    min="1"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="statusInput" className="form-label">
                    Status
                  </label>
                  <input
                    type="text"
                    id="statusInput"
                    className="form-control"
                    value={booking.status}
                    readOnly
                  />
                </div>

                <div className="d-flex gap-2 justify-content-end">
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
              <form className="booking-form mt-3" onSubmit={onCreateBooking}>
                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="nameInput"
                    className="form-control"
                    value={newBookingData.name}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="emailInput"
                    className="form-control"
                    value={newBookingData.email}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phoneInput" className="form-label">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phoneInput"
                    className="form-control"
                    value={newBookingData.phone}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="peopleNewInput" className="form-label">
                    Number of People
                  </label>
                  <input
                    type="number"
                    id="peopleNewInput"
                    className="form-control"
                    min="1"
                    value={newBookingData.people}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, people: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="bookingDateNewInput" className="form-label">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    id="bookingDateNewInput"
                    className="form-control"
                    value={newBookingData.booking_date}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, booking_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="d-flex gap-2 justify-content-end">
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

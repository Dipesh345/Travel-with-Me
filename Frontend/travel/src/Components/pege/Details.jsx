import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/details.css";
import sectionBanner from "../../assets/section-banner.webp";

import BookingModal from "./BookingModal";
import TourInfo from "./TourInfo";
import BookingStatus from "./BookingStatus";
import RatingStars from "./RatingStars";
import WeatherForecastInline from "./WeatherForecastInline";
import VisaCheckerInline from "./VisaCheckerInline";
import CurrencyConverterInline from "./CurrencyConverterInline";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const isAuthenticated = !!token;

  const [tour, setTour] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [booking, setBooking] = useState(null);
  const [people, setPeople] = useState(1);
  const [saving, setSaving] = useState(false);

  const [newBookingData, setNewBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    people: 1,
    booking_date: "",
  });

  const [rating, setRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(false);

  // Currency codes for converter
  const [fromCurrency, setFromCurrency] = useState(null); // User currency
  const [toCurrency, setToCurrency] = useState(null);     // Tour currency

  // Fetch currency from ISO country code using REST Countries API
  async function fetchCurrencyFromIso(isoCode) {
    if (!isoCode) return null;
    try {
      const res = await axios.get(`https://restcountries.com/v3.1/alpha/${isoCode}`);
      if (
        res.data &&
        Array.isArray(res.data) &&
        res.data[0] &&
        res.data[0].currencies
      ) {
        const currencies = res.data[0].currencies;
        const currencyCodes = Object.keys(currencies);
        if (currencyCodes.length > 0) {
          return currencyCodes[0];
        }
      }
    } catch (error) {
      console.error("Failed to fetch currency for ISO:", isoCode, error);
      return null;
    }
    return null;
  }

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    let userNationality = null;
    let tourCountryCode = null;

    // Fetch tour details
    axios
      .get(`http://localhost:8000/api/tours/${id}/`)
      .then(async (res) => {
        setTour(res.data);
        tourCountryCode = res.data.country_code;
        setLoading(false);

        if (userNationality) {
          const [fromCurr, toCurr] = await Promise.all([
            fetchCurrencyFromIso(userNationality),
            fetchCurrencyFromIso(tourCountryCode),
          ]);
          setFromCurrency(fromCurr || "USD");
          setToCurrency(toCurr || "USD");
        } else {
          setToCurrency((await fetchCurrencyFromIso(tourCountryCode)) || "USD");
        }
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });

    if (isAuthenticated) {
      // Fetch user profile
      axios
        .get("http://localhost:8000/api/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          setUser(res.data);
          userNationality = res.data.nationality;

          if (tourCountryCode) {
            const [fromCurr, toCurr] = await Promise.all([
              fetchCurrencyFromIso(userNationality),
              fetchCurrencyFromIso(tourCountryCode),
            ]);
            setFromCurrency(fromCurr || "USD");
            setToCurrency(toCurr || "USD");
          } else {
            setFromCurrency((await fetchCurrencyFromIso(userNationality)) || "USD");
          }
        })
        .catch(() => {
          setUser(null);
          setFromCurrency("USD");
        });

      // Fetch booking info
      axios
        .get(`http://localhost:8000/api/bookings/by-tour/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setBooking(res.data);
          setPeople(res.data.people || 1);
          setNewBookingData({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            people: res.data.people || 1,
            booking_date: res.data.booking_date || "",
          });
        })
        .catch(() => {
          setBooking(null);
          setPeople(1);
          setNewBookingData({
            name: user?.username || "",
            email: user?.email || "",
            phone: "",
            people: 1,
            booking_date: "",
          });
        });
    } else {
      setUser(null);
      setBooking(null);
      setPeople(1);
      setNewBookingData({
        name: "",
        email: "",
        phone: "",
        people: 1,
        booking_date: "",
      });
      setFromCurrency("USD");
      setToCurrency("USD");
    }
  }, [id, isAuthenticated, token]);

  // Booking update, create, cancel, and rating handlers (unchanged)
  const handleBookingUpdate = async (e) => {
    e.preventDefault();
    if (!booking) return;

    setSaving(true);
    try {
      await axios.patch(
        `http://localhost:8000/api/bookings/${booking.id}/`,
        { people: Number(people) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking updated successfully!");
      setShowModal(false);

      const res = await axios.get(`http://localhost:8000/api/bookings/by-tour/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(res.data);
      setPeople(res.data.people || 1);
    } catch {
      toast.error("Failed to update booking.");
    } finally {
      setSaving(false);
    }
  };

  const handleBookingCreate = async (e) => {
    e.preventDefault();

    setSaving(true);
    try {
      const res = await axios.post(
        `http://localhost:8000/api/bookings/create/`,
        {
          tour: id,
          name: newBookingData.name,
          email: newBookingData.email,
          phone: newBookingData.phone,
          people: Number(newBookingData.people),
          booking_date: newBookingData.booking_date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking created successfully!");
      setShowModal(false);
      navigate(`/booking/${res.data.id}/payment`);
    } catch {
      toast.error("Failed to create booking.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel your booking?")) return;

    try {
      await axios.patch(
        `http://localhost:8000/api/bookings/${booking.id}/`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking cancelled.");
      setBooking(null);
      setShowModal(false);
      setPeople(1);
      setNewBookingData({
        name: "",
        email: "",
        phone: "",
        people: 1,
        booking_date: "",
      });
    } catch {
      toast.error("Failed to cancel booking.");
    }
  };

  const handleRatingSubmit = async (value) => {
    if (!isAuthenticated) {
      alert("Please log in to rate this tour.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8000/api/tours/${id}/rate/`,
        { rating: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmittedRating(true);
      setRating(value);

      const res = await axios.get(`http://localhost:8000/api/tours/${id}/`);
      setTour(res.data);

      alert("Thank you for rating!");
    } catch {
      alert("You have already rated or you're not allowed to rate.");
    }
  };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (notFound || !tour) return <div className="text-center mt-5">Tour not found.</div>;

  return (
    <div className="details-page">
      <ToastContainer />

      <section className="details-banner">
        <img src={sectionBanner} alt="Details Banner" className="banner-image" />
        <div className="banner-content">
          <h1><span className="symbol">✦</span> Tour Details</h1>
          <div className="breadcrumb">
            <a href="/">Home</a> <span>➔</span> <span>Tour Details</span>
          </div>
        </div>
      </section>

      <section
        className="tour-image-section"
        style={{ textAlign: "center", margin: "2rem 0" }}
      >
        <img
          src={tour.image}
          alt={tour.title}
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
      </section>

      <section className="travel-info">
        <div
          className="info-header"
          style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}
        >
          <h2 className="package-title" style={{ flexGrow: 1 }}>
            {tour.title}
          </h2>

          {isAuthenticated && !showModal && (
            <>
              {(!booking || booking.status === "cancelled") && (
                <button className="book-btn" onClick={() => setShowModal(true)}>
                  Book Now
                </button>
              )}

              {booking && booking.status !== "cancelled" && (
                <>
                  <button className="book-btn" onClick={() => setShowModal(true)}>
                    Edit Booking
                  </button>
                  <button className="book-btn cancel-btn" onClick={handleCancelBooking}>
                    Cancel Booking
                  </button>
                </>
              )}
            </>
          )}
        </div>

        <BookingStatus booking={booking} />
        <TourInfo tour={tour} />

        <div style={{ marginTop: "1.5rem", fontSize: "1.1rem" }}>
          <strong>Average Rating:</strong>{" "}
          {tour.average_rating ? `${tour.average_rating} / 5` : "No ratings yet"}
        </div>

        {isAuthenticated && !submittedRating && (
          <RatingStars
            rating={rating}
            setRating={setRating}
            onSubmit={handleRatingSubmit}
            disabled={false}
          />
        )}

        {tour.activities && tour.activities.length > 0 && (
          <div className="tour-activities" style={{ marginTop: "2rem" }}>
            <h3>Activities Included:</h3>
            <ul style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              {tour.activities.map((activity, index) => (
                <li key={index} style={{ marginBottom: "0.5rem" }}>
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        )}

        <BookingModal
          show={showModal}
          onClose={() => setShowModal(false)}
          booking={booking}
          tour={tour}
          people={people}
          setPeople={setPeople}
          saving={saving}
          setSaving={setSaving}
          newBookingData={newBookingData}
          setNewBookingData={setNewBookingData}
          onCreateBooking={handleBookingCreate}
          onUpdateBooking={handleBookingUpdate}
        />

        {!isAuthenticated && (
          <div className="mt-4" style={{ color: "#d9534f" }}>
            Please <a href="/login">log in</a> to book and rate this tour.
          </div>
        )}
      </section>

      <section className="additional-info" style={{ padding: "2rem 0" }}>
        <div className="container">
          {tour && <WeatherForecastInline city={tour.city} />}

          <CurrencyConverterInline fromCurrency={fromCurrency} toCurrency={toCurrency} />

          {user &&
            tour &&
            user.nationality &&
            tour.country_code &&
            user.nationality.toUpperCase() !== tour.country_code.toUpperCase() && (
              <VisaCheckerInline
                nationality={user.nationality}
                destination={tour.country_code}
              />
            )}
        </div>
      </section>
    </div>
  );
}
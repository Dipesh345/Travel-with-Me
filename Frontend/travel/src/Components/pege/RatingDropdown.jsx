import React, { useState } from "react";
import axios from "axios";
import ReactStars from "react-rating-stars-component";

function RatingDropdown({ type, id, onRated }) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRatingSubmit = async () => {
    if (rating === 0) return; // Don't submit if no rating selected
    const token = localStorage.getItem("token");

    try {
      const endpoint =
        type === "blog"
          ? "/api/blog_app/rate/"
          : type === "destination"
          ? "/api/blog_app/rate_destination/"
          : "/api/blog_app/rate_hotel/";

      const body =
        type === "blog"
          ? { blog_id: id, rating }
          : type === "destination"
          ? { destination_id: id, rating }
          : { hotel_id: id, rating };

      await axios.post(endpoint, body, {
        headers: { Authorization: `Token ${token}` },
      });

      setSubmitted(true);
      if (onRated) onRated(); // Optional: refresh recommendations
    } catch (error) {
      console.error("Rating failed", error);
    }
  };

  return (
    <div className="rating-ui mt-2">
      <ReactStars
        count={5}
        onChange={(newRating) => setRating(newRating)}
        size={24}
        activeColor="#ffd700"
        value={rating}
        isHalf={false}
      />
      <button
        className="btn btn-sm btn-outline-primary mt-1"
        onClick={handleRatingSubmit}
      >
        Submit
      </button>
      {submitted && <p className="text-success mt-1">Thanks for rating!</p>}
    </div>
  );
}

export default RatingDropdown;

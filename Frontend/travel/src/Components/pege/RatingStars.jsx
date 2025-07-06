import React from "react";
import { FaStar } from "react-icons/fa";

export default function RatingStars({ rating, setRating, onSubmit, disabled }) {
  return (
    <div style={{ margin: "1rem 0" }}>
      <strong>Rate this tour:</strong>{" "}
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          onClick={() => !disabled && onSubmit(star)}
          style={{
            color: rating >= star ? "gold" : "#ccc",
            cursor: disabled ? "default" : "pointer",
            fontSize: "1.4rem",
            marginRight: "0.25rem",
          }}
          onMouseEnter={() => !disabled && setRating(star)}
          onMouseLeave={() => !disabled && setRating(0)}
        />
      ))}
    </div>
  );
}

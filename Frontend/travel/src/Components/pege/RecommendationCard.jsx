// RecommendationCard.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function RecommendationCard({ blogId, hotelId, destinationId, title, subtitle, tags }) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const token = localStorage.getItem('access_token');

  const handleRatingSubmit = () => {
    if (!rating) return;

    const data = { rating };
    if (blogId) data.blog_id = blogId;
    if (hotelId) data.hotel_id = hotelId;
    if (destinationId) data.destination_id = destinationId;

    axios.post(
      "http://127.0.0.1:8000/api/blog_app/rate/",
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => setSubmitted(true))
    .catch((err) => console.error("Rating error:", err));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      {tags && (
        <div className="mt-3 text-xs text-gray-500">
          Tags: {tags.split(',').map(tag => (
            <span key={tag} className="mr-3 inline-block">
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Rating section */}
      <div className="mt-4">
        <label className="text-sm text-gray-700">Your Rating:</label>
        <div className="flex items-center mt-1">
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="border px-2 py-1 rounded mr-2"
          >
            <option value={0}>Select</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} Star</option>
            ))}
          </select>
          <button
            onClick={handleRatingSubmit}
            className={`px-3 py-1 text-sm rounded ${
              submitted ? "bg-green-600 text-white" : "bg-blue-600 text-white"
            }`}
          >
            {submitted ? "Rated" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

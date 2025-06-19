import React, { useEffect, useState } from "react";
import sectionBanner from "../../assets/section-banner.webp";
import tours from "../../data/Toursdetails";
import "../../styles/Tours.css";
import { Link } from "react-router-dom";

export default function Tour() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedTripTypes, setSelectedTripTypes] = useState([]);
  const [ratings, setRatings] = useState({});

  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showAllTripTypes, setShowAllTripTypes] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const destinations = ["Canada", "Emirates", "Europe", "France", "USA", "India", "Nepal", "Italy", "Australia"];
  const activities = ["Boating", "City Tour", "Kayaking", "Niagara Falls"];
  const tripTypes = ["Luxury", "Premium", "Normal"];

  const handleCheckboxChange = (value, groupSetter, selectedGroup) => {
    if (selectedGroup.includes(value)) {
      groupSetter(selectedGroup.filter((item) => item !== value));
    } else {
      groupSetter([...selectedGroup, value]);
    }
  };

  const handleRating = (tourId, rating) => {
    setRatings({ ...ratings, [tourId]: rating });
  };

  const filteredTours = [...tours]
    .filter((tour) =>
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.country.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((tour) => selectedDestinations.length === 0 || selectedDestinations.includes(tour.country))
    .filter((tour) => selectedActivities.length === 0 || (
      tour.activities && selectedActivities.some((act) => tour.activities.includes(act))
    ))
    .filter((tour) => selectedTripTypes.length === 0 || selectedTripTypes.includes(tour.type))
    .sort((a, b) => {
      if (sortBy === "price") return parseInt(a.price) - parseInt(b.price);
      if (sortBy === "days") return parseInt(a.days) - parseInt(b.days);
      if (sortBy === "location") return a.country.localeCompare(b.country);
      return 0;
    });

  const clearAll = () => {
    setSearchQuery("");
    setSortBy("");
    setSelectedDestinations([]);
    setSelectedActivities([]);
    setSelectedTripTypes([]);
  };

  return (
    <div className="tour-page">
      <section className="tour-banner">
        <img src={sectionBanner} alt="Tour Banner" className="banner-image" />
        <div className="banner-content">
          <h1><span className="symbol">✦</span> Trip Result Search</h1>
          <div className="breadcrumb">
            <a href="/">Home</a> <span>➔</span> <span>Trip Result Search</span>
          </div>
        </div>
      </section>

      <section className="tour-results" style={{ display: "flex", gap: "1rem" }}>
        <div className="filter-panel" style={{ flex: "0 0 220px" }}>
          <h3>Criteria</h3>
          <button className="clear-btn" onClick={clearAll}>Clear All</button>

          <div className="filter-group">
            <h4>Destination</h4>
            {(showAllDestinations ? destinations : destinations.slice(0, 3)).map((place, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={selectedDestinations.includes(place)}
                  onChange={() => handleCheckboxChange(place, setSelectedDestinations, selectedDestinations)}
                />
                {place}
              </label>
            ))}
            {destinations.length > 3 && (
              <button className="show-more-btn" onClick={() => setShowAllDestinations(!showAllDestinations)}>
                {showAllDestinations ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          <div className="filter-group">
            <h4>Activities</h4>
            {(showAllActivities ? activities : activities.slice(0, 3)).map((activity, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={selectedActivities.includes(activity)}
                  onChange={() => handleCheckboxChange(activity, setSelectedActivities, selectedActivities)}
                />
                {activity}
              </label>
            ))}
            {activities.length > 3 && (
              <button className="show-more-btn" onClick={() => setShowAllActivities(!showAllActivities)}>
                {showAllActivities ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          <div className="filter-group">
            <h4>Trip Types</h4>
            {(showAllTripTypes ? tripTypes : tripTypes.slice(0, 3)).map((type, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={selectedTripTypes.includes(type)}
                  onChange={() => handleCheckboxChange(type, setSelectedTripTypes, selectedTripTypes)}
                />
                {type}
              </label>
            ))}
            {tripTypes.length > 3 && (
              <button className="show-more-btn" onClick={() => setShowAllTripTypes(!showAllTripTypes)}>
                {showAllTripTypes ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: "1 1 auto" }}>
          <div className="selected-filters" style={{ margin: "1rem 0", fontWeight: "500" }}>
            {selectedDestinations.length > 0 && <div><strong>Selected Destinations: </strong>{selectedDestinations.join(", ")}</div>}
            {selectedActivities.length > 0 && <div><strong>Selected Activities: </strong>{selectedActivities.join(", ")}</div>}
            {selectedTripTypes.length > 0 && <div><strong>Selected Trip Types: </strong>{selectedTripTypes.join(", ")}</div>}
          </div>

          <div className="tour-main-panel">
            <div className="search-sort-bar" style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-box"
                style={{ padding: "0.5rem", width: "60%", marginRight: "1rem" }}
              />
              <select
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: "0.5rem" }}
              >
                <option value="">Sort By</option>
                <option value="price">Price</option>
                <option value="days">Days</option>
                <option value="location">Location</option>
              </select>
            </div>

            <div className="tour-cards" style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))" }}>
              {filteredTours.map((tour) => (
                <div className="tour-card" key={tour.id} style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
                  <img
                    src={tour.image}
                    alt={tour.title}
                    style={{ width: "100%", height: "160px", objectFit: "cover" }}
                  />
                  <div className="tour-info" style={{ padding: "0.75rem" }}>
                    <span className="tour-country" style={{ fontWeight: "600", color: "#fff" }}>
                      {tour.country}
                    </span>
                    <h4 style={{ margin: "0.5rem 0" }}>{tour.title}</h4>
                    <div className="tour-meta" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>⏱ {tour.days} Days</span>
                      <Link to={`/tour/${tour.id}`} className="details-btn" style={{ textDecoration: "none", color: "#fff" }}>
                        View Details
                      </Link>
                    </div>
                    <div style={{ marginTop: "0.5rem" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => handleRating(tour.id, star)}
                          style={{ cursor: "pointer", color: ratings[tour.id] >= star ? "gold" : "#ccc", fontSize: "1.2rem" }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {filteredTours.length === 0 && <p>No tours found matching your criteria.</p>}
            </div>
          </div>
        </div>
      </section>

      <p className="text-center mt-5 fs-5 view-more-link">
        Want to see our Top Deals?{" "}
        <Link
          to={`/tour/${filteredTours[0]?.id || tours[0]?.id || 1}`}
          className="text-primary text-decoration-underline fw-semibold"
        >
          Click here to View More
        </Link>
      </p>
    </div>
  );
}

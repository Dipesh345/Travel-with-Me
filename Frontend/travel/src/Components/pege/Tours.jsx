import React, { useEffect, useState } from "react";
import sectionBanner from "../../assets/section-banner.webp";
import tours from "../../data/Toursdetails";
import "../../styles/Tours.css";

export default function Tour() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  // State for checkboxes
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedTripTypes, setSelectedTripTypes] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Options for filters
  const destinations = ["Canada", "Emirates", "Europe", "France", "USA", "India", "Nepal", "Italy", "Australia"];
  const activities = ["Boating", "City Tour", "Kayaking", "Niagara Falls"];
  const tripTypes = ["Luxury", "Premium", "Normal"];

  // Toggle checkbox handler
  const handleCheckboxChange = (value, groupSetter, selectedGroup) => {
    if (selectedGroup.includes(value)) {
      groupSetter(selectedGroup.filter((item) => item !== value));
    } else {
      groupSetter([...selectedGroup, value]);
    }
  };

  // Helper: count how many tours match a destination (excluding destination filter itself)
  const countDestination = (destination) => {
    return tours.filter(tour => {
      if (
        !tour.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !tour.country.toLowerCase().includes(searchQuery.toLowerCase())
      ) return false;

      // Other filters except destinations
      if (
        selectedActivities.length > 0 &&
        (!tour.activities || !selectedActivities.some(act => tour.activities.includes(act)))
      ) return false;

      if (
        selectedTripTypes.length > 0 &&
        !selectedTripTypes.includes(tour.type)
      ) return false;

      return tour.country === destination;
    }).length;
  };

  // Helper: count how many tours match an activity (excluding activities filter itself)
  const countActivity = (activity) => {
    return tours.filter(tour => {
      if (
        !tour.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !tour.country.toLowerCase().includes(searchQuery.toLowerCase())
      ) return false;

      // Other filters except activities
      if (
        selectedDestinations.length > 0 &&
        !selectedDestinations.includes(tour.country)
      ) return false;

      if (
        selectedTripTypes.length > 0 &&
        !selectedTripTypes.includes(tour.type)
      ) return false;

      return tour.activities && tour.activities.includes(activity);
    }).length;
  };

  // Helper: count how many tours match a trip type (excluding trip types filter itself)
  const countTripType = (type) => {
    return tours.filter(tour => {
      if (
        !tour.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !tour.country.toLowerCase().includes(searchQuery.toLowerCase())
      ) return false;

      // Other filters except trip types
      if (
        selectedDestinations.length > 0 &&
        !selectedDestinations.includes(tour.country)
      ) return false;

      if (
        selectedActivities.length > 0 &&
        (!tour.activities || !selectedActivities.some(act => tour.activities.includes(act)))
      ) return false;

      return tour.type === type;
    }).length;
  };

  // Filter tours based on search and selected filters
  let filteredTours = [...tours]
    .filter((tour) =>
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.country.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((tour) => {
      if (selectedDestinations.length > 0) {
        return selectedDestinations.includes(tour.country);
      }
      return true;
    })
    .filter((tour) => {
      if (selectedActivities.length > 0) {
        if (!tour.activities) return false;
        return selectedActivities.some((act) => tour.activities.includes(act));
      }
      return true;
    })
    .filter((tour) => {
      if (selectedTripTypes.length > 0) {
        return selectedTripTypes.includes(tour.type);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return parseInt(a.price) - parseInt(b.price);
      } else if (sortBy === "days") {
        return parseInt(a.days) - parseInt(b.days);
      } else if (sortBy === "location") {
        return a.country.localeCompare(b.country);
      }
      return 0;
    });

  // Clear all filters and search
  const clearAll = () => {
    setSearchQuery("");
    setSortBy("");
    setSelectedDestinations([]);
    setSelectedActivities([]);
    setSelectedTripTypes([]);
  };

  return (
    <div className="tour-page">
      {/* Banner */}
      <section className="tour-banner">
        <img src={sectionBanner} alt="Tour Banner" className="banner-image" />
        <div className="banner-content">
          <h1>
            <span className="symbol">✦</span> Trip Result Search
          </h1>
          <div className="breadcrumb">
            <a href="/">Home</a> <span>➔</span> <span>Trip Result Search</span>
          </div>
        </div>
      </section>

      {/* Filters + Cards */}
      <section className="tour-results">
        {/* Filter Panel */}
        <div className="filter-panel">
          <h3>Criteria</h3>
          <button className="clear-btn" onClick={clearAll}>
            Clear All
          </button>

          <div className="filter-group">
            <h4>Destination</h4>
            {destinations.map((place, i) => (
              <label
                key={i}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedDestinations.includes(place)}
                  onChange={() =>
                    handleCheckboxChange(
                      place,
                      setSelectedDestinations,
                      selectedDestinations
                    )
                  }
                />
                {place}
                <span className="count">{countDestination(place)}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Activities</h4>
            {activities.map((activity, i) => (
              <label
                key={i}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedActivities.includes(activity)}
                  onChange={() =>
                    handleCheckboxChange(
                      activity,
                      setSelectedActivities,
                      selectedActivities
                    )
                  }
                />
                {activity}
                <span className="count">{countActivity(activity)}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Trip Types</h4>
            {tripTypes.map((type, i) => (
              <label
                key={i}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedTripTypes.includes(type)}
                  onChange={() =>
                    handleCheckboxChange(type, setSelectedTripTypes, selectedTripTypes)
                  }
                />
                {type}
                <span className="count">{countTripType(type)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Show selected filters */}
        <div
          className="selected-filters"
          style={{ margin: "1rem 0", fontWeight: "500" }}
        >
          {selectedDestinations.length > 0 && (
            <div>
              <strong>Selected Destinations: </strong>{" "}
              {selectedDestinations.join(", ")}
            </div>
          )}
          {selectedActivities.length > 0 && (
            <div>
              <strong>Selected Activities: </strong> {selectedActivities.join(", ")}
            </div>
          )}
          {selectedTripTypes.length > 0 && (
            <div>
              <strong>Selected Trip Types: </strong> {selectedTripTypes.join(", ")}
            </div>
          )}
        </div>

        {/* Main Panel */}
        <div className="tour-main-panel">
          {/* Search & Sort */}
          <div className="search-sort-bar">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-box"
            />
            <select
              className="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="price">Price</option>
              <option value="days">Days</option>
              <option value="location">Location</option>
            </select>
          </div>

          {/* Cards */}
          <div className="tour-cards">
            {filteredTours.map((tour) => (
              <div className="tour-card" key={tour.id}>
                <img src={tour.image} alt={tour.title} />
                <div className="tour-info">
                  <span className="tour-country">{tour.country}</span>
                  <h4>{tour.title}</h4>
                  <div className="tour-meta">
                    <span>⏱ {tour.days}</span>
                    <button className="details-btn">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* View More Link outside tour-results section */}
      <p className="text-center mt-5 fs-5 view-more-link">
        Want to see our Top Deals?{" "}
        <a
          href="/about"
          className="text-primary text-decoration-underline fw-semibold"
        >
          Click here to View More
        </a>
      </p>
    </div>
  );
}

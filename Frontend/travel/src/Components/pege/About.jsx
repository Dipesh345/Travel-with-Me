// About.jsx
import React, { useState } from "react";
import "../../styles/AboutPage.css";
import pricingPlans from "../../data/pricing";
import sectionBanner from "../../assets/section-banner.webp";
import destinations from "../../data/AboutData.js";

// Experience Card Images
import experience1 from "../../assets/experience-image2.webp";
import experience2 from "../../assets/experience-image4.jpg";
import experience3 from "../../assets/experience-image3.webp";
import experience4 from "../../assets/experience-image1.webp";

// Avatar images
import user1 from "../../assets/tst-1.webp";
import user2 from "../../assets/tst-2.webp";
import user3 from "../../assets/tst-3.webp";

// Blog image
import blogImage from "../../assets/blog-2.webp";

export default function About() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
  });

  // Filter state
  const [filter, setFilter] = useState("all");

  const experienceCards = [
    { image: experience1, title: "America" },
    { image: experience2, title: "Africa" },
    { image: experience3, title: "Asia" },
    { image: experience4, title: "Europe" },
  ];

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPlan(null);
    setFormData({ name: "", email: "", date: "" });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Booking confirmed for ${selectedPlan.title}!\nName: ${formData.name}\nEmail: ${formData.email}\nDate: ${formData.date}`
    );
    closeModal();
  };

  // Filter pricing plans by category
  const filteredPlans =
    filter === "all"
      ? pricingPlans
      : pricingPlans.filter((plan) => plan.category === filter);

  return (
    <>
      <div className="about-page">
        {/* Banner */}
        <section className="about-banner">
          <img src={sectionBanner} alt="About Banner" className="banner-image" />
          <div className="banner-content">
            <h1>
              <span className="symbol">✦</span> About
            </h1>
            <div className="breadcrumb">
              <a href="/">Home</a> <span>➔</span> <span>About</span>
            </div>
          </div>
        </section>

        {/* Destinations */}
        <section className="destinations-section">
          <h3 className="section-subtitle">
            <span className="symbol">✦</span> Get to Know Us
          </h3>
          <h2 className="section-title">Our Destinations</h2>
          <div className="destination-cards">
            {destinations.map((place) => (
              <div key={place.id} className="destination-card">
                <img src={place.image} alt={place.title} />
                <h3>{place.title}</h3>
                <p>{place.description}</p>
                <p>
                  <strong>{place.days}</strong>
                </p>
                <p>
                  <strong>Price: {place.price}</strong>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Experience */}
        <section className="experience-section">
          <div className="experience-left">
            <h3>
              <span className="symbol">✦</span> Get To Know Us
            </h3>
            <h2>Get the Best Travel Experience</h2>

            <div className="experience-feature">
              <div className="icon-circle">✦</div>
              <div>
                <h4>Best of Hotel</h4>
                <p>
                  We don’t just work with concrete and steel. We are approachable, even with our highest standards.
                </p>
              </div>
            </div>

            <div className="experience-feature">
              <div className="icon-circle">✦</div>
              <div>
                <h4>Friendly Price</h4>
                <p>
                  We don’t just work with concrete and steel. We are approachable, even with our highest standards.
                </p>
              </div>
            </div>

            <div className="button-and-avatars">
              <button className="find-more-btn">Find Out More</button>
              <div className="team-icons">
                <img src={user1} alt="user1" />
                <img src={user2} alt="user2" />
                <img src={user3} alt="user3" />
                <div className="more-users">50+</div>
              </div>
            </div>
          </div>

          <div className="experience-right">
            {experienceCards.map((card, index) => (
              <div className="exp-card fade-in-up" key={index}>
                <img src={card.image} alt={card.title} />
                <div className="exp-card-title">{card.title}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Travel Place for You & Your Family Section */}
      <section className="intro-section">
        <div className="intro-container">
          <div className="intro-left">
            <h3 className="section-subtitle">
              <span className="symbol">✦</span> Get To Know Us
            </h3>
            <h2 className="intro-title">Travel place for You & your Family</h2>

            <div className="happy-customers-wrapper">
              <div className="happy-customers animated-slide-in">
                <img src={user1} alt="user1" />
                <img src={user2} alt="user2" />
                <img src={user3} alt="user3" />
                <div className="more-users">50+</div>
              </div>
              <div className="customer-badge bounce-in">
                <span>500K+</span> Happy Customers
              </div>
            </div>
          </div>

          <div className="intro-center">
            <img src={blogImage} alt="Travel Building" className="center-image" />
          </div>

          <div className="intro-right">
            <h4>Waiting for adventures? Don’t miss them</h4>
            <p className="intro-description">
              We don’t just work with concrete and steel. We are approachable, with even our highest concrete and steel. We work with people.
            </p>

            <div className="experience-badge">
              <span>🏆</span> We Have More than 10 years of experience
            </div>

            <ul className="intro-features">
              <li>✔ Generation Technology</li>
              <li>✔ Friendly Packages</li>
              <li>✔ Audio Performance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Section with Dropdown filter */}
      <section className="pricing-section">
        <h3 className="section-subtitle">✦ Get To Know Us</h3>
        <h2 className="section-title">Best Holiday Package</h2>

        {/* Dropdown Filter */}
        <div className="filter-dropdown-container">
          <label htmlFor="categoryFilter" className="filter-label">
            Filter by category:
          </label>
          <select
            id="categoryFilter"
            className="filter-dropdown"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="family">Family</option>
            <option value="couple">Couple</option>
            <option value="adventure">Adventure</option>
          </select>
        </div>

        <div className="pricing-cards">
          {filteredPlans.map((plan, index) => (
            <div className="pricing-card slide-in" key={index}>
              <div className="price">
                <span className="amount">{plan.price}</span>
                <span className="per-month">/month</span>
              </div>
              <div className="plan-title">{plan.title}</div>
              <p className="plan-description">{plan.description}</p>

              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>✔ {feature}</li>
                ))}
              </ul>

              <button className="get-started-btn" onClick={() => openModal(plan)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for Booking Form */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>

            <h2>Book Package: {selectedPlan.title}</h2>
            <p>Price: {selectedPlan.price}</p>

            <form className="booking-form" onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="date">Preferred Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />

              <button type="submit" className="submit-btn">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

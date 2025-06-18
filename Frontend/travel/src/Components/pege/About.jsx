import React from "react";
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
  const experienceCards = [
    { image: experience1, title: "America" },
    { image: experience2, title: "Africa" },
    { image: experience3, title: "Asia" },
    { image: experience4, title: "Europe" },
  ];

  return (
    <>
      <div className="about-page">
        {/* Banner */}
        <section className="about-banner">
          <img
            src={sectionBanner}
            alt="About Banner"
            className="banner-image"
          />
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
                  We don’t just work with concrete and steel. We are
                  approachable, even with our highest standards.
                </p>
              </div>
            </div>

            <div className="experience-feature">
              <div className="icon-circle">✦</div>
              <div>
                <h4>Friendly Price</h4>
                <p>
                  We don’t just work with concrete and steel. We are
                  approachable, even with our highest standards.
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
            <img
              src={blogImage}
              alt="Travel Building"
              className="center-image"
            />
          </div>

          <div className="intro-right">
            <h4>Waiting for adventures? Don’t miss them</h4>
            <p className="intro-description">
              We don’t just work with concrete and steel. We are approachable,
              with even our highest concrete and steel. We work with people.
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
       <section className="pricing-section">
      <h3 className="section-subtitle">✦ Get To Know Us</h3>
      <h2 className="section-title">Best Holiday Package</h2>

      <div className="pricing-cards">
        {pricingPlans.map((plan, index) => (
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

            <button className="get-started-btn">Get Started</button>
          </div>
        ))}
      </div>
    </section>
    <p className="text-center mt-5 fs-5">
            Want to see our Top Deals?{" "}
            <a
              href="#"
              className="text-primary text-decoration-underline fw-semibold"
            >
              Click here to View More
            </a>
          </p>
    </>
  );
}

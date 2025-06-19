import React, { useState } from "react";
import axios from "axios";
import sectionBanner from "../../assets/section-banner.webp";
import "../../styles/Contact.css";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import { toast } from "react-toastify";

export default function Contact() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const res = await axios.post("http://localhost:8000/api/contact/", formData);
      toast.success("Your message has been sent successfully!", { autoClose: 3000 });
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      toast.error("Failed to send message. Please try again.", { autoClose: 3000 });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Banner Section */}
      <section className="contact-banner">
        <img src={sectionBanner} alt="Contact Banner" className="banner-image" />
        <div className="banner-content">
          <h1>
            <span className="symbol">✦</span> Contacts
          </h1>
          <nav className="breadcrumb" aria-label="breadcrumb">
            <a href="/">Home</a> <span>➔</span> <span>contacts</span>
          </nav>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="contact-main">
        <div className="contact-left">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              required
              value={formData.full_name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              value={formData.subject}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Type your message..."
              rows="5"
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <button type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send Message Now"}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="contact-right">
          <h2>Contact Info</h2>

          <div className="info-box">
            <FaLocationDot className="info-icon" />
            <div>
              <h4>Office Address</h4>
              <p>
                Travel Agency Network
                <br />
                Balkumari, Lalitpur, Nepal
              </p>
            </div>
          </div>

          <div className="info-box">
            <FaPhone className="info-icon" />
            <div>
              <h4>Phone Number</h4>
              <p>+977-9862015811</p>
            </div>
          </div>

          <div className="info-box">
            <FaWhatsapp className="info-icon" />
            <div>
              <h4>WhatsApp</h4>
              <p>+977-9826925244</p>
            </div>
          </div>

          <div className="info-box">
            <FaEnvelope className="info-icon" />
            <div>
              <h4>Email</h4>
              <p>info@travelwithme.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="social-section">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-box facebook">
          <FaFacebookF className="icon" /> Facebook
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-box twitter">
          <FaTwitter className="icon" /> Twitter
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-box instagram">
          <FaInstagram className="icon" /> Instagram
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-box linkedin">
          <FaLinkedinIn className="icon" /> LinkedIn
        </a>
      </section>

      {/* Google Map Section */}
      <section className="map-section">
        <iframe
          title="Travel With Me Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0245331229285!2d85.31856317469353!3d27.71520622405665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1909b4e6d4cf%3A0x6fd51d32e4c6f404!2sKathmandu%20Durbar%20Square!5e0!3m2!1sen!2snp!4v1625483665873!5m2!1sen!2snp"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>
    </>
  );
}

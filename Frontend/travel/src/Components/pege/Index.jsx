import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { EffectFade, Navigation, Autoplay } from "swiper/modules";

import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";

import Destination from "./../../Destination.json";

import btnArrow from "./../../assets/btn-arrow.svg";
import plane from "./../../assets/plane.svg";

import about1 from './../../assets/about-image-1.webp'
import about2 from './../../assets/about-image-2.webp'
import checkImg from './../../assets/about-check.svg'
import tst1 from './../../assets/tst-1.webp'
import tst2 from './../../assets/tst-2.webp'
import tst3 from './../../assets/tst-3.webp'
import tst4 from './../../assets/tst-4.webp'
import abElement1 from './../../assets/about-element-1.webp'
import abElement2 from './../../assets/about-element-2.webp'
import abElement3 from './../../assets/about-element-3.webp'
import DiscoverImg1 from './../../assets/Discover-image-1.webp'
import DiscoverImg2 from './../../assets/Discover-image-2.webp'
import DiscoverImg3 from './../../assets/Discover-image-3.webp'
import DiscoverImg4 from './../../assets/Discover-image-4.webp'
import img1 from './../../assets/img1.jpg';
import img2 from './../../assets/img2.jpg';
import img3 from './../../assets/img3.jpg';
import testBG from './../../assets/test-bg.webp';
import quote from './../../assets/quote-left.png';
import testimg01 from './../../assets/tst-image-1.webp';
import testimg02 from './../../assets/tst-1.webp';
import testimg03 from './../../assets/tst-2.webp';
import testimg04 from './../../assets/tst-3.webp';
import testimg05 from './../../assets/tst-4.webp';

function Index() {
  return (
    <>
      {/* Hero Swiper */}
      <Swiper
        modules={[Navigation, EffectFade, Autoplay]}
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        autoplay={{ delay: 3000 }}
        effect="fade"
        navigation={{
          prevEl: ".swiper-prev",
          nextEl: ".swiper-next",
        }}
        className="overflow-hidden"
      >
        <SwiperSlide>
          <div className="hero hero1">
            <div className="hero-content">
              <h2>THE KINGDOM OF TEMPLES</h2>
              <h1>Holy land</h1>
              <button className="hero-btn">
                LEARN MORE <img src={btnArrow} alt="Arrow" />
              </button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="hero hero2">
            <div className="hero-content">
              <h2>THE KINGDOM OF MOUNTAINS</h2>
              <h1>The Celestial Summits</h1>
              <button className="hero-btn">
                LEARN MORE <img src={btnArrow} alt="Arrow" />
              </button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="hero hero3">
            <div className="hero-content">
              <h2>THE KINGDOM OF LAKES</h2>
              <h1>The Divine Mirrors</h1>
              <button className="hero-btn">
                LEARN MORE <img src={btnArrow} alt="Arrow" />
              </button>
            </div>
          </div>
        </SwiperSlide>

        <i className="bi bi-arrow-left-short swiper-btn swiper-prev"></i>
        <i className="bi bi-arrow-right-short swiper-btn swiper-next"></i>
      </Swiper>

      {/* Destinations */}
      <div className="destinations py-5 my-5">
        <div className="section-title text-center d-flex flex-column align-items-center justify-content-center gap-3">
          <span className="d-flex align-items-center gap-2">
            <img src={plane} className="img-fluid" alt="" />
            <span>Travel Destinations</span>
            <img src={plane} className="img-fluid" alt="" />
          </span>
          <h2>Top Destinations</h2>
          <p>
            Explore our top destinations voted by more than 10,000+ customers
            around the world
          </p>
        </div>
        <div className="destination-wrapper mt-5">
          <Splide
            hasTrack={false}
            options={{
              type: "loop",
              drag: "free",
              focus: "center",
              gap: 30,
              perPage: 3,
              arrows: true,
              pagination: false,
              breakpoints: {
                1199: { perPage: 3 },
                911: { perPage: 2 },
                767: { perPage: 2 },
                575: { perPage: 1 },
                0: { perPage: 1 },
              },
            }}
            extensions={{ AutoScroll }}
          >
            <SplideTrack>
              {Destination.map((dest) => (
                <SplideSlide key={dest.id}>
                  <div className="dest-card position-relative">
                    <div className="dest-img overflow-hidden rounded">
                      <img
                        src={dest.image}
                        onError={(e) => {
                          e.target.src = "/assets/destinations/fallback.webp";
                        }}
                        className="img-fluid w-100"
                        alt={dest.name}
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                      {/* Purple price badge at top-right */}
                      <span className="dest-price position-absolute top-0 end-0 bg-purple-600 text-white px-3 py-1 rounded-start fw-semibold">
                        {dest.price}
                      </span>
                    </div>

                    <div className="dest-content p-3">
                      <h5 className="mb-1">{dest.name}</h5>
                      <p className="text-muted mb-1">{dest.location}</p>

                      {/* ✅ Display description */}
                      {dest.description && (
                        <p className="text-secondary small mb-2">
                          {dest.description}
                        </p>
                      )}

                      <div className="dest-day d-flex align-items-center border-top pt-2 mt-2">
                        <i className="bi bi-send-fill me-2"></i>
                        <span>{dest.days}</span>
                      </div>
                    </div>
                  </div>
                </SplideSlide>
              ))}
            </SplideTrack>
          </Splide>

          <p className="text-center mt-5 fs-5">
            Want to see our Top Destinations.{" "}
            <a href="#">Click here to View More</a>
          </p>
        </div>
      </div>
      {/*About*/}  
      <div className="about py-5">
        <div className="container">
        <div className="row">
          <div className="col-lg-6 about-content-wrap">
          <div className="selection-title about-title">
          <div className="text-center d-flex flex-column align-items-start justify-content-start gap-3">
        <span className="d-flex align-items-center gap-2">
          <img src={plane} className="img-fluid" alt="" />
          <span>About Our Website</span>
          <img src={plane} className="img-fluid" alt="" />
        </span>
        <h2>Experience the World with our Website</h2>
        <p>Your gateway to curated travel experiences, 
          top destinations, and personalized adventures—designed 
          to inspire and simplify every journey.</p>
      </div>
    </div>
    <div className="row about-cols">
      <div className="col-md-6">
        <div className="about-col-img position-relative">
      <img src={about2} className="img-fluid" alt="" />
    </div>
</div>
    <div className="col-md-6 about-cols p-3">
      <h4 className="my-3"><img src={checkImg} className="img-fluid pe-2" alt=""/>Perfect Detailing</h4>
      <h4 className="my-3"><img src={checkImg} className="img-fluid pe-2" alt=""/>Complete Certification</h4>
      <h4 className="my-3"><img src={checkImg} className="img-fluid pe-2" alt=""/>Save Your Budget</h4>
      <h4 className="my-3"><img src={checkImg} className="img-fluid pe-2" alt=""/>Free Consultation</h4>
    </div>
</div>
    <div className="about-bottom mt-5 d-flex gap-4">
      <div className="btn-box">
        <button className="btn custom-btn1">
          Learn More
          <img src={btnArrow} className="img-fluid ms-2" alt=""/>
        </button>
      </div>
      <div className="about-col-box d-flex align-items-center">
        <div className="about-col-box-img">
          <img src={tst1} className="img-fluid" alt="" />
          <img src={tst2} className="img-fluid" alt=""/>
          <img src={tst3} className="img-fluid" alt=""/>
          <img src={tst4} className="img-fluid" alt=""/>
        </div>
        <p className="ms-4 m-0 fs-5">5.2+ Satisfied Clients</p>
      </div>
    </div>
    </div>
  <div className="col-lg-6 about-img">
    <img src={about1} className="img-fluid" alt="" />
    <img src={abElement1} className="img-fluid abElement-1 position-absolute" alt=""/>
    <img src={abElement2} className="img-fluid abElement-2 position-absolute" alt=""/>
    <img src={abElement3} className="img-fluid abElement-3 position-absolute" alt=""/>
  </div>
</div>
</div>
</div>
       {/*Discover*/}
      <div className="discover py-5">
  <div className="section-title">
    <div className="text-center d-flex flex-column align-items-center justify-content-center gap-3">
      <span className="d-flex align-items-center gap-2">
        <img src={plane} alt="" className="img-fluid" />
        <span>Travel Destinations</span>
        <img src={plane} alt="" className="img-fluid" />
      </span>
      <h2>Go where the wild things heal.</h2>
      <p>
        Our clients consistently share their positive experiences with us.
        From seamless travel arrangements to unforgettable memories, their
        feedback reflects our commitment to quality service and customer
        satisfaction.
      </p>
    </div>

    <div className="row px-5 my-5 gap-3 mx-0 align-items-center justify-content-center flex-nowrap overflow-auto">
      {/* Discover Cards */}
      <div className="col-lg-2 discover-card position-relative">
        <img src={DiscoverImg1} alt="" className="img-fluid" />
        <div className="discover-card-content position-absolute d-flex flex-column align-items-center justify-content-center text-center">
          <span>
            <i className="bi bi-geo-alt-fill"></i> Maldives
          </span>
          <h2 className="mt-4">
            Crystal waters, white sands, and ocean villas.
          </h2>
        </div>
      </div>

      <div className="col-lg-2 discover-card position-relative">
        <img src={DiscoverImg2} alt="" className="img-fluid" />
        <div className="discover-card-content position-absolute d-flex flex-column align-items-center justify-content-center text-center">
          <span>
            <i className="bi bi-geo-alt-fill"></i> Vietnam
          </span>
          <h2 className="mt-4">
            Lantern towns, green rice fields, and calm rivers.
          </h2>
        </div>
      </div>

      <div className="col-lg-2 discover-card position-relative">
        <img src={DiscoverImg3} alt="" className="img-fluid" />
        <div className="discover-card-content position-absolute d-flex flex-column align-items-center justify-content-center text-center">
          <span>
            <i className="bi bi-geo-alt-fill"></i> Dubai
          </span>
          <h2 className="mt-4">
            Skyscrapers, desert dunes, and luxury beaches.
          </h2>
        </div>
      </div>

      <div className="col-lg-2 discover-card position-relative">
        <img src={DiscoverImg4} alt="" className="img-fluid" />
        <div className="discover-card-content position-absolute d-flex flex-column align-items-center justify-content-center text-center">
          <span>
            <i className="bi bi-geo-alt-fill"></i> Nepal
          </span>
          <h2 className="mt-4">
            Snowy peaks, ancient temples, and quiet trails.
          </h2>
        </div>
      </div>
    </div>

    {/* Centered View More Text */}
    <div className="text-center mt-5 fs-5">
      Want to see our Top Destinations?{' '}
      <a href="#" className="text-decoration-underline">Click here to View More</a>
    </div>
  </div>
</div>
     {/*offers*/}
     <div className="special-offer-animated">
  <h2 className="offer-animation-text">Get Special Offers</h2>
</div>

    <Swiper
  modules={[Navigation, EffectFade, Autoplay]}
  slidesPerView={1}
  spaceBetween={30}
  loop={true}
  autoplay={{ delay: 3000 }}
  effect="fade"
  navigation={{
    prevEl: ".swiper-prev",
    nextEl: ".swiper-next",
  }}
  className="overflow-hidden"
>
  {/* Offer Slide 1 */}
  <SwiperSlide>
    <div className="custom-hero-slide" style={{ backgroundImage: `url(${img1})` }}>
            <div className="custom-offer-box">
              <p className="custom-offer-label">❖ 15% OFFER ❖</p>
              <h1 className="custom-main-heading">Majestic Taj Retreat</h1>
              <p className="custom-subtext">
                Majestic Taj Retreat
              </p>
              <div className="custom-location-price">
                <p className="location-text">📍 Location: Agra, India</p>
                <p className="price-text">💸 Price after discount: $550</p>
              </div>
              <button className="custom-learn-btn">
                LEARN MORE <img src={btnArrow} alt="Arrow" />
              </button>
              <div className="custom-discount">
                <span className="custom-discount-number">15</span>
                <span className="custom-discount-percent">%</span>
                <span className="custom-discount-off">OFF</span>
              </div>
            </div>
          </div>
  </SwiperSlide>

  {/* Offer Slide 2 */}
  <SwiperSlide>
    <div className="custom-hero-slide" style={{ backgroundImage: `url(${img2})` }}>
            <div className="custom-offer-box">
              <p className="custom-offer-label">❖ 30% OFFER ❖</p>
              <h1 className="custom-main-heading">Mystic Mustang Escape</h1>
              <p className="custom-subtext">
                Uncover the hidden kingdom beyond the Himalayas — book now for a once-in-a-lifetime adventure!
              </p>
              <div className="custom-location-price">
                <p className="location-text">📍 Location: Upper Mustang, Nepal</p>
                <p className="price-text">💸 Price after discount: $450</p>
              </div>
              <button className="custom-learn-btn">
                LEARN MORE <img src={btnArrow} alt="Arrow" />
              </button>
              <div className="custom-discount">
                <span className="custom-discount-number">30</span>
                <span className="custom-discount-percent">%</span>
                <span className="custom-discount-off">OFF</span>
              </div>
            </div>
          </div>
  </SwiperSlide>

  {/* Offer Slide 3 */}
  <SwiperSlide>
   <div className="custom-hero-slide" style={{ backgroundImage: `url(${img3})` }}>
            <div className="custom-offer-box">
              <p className="custom-offer-label">❖ 30% OFFER ❖</p>
              <h1 className="custom-main-heading">Timeless Pyramid Expedition</h1>
              <p className="custom-subtext">
                Witness the wonders of the ancient world — book now and step back in time!
              </p>
              <div className="custom-location-price">
                <p className="location-text">📍 Location: Giza, Egypt</p>
                <p className="price-text">💸 Price after discount: $800</p>
              </div>
              <button className="custom-learn-btn">
                LEARN MORE <img src={btnArrow} alt="Arrow" />
              </button>
              <div className="custom-discount">
                <span className="custom-discount-number">30</span>
                <span className="custom-discount-percent">%</span>
                <span className="custom-discount-off">OFF</span>
              </div>
            </div>
          </div>
  </SwiperSlide>

  <i className="bi bi-arrow-left-short swiper-btn swiper-prev"></i>
  <i className="bi bi-arrow-right-short swiper-btn swiper-next"></i>
</Swiper>
  <p className="text-center mt-5 fs-5">
            Discover Our Discount Offers.{" "}
            <a href="#">Click here to View More</a>
          </p>

{/* Testimonials */}
<div className="testimonial py-5 position-relative">
  <img src={testBG} alt="img-testimonials" className="img-fluid test-img" />
  <img src={testBG} alt="img-testimonials" className="img-fluid test-img-2" />

  <div className="section-title test-title text-center">
    <span className="d-flex align-items-center justify-content-center gap-2">
      <img src={plane} alt="left-plane" className="img-fluid" />
      <span>Testimonials</span>
      <img src={plane} alt="right-plane" className="img-fluid" />
    </span>
    <h2>What Our Clients Say’s</h2>
    <p className="mt-2">We take pride in delivering exceptional experiences. 
      Here's what our clients have to say about their journeys with us — real feedback from real people.</p>
  </div>

  <div className="container mt-5">
    <div className="row">
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        loop={true}
        className="test-Swiper"
      >
        <SwiperSlide>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="testimonial-img d-flex align-items-center justify-content-center">
                <img src={testimg01} alt="testimonial-img" className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="test-content">
                <img src={quote} alt="quote" className="img-fluid test-content-img mb-3" />
                <p className="test-pare">
                  "From start to finish, the experience was seamless. The attention to detail and professionalism truly exceeded my expectations. I would highly recommend their service to anyone looking for quality and care."
                </p>
                <div className="test-stars mb-3">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <div className="test-user d-flex align-items-center gap-3 mt-3">
                  <img src={testimg02} alt="Saroj Upreti" className="img-fluid custom-img-size" />
                  <div className="test-user-info">
                    <h3 className="m-0">Saroj Upreti</h3>
                    <p className="m-0">Senior Developer at NCIT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="testimonial-img d-flex align-items-center justify-content-center">
                <img src={testimg01} alt="testimonial-img" className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="test-content">
                <img src={quote} alt="quote" className="img-fluid test-content-img mb-3" />
                <p className="test-pare">
                    "An absolute pleasure working with this team. They listened carefully to our needs and delivered above and beyond. Their dedication to client satisfaction really sets them apart."
                </p>
                <div className="test-stars mb-3">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <div className="test-user d-flex align-items-center gap-3 mt-3">
                  <img src={testimg03} alt="Sahil Shrestha" className="img-fluid custom-img-size" />
                  <div className="test-user-info">
                    <h3 className="m-0">Sahil Shrestha</h3>
                    <p className="m-0">Senior Developer at NCIT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="testimonial-img d-flex align-items-center justify-content-center">
                <img src={testimg01} alt="testimonial-img" className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="test-content">
                <img src={quote} alt="quote" className="img-fluid test-content-img mb-3" />
                <p className="test-pare">
                    "Efficient, friendly, and incredibly responsive — I felt heard and valued throughout the entire process. They made everything so easy and enjoyable."                </p>
                <div className="test-stars mb-3">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <div className="test-user d-flex align-items-center gap-3 mt-3">
                  <img src={testimg04} alt="Prateek Thapa" className="img-fluid custom-img-size" />
                  <div className="test-user-info">
                    <h3 className="m-0">Prateek Thapa</h3>
                    <p className="m-0">Senior Developer at G-pay</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="testimonial-img d-flex align-items-center justify-content-center">
                <img src={testimg01} alt="testimonial-img" className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="test-content">
                <img src={quote} alt="quote" className="img-fluid test-content-img mb-3" />
                <p className="test-pare">
                    "I’ve collaborated with many teams before, but this one truly stood out. Their creativity and commitment brought our ideas to life better than we imagined."                </p>
                <div className="test-stars mb-3">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <div className="test-user d-flex align-items-center gap-3 mt-3">
                  <img src={testimg05} alt="Krishna Sapkota" className="img-fluid custom-img-size" />
                  <div className="test-user-info">
                    <h3 className="m-0">Krishna Sapkota</h3>
                    <p className="m-0">Mobile App Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</div>


    </>
  );
}

export default Index;
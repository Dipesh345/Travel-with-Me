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
            Beautiful tropical beach sea with umbrella chair around swimming pool
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
            Beautiful tropical beach sea with umbrella chair around swimming pool
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
            Beautiful tropical beach sea with umbrella chair around swimming pool
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
            Beautiful tropical beach sea with umbrella chair around swimming pool
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
     
    </>
  );
}

export default Index;
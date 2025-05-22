import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import { EffectFade, Navigation, Autoplay } from 'swiper/modules'; // ✅ Added Autoplay

import btnArrow from './../../assets/btn-arrow.svg';

function Index() {
  return (
    <>
      <Swiper
        modules={[Navigation, EffectFade, Autoplay]} // ✅ Included Autoplay module here
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        autoplay={{ delay: 3000 }}
        effect="fade"
        navigation={{
          prevEl: '.swiper-prev',
          nextEl: '.swiper-next',
        }}
        className="overflow-hidden"
      >
        <SwiperSlide>
          <div className="hero hero1 d-flex flex-column justify-content-center align-items-center">
            <div className="hero-content w-100 d-flex flex-column justify-content-center align-items-center">
              <h2 className="text-white">THE KINGDOM OF TEMPLES</h2>
              <h1 className="text-white">Holy land</h1>
              <button className="bt text-white hero-btn mt-5">
                LEARN MORE <img src={btnArrow} className="img-fluid" alt="Arrow" />
              </button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="hero hero2 d-flex flex-column justify-content-center align-items-center">
            <div className="hero-content w-100 d-flex flex-column justify-content-center align-items-center">
              <h2 className="text-white-900">THE KINGDOM OF Mountains</h2>
              <h1 className="text-white-900">The Celestial Summits</h1>
              <button className="bt text-white hero-btn mt-5">
                LEARN MORE <img src={btnArrow} className="img-fluid" alt="Arrow" />
              </button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="hero hero3 d-flex flex-column justify-content-center align-items-center">
            <div className="hero-content w-100 d-flex flex-column justify-content-center align-items-center">
              <h2 className="text-white">THE KINGDOM OF lakes</h2>
              <h1 className="text-white">The Divine Mirrors</h1>
              <button className="bt text-white hero-btn mt-5">
                LEARN MORE <img src={btnArrow} className="img-fluid" alt="Arrow" />
              </button>
            </div>
          </div>
        </SwiperSlide>
        <i className="bi bi-arrow-left-short swiper-btn swiper-prev"></i>
         <i className="bi bi-arrow-right-short swiper-btn swiper-next"></i>
      </Swiper>
    </>
  );
}

export default Index;

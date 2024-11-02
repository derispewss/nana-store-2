import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import { banner, banner2 } from '../assets/images'
import 'swiper/css';

const MainContent = ({ data }) => {
    const images = [
        {
            id: 1,
            imageUrl : banner,
        },
        {
            id: 2,
            imageUrl : banner2,
        }
    ]
    return (
        <div className="w-full bg-skyblue">
            <Navbar/>
            <div className="md:w-full md:px-24 px-4 mx-auto mt-10">
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{ delay: 2000 }}
                    loop={true}
                    className="sm:h-120 lg:h-120 w-full">
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img src={image.imageUrl} alt={`Slide ${index}`} className="w-full h-auto rounded-lg" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <HeroSection/>
            <Footer data={data}/>
        </div>
    )
}

export default MainContent;
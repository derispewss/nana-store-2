import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import axios from 'axios';
import 'swiper/css';

const MainContent = ({ data }) => {
    const [images, setImages] = useState([]);
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('https://api.storenana.my.id/get-banners');
                setImages(response.data);
            } catch (error) {
                console.error('Gagal mendapatkan daftar gambar:', error);
            }
        };
        fetchImages();
    }, []);
    return (
        <div className="w-full bg-cream">
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
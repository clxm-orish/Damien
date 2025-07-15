'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { client } from '../src/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// === Sanity image builder ===
const builder = imageUrlBuilder(client);
const urlFor = (source: SanityImageSource) => builder.image(source);

// === Requête GROQ pour récupérer les images par slug ===
const IMAGES_QUERY = `*[_type == "images" && slug.current == $slug][0]{
  title,
  gallery
}`;

export default function HomePage() {
  const swiperRef = useRef<{ slideNext: () => void; slidePrev: () => void } | null>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await client.fetch(IMAGES_QUERY, { slug: "home" });
        const urls = data?.gallery?.map((img: SanityImageSource) => urlFor(img).width(1600).url()) || [];
        setImages(urls);
      } catch (error) {
        console.error('Erreur lors du fetch des images Sanity:', error);
      }
    };

    fetchImages();
  }, []);

  const goNext = () => swiperRef.current?.slideNext();
  const goPrev = () => swiperRef.current?.slidePrev();

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-full h-full md:p-8">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          autoplay={{ delay: 5000 }}
          loop
          speed={800}
          spaceBetween={30}
          slidesPerView={1}
          className="overflow-hidden flex h-[65vh] sm:h-[700px] w-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index} className="flex justify-center items-center h-full">
              <a href="/portfolio" className="relative w-full h-full block">
                <Image
                  src={src}
                  alt={`slide ${index}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons */}
        <div className="flex justify-end ">
          <button
            onClick={goPrev}
            className='flex justify-center items-center w-10 h-10 text-white bg-[#2B2B2B] py-1 px-2 font-bold m-2 cursor-pointer hover:bg-[#1a1a1a]'
          >
            <ArrowLeftIcon width={30} height={30} />
          </button>
          <button
            onClick={goNext}
            className='flex justify-center items-center w-10 h-10 text-white bg-[#2B2B2B] py-1 px-2 font-bold m-2 cursor-pointer hover:bg-[#1a1a1a]'
          >
            <ArrowRightIcon width={30} height={30} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

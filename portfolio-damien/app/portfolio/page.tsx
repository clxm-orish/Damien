'use client';

import { useRef, useEffect, useState } from 'react';
import { client } from "../../src/sanity/client";
import { defineQuery } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { motion } from "framer-motion";
import { usePageTransition } from '../../hooks/PageTransitionProvider';

const { projectId, dataset } = client.config();
const urlFor = (source: any) =>
    projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null;

const EVENTS_QUERY = defineQuery(`*[_type == "event"] | order(_createdAt desc) {
  title,
  slug,
  image,
  description
}`);

export default function PortfolioPage() {
    const { startTransition, endPageLoad } = usePageTransition();
    const swiperRef = useRef<any>(null);
    const [events, setEvents] = useState<any[]>([]);

    const goNext = () => {
        if (swiperRef.current) swiperRef.current.slideNext();
    };

    const goPrev = () => {
        if (swiperRef.current) swiperRef.current.slidePrev();
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const res = await client.fetch(EVENTS_QUERY);
            const formatted = res.map((e: any) => ({
                ...e,
                imageUrl: urlFor(e.image)?.width(1600).url(),
            }));
            setEvents(formatted);
        };
        fetchEvents();
    }, []);

    // 🔥 Quand les événements sont chargés, on ferme le rideau
    useEffect(() => {
        if (events.length) {
            endPageLoad();
        }
    }, [events]);

    if (!events.length) return null;

    return (
        <div className="w-full h-full m-8 flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, y: 70 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="w-full max-w-5xl h-[1000px] rounded-lg overflow-hidden flex">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, EffectFade]}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        fadeEffect={{ crossFade: true }}
                        spaceBetween={30}
                        slidesPerView={1}
                        speed={800}
                        loop
                        className="w-full h-full"
                    >
                        {events.map((event, index) => (
                            <SwiperSlide
                                key={index}
                                className="flex flex-col items-center justify-center text-center p-6 w-full h-full"
                            >
                                <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                                    <div className="relative w-full items-center justify-center overflow-hidden">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={goPrev}
                                            className="absolute top-1/2 left-0 z-10 h-16 w-10 p-2 bg-black text-white opacity-60 hover:opacity-80 -translate-y-1/2 cursor-pointer"
                                        >
                                            <ChevronLeftIcon className="h-6 w-6" />
                                        </Button>

                                        {event.imageUrl && (
                                            <img
                                                src={event.imageUrl}
                                                alt={event.title}
                                                className="object-cover max-h-[500px] w-full"
                                            />
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={goNext}
                                            className="absolute top-1/2 right-0 z-10 h-16 w-10 p-2 bg-black text-white opacity-60 hover:opacity-80 -translate-y-1/2 cursor-pointer"
                                        >
                                            <ChevronRightIcon className="h-6 w-6" />
                                        </Button>
                                    </div>

                                    <h1 className="text-black text-2xl font-semibold text-left self-start mt-4">
                                        {event.title}
                                    </h1>

                                    <article className="text-gray-700 self-start mt-2 text-left">
                                        <PortableText value={event.description} />
                                    </article>

                                    <div className="w-full flex justify-end pt-4">
                                        <Button
                                            onClick={() => startTransition(`/portfolio/gallerie/gallery-${event.slug.current}`)}
                                            className="bg-[#2B2B2B] hover:bg-[#1a1a1a] text-white cursor-pointer"
                                        >
                                            <span className="flex items-center space-x-2">
                                                <span>Photos</span>
                                                <ArrowRightIcon className="ml-2 h-4 w-4" />
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </motion.div>
        </div>
    );
}

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
import Image from 'next/image';
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { TypedObject } from 'sanity';

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null;

const EVENTS_QUERY = defineQuery(`*[_type == "event"] | order(_createdAt desc) {
  title,
  slug,
  image,
  description
}`);

export default function PortfolioPage() {
    const { startTransition, endPageLoad } = usePageTransition();
    const swiperRef = useRef<{ slideNext: () => void; slidePrev: () => void } | null>(null);
    const [events, setEvents] = useState<
        {
            title: string;
            slug: { current: string };
            image: SanityImageSource;
            description: TypedObject;
            imageUrl?: string;
        }[]
    >([]);

    const goNext = () => swiperRef.current?.slideNext();
    const goPrev = () => swiperRef.current?.slidePrev();

    interface Event {
        title: string;
        slug: { current: string };
        image: SanityImageSource;
        description: TypedObject;
      }
      
      useEffect(() => {
        const fetchEvents = async () => {
          const res: Event[] = await client.fetch(EVENTS_QUERY);
          const formatted = res.map((e) => ({
            ...e,
            imageUrl: urlFor(e.image)?.width(1600).url(),
          }));
          setEvents(formatted);
        };
        fetchEvents();
      }, []);

    useEffect(() => {
        if (events.length) endPageLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [events]);

    if (!events.length) return null;

    return (
        <div className="md:w-full md:h-full md:m-8 md:flex md:justify-center md:items-center">
            <motion.div
                initial={{ opacity: 0, y: 70 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Swiper desktop */}
                <div className="hidden md:flex w-full max-w-5xl h-[1000px] rounded-lg overflow-hidden">
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
                            <SwiperSlide key={index} className="flex flex-col items-center justify-center text-center p-6 w-full h-full">
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
                                            <Image
                                                src={event.imageUrl}
                                                alt={event.title}
                                                width={1600}
                                                height={900}
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

                {/* Liste en colonne sur mobile */}
                <div className="block md:hidden flex flex-col space-y-4">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="flex flex-row bg-white  shadow p-4"
                        >
                            {event.imageUrl && (
                                <Image
                                    src={event.imageUrl}
                                    alt={event.title}
                                    width={160}
                                    height={120}
                                    className=" object-cover w-1/4 mi'h-full"
                                />
                            )}

                            <div className=" w-3/4 ml-4 flex flex-col justify-between">
                                <h2 className="text-lg font-semibold">{event.title}</h2>
                                <div className="text-gray-600 text-sm line-clamp-2">
                                    <PortableText value={event.description} />
                                </div>
                                <Button
                                    onClick={() => startTransition(`/portfolio/gallerie/gallery-${event.slug.current}`)}
                                    className="mt-2 bg-[#2B2B2B] hover:bg-[#1a1a1a] text-white py-1 px-2 text-xs"
                                >
                                    Photos →
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

            </motion.div>
        </div>
    );
}

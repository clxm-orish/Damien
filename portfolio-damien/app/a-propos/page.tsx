'use client';

import { useEffect, useState } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '../../src/sanity/client';
import { PortableText } from '@portabletext/react';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageTransition } from '../../hooks/PageTransitionProvider';
import Image from 'next/image';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { TypedObject } from 'sanity';

const builder = imageUrlBuilder(client);
const urlFor = (source: SanityImageSource) => builder.image(source);

interface AboutData {
  title: string;
  image: SanityImageSource;
  description: TypedObject[];
}

const ABOUT_QUERY = `*[_type == "a-propos" && slug.current == $slug][0]{
  title,
  image,
  description
}`;

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const { startTransition } = usePageTransition();

  useEffect(() => {
    const fetchData = async () => {
      const res = await client.fetch(ABOUT_QUERY, { slug: 'a-propos' });
      setData(res);
    };

    fetchData();
  }, []);

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='w-full h-full '
    >
      <div className="w-full h-full ">
        <div className="flex flex-col md:flex-row justify-center items-center mx-auto w-full h-full text-center md:text-left">
      <Image
            src={urlFor(data.image).width(800).url()}
            alt={data.title}
            width={800}
            height={600}
            className="w-full md:w-1/2 h-full object-cover object-[center_top]"
            priority
          />
          <div className="w-full md:w-1/2 md:pl-8 h-full mt-6 md:mt-0">
            <h1 className="text-6xl font-bold mb-6">{data.title}</h1>
            <article className='text-left text-lg text-gray-700'>
              <PortableText value={data.description} />
            </article>
            <div className="w-full flex justify-start pt-4">
              <Button onClick={() => startTransition(`/portfolio`)} asChild className="bg-[#2B2B2B] hover:bg-[#1a1a1a] text-white cursor-pointer">
                <span className="flex items-center space-x-2">
                  <span>Portfolio</span>
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

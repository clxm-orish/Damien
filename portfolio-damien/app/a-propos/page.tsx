'use client';

import { useEffect, useState } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '../../src/sanity/client';
import { PortableText } from '@portabletext/react';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageTransition } from '../../hooks/PageTransitionProvider';



// === Sanity image builder ===
const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

// === GROQ query
const ABOUT_QUERY = `*[_type == "a-propos" && slug.current == $slug][0]{
  title,
  image,
  description
}`;

export default function AboutPage() {
  const [data, setData] = useState<any>(null);
  const { startTransition, isTransitioning } = usePageTransition();
  

  useEffect(() => {
    const fetchData = async () => {
      const res = await client.fetch(ABOUT_QUERY, { slug: 'a-propos' });
      setData(res);
    };

    fetchData();
  }, []);

  if (!data) return null; // Tu peux aussi afficher un loader ici


  return (

      <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='w-full h-full '
      >
    <div className="w-full h-full ">
        <div className="flex items-center mx-auto w-full h-full">
          <img
            src={urlFor(data.image).width(800).url()}
            alt={data.title}
            className="w-1/2 h-full object-cover object-[center_top]"
          />
          <div className="w-1/2 pl-8 h-full">
            <h1 className="text-6xl font-bold mb-6">{data.title}</h1>
            <article>
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

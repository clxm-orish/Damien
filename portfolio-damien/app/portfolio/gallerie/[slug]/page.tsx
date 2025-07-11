// app/portfolio/gallerie/[slug]/page.tsx
import { client } from "../../../../src/sanity/client";
import { sanityFetch } from "../../../../src/sanity/live";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import BackButton from "../../../../components/ui/backbutton";
import GalleryMountNotifier from "@/components/GallerieMountNotifier"; // 🔄 Composant client séparé

const IMAGES_QUERY = defineQuery(`*[_type == "images" && slug.current == $slug][0] {
  title,
  "gallery": gallery[]
}`);

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null;

interface Props{
        slug: string;
}

export default async function GalleryPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    
    const { data: imagesDoc } = await sanityFetch({
        query: IMAGES_QUERY,
        params: { slug },
    });

    if (!imagesDoc || !imagesDoc.gallery || imagesDoc.gallery.length === 0) {
        return (
            <main className="h-full flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-1/2 align-center justify-center">
                    <BackButton />
                    <p className="text-start text-lg text-gray-700 mt-6">
                        Il n&apos;y a pas encore de photos pour ce projet.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="h-screen overflow-y-auto p-6 sm:p-12">
            <GalleryMountNotifier />
            <div className="mb-6">
                <BackButton/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {imagesDoc.gallery.map((image: SanityImageSource, index: number) => {
                    const url = urlFor(image)?.width(600).url();
                    return url ? (
                        <Image
                            key={index}
                            src={url}
                            alt={`Image ${index + 1}`}
                            width={600}
                            height={400}
                            className="rounded-lg object-cover w-full h-auto"
                        />
                    ) : null;
                })}
            </div>
        </main>
    );
}

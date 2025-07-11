'use client';

import { useEffect } from 'react';
import { usePageTransition } from '@/hooks/PageTransitionProvider';

export default function GalleryMountNotifier() {
    const { endPageLoad } = usePageTransition();

    useEffect(() => {
        endPageLoad(); // Signale que la page Galerie est montée
    }, []);

    return null; // Pas besoin d'afficher quoi que ce soit
}

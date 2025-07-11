'use client';

import { useEffect } from 'react';
import { usePageTransition } from '@/hooks/PageTransitionProvider';

export default function GalleryMountNotifier() {
    const { endPageLoad } = usePageTransition();

    useEffect(() => {
        endPageLoad(); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null; 
}

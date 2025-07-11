'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type PageTransitionContextType = {
    isTransitioning: boolean;
    isLoadingPage: boolean;
    startTransition: (to: string) => void;
    endPageLoad: () => void;
};

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const router = useRouter();

    const startTransition = (to: string) => {
        setIsTransitioning(true);
        const minDelay = 1000; // Durée minimale de 2 secondes avant changement de page

        setTimeout(() => {
            router.push(to);
            setIsLoadingPage(true); // La page cible devra appeler endPageLoad()
        }, minDelay);
    };

    const endPageLoad = () => {
        setIsLoadingPage(false);
        setTimeout(() => {
            setIsTransitioning(false);
        }, 300); // Optionnel : petit délai pour la fluidité de fermeture du rideau
    };

    return (
        <PageTransitionContext.Provider
            value={{ isTransitioning, isLoadingPage, startTransition, endPageLoad }}
        >
            {children}
        </PageTransitionContext.Provider>
    );
}

export const usePageTransition = () => {
    const context = useContext(PageTransitionContext);
    if (!context) throw new Error('usePageTransition must be used within a PageTransitionProvider');
    return context;
};

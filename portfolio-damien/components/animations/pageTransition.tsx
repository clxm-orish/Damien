'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePageTransition } from '@/hooks/PageTransitionProvider';

export default function PageTransition({ children }: { children: React.ReactNode }) {

    const { isTransitioning, isLoadingPage } = usePageTransition();

    const isRideauVisible = isTransitioning || isLoadingPage;

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>

            {/* Rideau */}
            <AnimatePresence>
                {isRideauVisible && (
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                        className="fixed inset-0 z-[9999] origin-left flex"
                    >
                        <div className="flex-1 bg-[#92B4FF]" />
                        <div className="flex-1 bg-white" />
                        <div className="flex-1 bg-[#FF8F8F]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

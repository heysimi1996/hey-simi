import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Sparkles } from 'lucide-react';

interface Props {
  color?: 'gold' | 'rose' | 'purple';
  showBackToTop?: boolean;
}

export function ReadingProgressBar({ color = 'gold', showBackToTop = true }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
        setShowScrollTop(window.scrollY > 280);
      } else {
        setScrollProgress(0);
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getGradient = () => {
    switch (color) {
      case 'rose':
        return 'linear-gradient(90deg, #ec4899, #f43f5e, #fb7185)';
      case 'purple':
        return 'linear-gradient(90deg, #8b5cf6, #a855f7, #c084fc)';
      case 'gold':
      default:
        return 'linear-gradient(90deg, #d97706, #c5a059, #f0b90b)';
    }
  };

  const getGlowColor = () => {
    switch (color) {
      case 'rose':
        return 'rgba(244, 63, 94, 0.4)';
      case 'purple':
        return 'rgba(168, 85, 247, 0.4)';
      case 'gold':
      default:
        return 'rgba(197, 160, 89, 0.4)';
    }
  };

  // Circular progress calculation for Back-To-Top button
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* Fixed Reading Progress Bar at the very top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3.5px] bg-white/5 pointer-events-none">
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background: getGradient(),
            boxShadow: `0 0 12px ${getGlowColor()}`
          }}
        />
      </div>

      {/* Floating Scroll To Top with Progress Percentage Ring */}
      {showBackToTop && (
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-6 right-6 z-40"
            >
              <button
                type="button"
                onClick={scrollToTop}
                className="group relative flex items-center justify-center w-12 h-12 rounded-full glass-panel border border-white/20 bg-brand-black/90 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title={`Đã đọc ${Math.round(scrollProgress)}% • Cuộn lên đầu trang`}
                aria-label="Cuộn lên đầu trang"
              >
                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                  <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    className="text-white/10"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    className="text-brand-gold transition-all duration-150"
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                {/* Center Icon & Percentage on Hover */}
                <ArrowUp className="w-4 h-4 text-brand-gold group-hover:-translate-y-0.5 transition-transform" />

                {/* Tooltip on Hover */}
                <span className="absolute -top-9 right-0 px-2.5 py-1 rounded-lg bg-black/90 border border-white/10 text-[10px] font-mono font-bold text-brand-gold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                  {Math.round(scrollProgress)}% • Lên đầu
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

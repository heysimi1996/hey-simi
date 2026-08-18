import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = true }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Chuyển sang chế độ Tối" : "Chuyển sang chế độ Sáng"}
      title={isLight ? "Chuyển sang chế độ Tối" : "Chuyển sang chế độ Sáng"}
      className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-300 ${
        isLight
          ? 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 shadow-sm'
          : 'bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 shadow-md'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isLight ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-center text-indigo-600"
            >
              <Moon className="w-4 h-4 fill-indigo-600/20" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-center text-amber-400"
            >
              <Sun className="w-4 h-4 fill-amber-400/20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showLabel && (
        <span className="text-xs font-display font-medium tracking-wide">
          {isLight ? 'Chế độ Tối' : 'Chế độ Sáng'}
        </span>
      )}
    </button>
  );
}

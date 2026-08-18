import React from 'react';
import { ASSETS } from '../constants/assets';

export function Logo({ className = "", showSubtitle = true }: { className?: string; showSubtitle?: boolean }) {
  return (
    <div className={`logo-container relative inline-flex items-center gap-3 ${className}`}>
      {/* Ambient magical background aura */}
      <div className="absolute -inset-2 bg-gradient-to-r from-brand-gold/20 via-purple-500/15 to-transparent blur-xl rounded-full pointer-events-none" />
      
      <a href="/" title="Trang chủ Hey! Simi - Thần số học" className="relative z-10 flex items-center gap-3 group">
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border border-brand-gold/40 shadow-[0_0_20px_rgba(197,160,89,0.3)] group-hover:shadow-[0_0_25px_rgba(197,160,89,0.5)] transition-all duration-300 group-hover:scale-105 bg-black/40">
          <img 
            src={ASSETS.logo} 
            alt="Hey! Simi Logo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-base sm:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ffe082] via-[#ffd54f] to-[#ffb300] drop-shadow-[0_2px_8px_rgba(197,160,89,0.4)]">
              Hey! Simi
            </span>
            <span className="px-1.5 py-0.2 text-[8px] uppercase tracking-widest font-mono font-bold rounded bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
              AI
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-display -mt-0.5 group-hover:text-brand-gold/80 transition-colors">
              Thần Số Học • Nhân Duyên
            </span>
          )}
        </div>
      </a>
    </div>
  );
}

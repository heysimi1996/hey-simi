import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Compass, Layers, ShieldCheck, ChevronDown } from 'lucide-react';
import { ASSETS } from '../constants/assets';

interface HeroBannerProps {
  onSelectMode?: (mode: 'single' | 'compatibility' | 'tarot') => void;
  onScrollToForm?: () => void;
}

export function HeroBanner({ onSelectMode, onScrollToForm }: HeroBannerProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-brand-gold/30 bg-[#0c0a14] shadow-[0_10px_40px_rgba(0,0,0,0.7)] group">
      {/* Background Hero Image with Dynamic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSETS.heroBanner}
          alt="Hey! Simi Thần Số Học Banner"
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0914] via-[#0b0914]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0914] via-transparent to-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-4xl space-y-6">
        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-xs font-display tracking-widest uppercase shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
          <span>Mật Mã Năng Lượng Vũ Trụ • Pythagoras & AI</span>
        </motion.div>

        {/* Main Title & Slogan */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
            Hey! <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe082] via-[#ffd54f] to-[#ffb300]">Simi</span>
            <span className="block text-xl sm:text-2xl md:text-3xl font-display font-light text-white/90 mt-1">
              Thần Số Học & Tử Vi Chiêm Tinh AI
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-brand-gold/90 font-serif italic max-w-xl">
            "Hiểu mình – Sống đúng – Hóa an yên"
          </p>
          <p className="text-xs sm:text-sm text-white/70 max-w-xl leading-relaxed pt-1">
            Giải mã sâu sắc 5 chỉ số bản mệnh, bản đồ sao 12 cung hoàng đạo, ngũ hành nạp âm và nhân tướng học với độ chính xác cao được tối ưu hóa cho người Việt.
          </p>
        </div>

        {/* 4 Feature Badges from Brand Visual */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-2xl">
          <div 
            onClick={() => onSelectMode?.('single')}
            className="cursor-pointer p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-gold/40 transition-all backdrop-blur-md flex items-center gap-2.5 group/item"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold group-hover/item:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-display font-bold text-white group-hover/item:text-brand-gold transition-colors">Hiểu Bản Thân</div>
              <div className="text-[9px] text-white/50">Mật mã 5 con số</div>
            </div>
          </div>

          <div 
            onClick={() => onSelectMode?.('compatibility')}
            className="cursor-pointer p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/40 transition-all backdrop-blur-md flex items-center gap-2.5 group/item"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover/item:scale-110 transition-transform">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-display font-bold text-white group-hover/item:text-rose-400 transition-colors">Tương Hợp Duyên</div>
              <div className="text-[9px] text-white/50">Đối chiếu tình cảm</div>
            </div>
          </div>

          <div 
            onClick={() => onSelectMode?.('single')}
            className="cursor-pointer p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 transition-all backdrop-blur-md flex items-center gap-2.5 group/item"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover/item:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-display font-bold text-white group-hover/item:text-emerald-400 transition-colors">Định Hướng Sống</div>
              <div className="text-[9px] text-white/50">Năm cá nhân & Đỉnh cao</div>
            </div>
          </div>

          <div 
            onClick={() => onSelectMode?.('tarot')}
            className="cursor-pointer p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 transition-all backdrop-blur-md flex items-center gap-2.5 group/item"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover/item:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-display font-bold text-white group-hover/item:text-purple-300 transition-colors">Tarot & Bói Ngày</div>
              <div className="text-[9px] text-white/50">Thông điệp 22 lá bài</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {onScrollToForm && (
            <button
              type="button"
              onClick={onScrollToForm}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold via-[#e6b758] to-amber-500 text-black font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-gold/25 hover:shadow-[0_0_25px_rgba(197,160,89,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tra Cứu Bản Mệnh Ngay</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          )}

          <div className="flex items-center gap-2 text-[11px] text-white/50 pl-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Bảo mật 100% • Luận giải tức thì</span>
          </div>
        </div>
      </div>
    </div>
  );
}

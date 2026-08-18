import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, Sun, Moon, Compass, Info } from 'lucide-react';
import { ASSETS } from '../constants/assets';
import { ZodiacData } from '../types';

interface ZodiacWheelMapProps {
  currentZodiac?: ZodiacData;
  className?: string;
}

const ZODIAC_SIGNS = [
  { name: 'Bạch Dương', en: 'Aries', symbol: '♈', dates: '21/03 - 19/04', element: 'Lửa', planet: 'Sao Hỏa' },
  { name: 'Kim Ngưu', en: 'Taurus', symbol: '♉', dates: '20/04 - 20/05', element: 'Đất', planet: 'Sao Kim' },
  { name: 'Song Tử', en: 'Gemini', symbol: '♊', dates: '21/05 - 21/06', element: 'Khí', planet: 'Sao Thủy' },
  { name: 'Cự Giải', en: 'Cancer', symbol: '♋', dates: '22/06 - 22/07', element: 'Nước', planet: 'Mặt Trăng' },
  { name: 'Sư Tử', en: 'Leo', symbol: '♌', dates: '23/07 - 22/08', element: 'Lửa', planet: 'Mặt Trời' },
  { name: 'Xử Nữ', en: 'Virgo', symbol: '♍', dates: '23/08 - 22/09', element: 'Đất', planet: 'Sao Thủy' },
  { name: 'Thiên Bình', en: 'Libra', symbol: '♎', dates: '23/09 - 22/10', element: 'Khí', planet: 'Sao Kim' },
  { name: 'Bọ Cạp', en: 'Scorpio', symbol: '♏', dates: '23/10 - 21/11', element: 'Nước', planet: 'Sao Diêm Vương' },
  { name: 'Nhân Mã', en: 'Sagittarius', symbol: '♐', dates: '22/11 - 21/12', element: 'Lửa', planet: 'Sao Mộc' },
  { name: 'Ma Kết', en: 'Capricorn', symbol: '♑', dates: '22/12 - 19/01', element: 'Đất', planet: 'Sao Thổ' },
  { name: 'Bảo Bình', en: 'Aquarius', symbol: '♒', dates: '20/01 - 18/02', element: 'Khí', planet: 'Sao Thiên Vương' },
  { name: 'Song Ngư', en: 'Pisces', symbol: '♓', dates: '19/02 - 20/03', element: 'Nước', planet: 'Sao Hải Vương' },
];

export function ZodiacWheelMap({ currentZodiac, className = "" }: ZodiacWheelMapProps) {
  const [selectedSign, setSelectedSign] = useState<typeof ZODIAC_SIGNS[0]>(
    ZODIAC_SIGNS.find(s => s.name === currentZodiac?.name) || ZODIAC_SIGNS[0]
  );
  const [showFullMap, setShowFullMap] = useState<boolean>(false);

  return (
    <div className={`glass-panel p-6 overflow-hidden border-brand-gold/30 bg-[#0d0a17]/90 relative ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
              Bản Đồ Sao 12 Cung Hoàng Đạo
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold font-mono font-normal">
                Chiêm Tinh Học
              </span>
            </h3>
            <p className="text-xs text-white/50">
              Vòng tròn hoàng đạo 360° phản ánh vị trí thiên thể và từ trường năng lượng
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFullMap(!showFullMap)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-display text-white/80 hover:text-white transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span>{showFullMap ? 'Thu Gọn' : 'Xem Đầy Đủ'}</span>
        </button>
      </div>

      {/* Celestial Star Chart Artwork */}
      <div className="relative rounded-2xl overflow-hidden border border-brand-gold/20 bg-black/60 aspect-[16/9] mb-6 group">
        <img
          src={ASSETS.zodiacMap}
          alt="Bản đồ sao hoàng đạo chiêm tinh"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Overlay Current Active Zodiac Badge */}
        {currentZodiac && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto bg-black/80 backdrop-blur-md border border-brand-gold/40 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center text-xl font-bold text-brand-gold">
              {currentZodiac.symbol}
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-brand-gold font-bold">
                Cung Bản Mệnh Của Bạn
              </div>
              <div className="text-sm font-display font-bold text-white flex items-center gap-2">
                {currentZodiac.name} ({currentZodiac.englishName})
                <span className="text-xs text-white/50 font-normal">| {currentZodiac.element}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive 12 Zodiac Quick Tabs */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Khám phá 12 cung hoàng đạo:</span>
          <span className="text-[11px] text-brand-gold font-mono">{selectedSign.dates}</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
          {ZODIAC_SIGNS.map((sign) => {
            const isCurrent = currentZodiac?.name === sign.name;
            const isSelected = selectedSign.name === sign.name;

            return (
              <button
                key={sign.en}
                type="button"
                onClick={() => setSelectedSign(sign)}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-brand-gold text-black border-brand-gold shadow-md scale-105 font-bold'
                    : isCurrent
                    ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/50 font-semibold'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-sm">{sign.symbol}</span>
                <span className="text-[9px] font-display truncate max-w-full mt-0.5">{sign.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Sign Highlight Card */}
        <motion.div
          key={selectedSign.en}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedSign.symbol}</span>
            <span className="font-display font-bold text-white">{selectedSign.name} ({selectedSign.en})</span>
            <span className="text-white/40">•</span>
            <span className="text-white/60 font-mono">{selectedSign.dates}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/80">
              Hệ: <strong className="text-brand-gold">{selectedSign.element}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/80">
              Chủ quản: <strong className="text-purple-300">{selectedSign.planet}</strong>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

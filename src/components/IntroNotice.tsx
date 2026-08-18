import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Calculator, 
  Compass, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb
} from 'lucide-react';

export function IntroNotice() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div id="intro-numerology-guide" className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-brand-gold/[0.05] border border-brand-gold/30 backdrop-blur-md shadow-2xl">
        {/* Glow & Decorative accents */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-gold/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

        {/* Header Bar */}
        <div className="p-6 md:p-7 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-lg shadow-brand-gold/20 flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-widest font-mono">
                  Dành cho người mới
                </span>
                <span className="text-white/40 text-xs hidden sm:inline">• Khoa học thấu hiểu bản thân</span>
              </div>
              <h2 className="text-lg md:text-xl font-display font-bold text-white tracking-wide mt-0.5">
                Hiểu Đúng Về Thần Số Học Pythagoras
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 transition-all font-medium self-start sm:self-auto"
          >
            {isExpanded ? (
              <>
                <span>Thu gọn</span>
                <ChevronUp className="w-4 h-4 text-brand-gold" />
              </>
            ) : (
              <>
                <span>Đọc hướng dẫn</span>
                <ChevronDown className="w-4 h-4 text-brand-gold" />
              </>
            )}
          </button>
        </div>

        {/* Body Content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="p-6 md:p-8 space-y-6">
                {/* 3 Main Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Pillar 1 */}
                  <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2.5 text-brand-gold font-display font-bold text-sm">
                      <BookOpen className="w-4 h-4 text-brand-gold" />
                      <span>1. Thần Số Học Là Gì?</span>
                    </div>
                    <p className="text-white/85 text-xs md:text-sm leading-relaxed">
                      Thần số học (Numerology) là hệ thống nghiên cứu do nhà toán học & triết học lỗi lạc 
                      <strong className="text-white"> Pythagoras</strong> khởi xướng từ thế kỷ thứ 6 TCN. Mỗi con số (1-9, 11, 22, 33) biểu thị một dạng <strong className="text-brand-gold">tần số năng lượng và đặc điểm tâm lý</strong> riêng biệt của con người.
                    </p>
                  </div>

                  {/* Pillar 2 */}
                  <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2.5 text-brand-gold font-display font-bold text-sm">
                      <Calculator className="w-4 h-4 text-brand-gold" />
                      <span>2. Số Chủ Đạo Từ Đâu Ra?</span>
                    </div>
                    <p className="text-white/85 text-xs md:text-sm leading-relaxed">
                      Con số chủ đạo (Life Path) được tính toán hoàn toàn dựa trên <strong className="text-white">công thức cộng dồn & rút gọn ngày tháng năm sinh Dương lịch</strong> của bạn. Nó đóng vai trò như chiếc "la bàn" chỉ ra thiên hướng tính cách, tiềm năng bẩm sinh và bài học cuộc đời.
                    </p>
                  </div>

                  {/* Pillar 3 */}
                  <div className="p-5 rounded-xl bg-black/40 border border-emerald-500/20 space-y-3">
                    <div className="flex items-center gap-2.5 text-emerald-400 font-display font-bold text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>3. Không Phải Bói Toán Tâm Linh</span>
                    </div>
                    <p className="text-white/85 text-xs md:text-sm leading-relaxed">
                      Thần số học <strong className="text-emerald-300">không phải bói toán mê tín</strong> hay định đoạt số phận cố định. Đây là công cụ phân tích và <strong className="text-white">chiêm nghiệm tâm lý học</strong>, giúp bạn thấu hiểu điểm mạnh để phát huy và điểm yếu để hoàn thiện bản thân.
                    </p>
                  </div>
                </div>

                {/* Important Clarification Banner */}
                <div className="p-4 md:p-5 rounded-xl bg-brand-gold/10 border border-brand-gold/25 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                  <div className="p-2 rounded-lg bg-brand-gold/20 text-brand-gold flex-shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div className="text-xs md:text-sm text-white/90 leading-relaxed">
                    <strong className="text-brand-gold">Lời khuyên sử dụng:</strong> Hãy xem kết quả luận giải như một tấm gương phản chiếu nội tâm. Con số không phán xét bạn là ai, chính <span className="text-white font-semibold underline decoration-brand-gold/50 underline-offset-2">sự lựa chọn, nỗ lực và tư duy tích cực</span> mỗi ngày mới là yếu tố quyết định vận mệnh của bạn!
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

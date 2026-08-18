import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShieldCheck, AlertTriangle, Lightbulb, RefreshCcw, Share2, Star, Check, Copy } from 'lucide-react';
import { CompatibilityResult as CompatibilityResultType } from '../types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Logo } from './Logo';
import { TTSPlayer } from './TTSPlayer';
import { ThemeToggle } from './ThemeToggle';
import { ReadingProgressBar } from './ReadingProgressBar';
import { AmbientSoundPlayer } from './AmbientSoundPlayer';
import { ASSETS } from '../constants/assets';

interface Props {
  result: CompatibilityResultType;
  onReset: () => void;
}

export function CompatibilityResult({ result, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: `Đối Chiếu Tương Hợp - Điểm Hòa Hợp ${result.score}%`,
      text: `Kết quả phân tích độ hòa hợp: Số chủ đạo ${result.person1Data.lifePath} (${result.person1Data.zodiacData.name}) và Số chủ đạo ${result.person2Data.lifePath} (${result.person2Data.zodiacData.name}) đạt ${result.score}% trên Hey! Simi`,
      url: url
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Chia sẻ thành công!');
      } catch (e) {
        if ((e as any).name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      showToast('Đã sao chép liên kết vào bộ nhớ tạm!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-brand-black pb-20 relative overflow-x-hidden">
      {/* High-res Cosmic Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={ASSETS.background}
          alt="Cosmic background"
          className="w-full h-full object-cover opacity-30 filter brightness-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/20 via-brand-black/90 to-brand-black" />
      </div>
      {/* Top Reading Progress Bar */}
      <ReadingProgressBar color="rose" showBackToTop={true} />

      {/* Top Bar with ThemeToggle, Ambient Player and Back */}
      <div className="max-w-6xl mx-auto px-6 pt-4 flex justify-between items-center relative z-30">
        <Logo className="scale-75 origin-left" />
        <div className="flex items-center gap-2 sm:gap-3">
          <AmbientSoundPlayer />
          <button 
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-2 bg-brand-gold/10 hover:bg-brand-gold/20 rounded-xl text-brand-gold transition-all text-xs font-display font-bold uppercase tracking-wider border border-brand-gold/30"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Chia Sẻ</span>
          </button>
          <ThemeToggle />
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all text-xs font-display font-bold uppercase tracking-wider border border-white/10"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-brand-gold" /> Đối Chiếu Khác
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative h-96 flex flex-col items-center justify-center overflow-hidden -mt-12">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/20 to-brand-black" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 text-center flex flex-col items-center"
        >
          <Logo className="mb-8 scale-75 md:scale-90 subtle-glow" />
          <div className="flex items-center justify-center gap-6 sm:gap-12 mb-8 bg-white/5 p-6 sm:p-8 rounded-3xl border border-white/5 backdrop-blur-md subtle-glow">
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                <span className="text-xl sm:text-2xl font-bold text-blue-500">{result.person1Data.lifePath}</span>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-display">{result.person1Data.elementData.element}</p>
              <div className="mt-1 flex items-center justify-center gap-1">
                <span className="text-xs">{result.person1Data.zodiacData.symbol}</span>
                <span className="text-[10px] text-purple-300 font-bold font-display">{result.person1Data.zodiacData.name}</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full" />
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-rose-500 fill-rose-500/20 animate-pulse relative z-10" />
              <div className="absolute -top-2 -right-2 bg-white text-brand-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-20">
                {result.score}%
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                <span className="text-xl sm:text-2xl font-bold text-rose-500">{result.person2Data.lifePath}</span>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-display">{result.person2Data.elementData.element}</p>
              <div className="mt-1 flex items-center justify-center gap-1">
                <span className="text-xs">{result.person2Data.zodiacData.symbol}</span>
                <span className="text-[10px] text-purple-300 font-bold font-display">{result.person2Data.zodiacData.name}</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-display font-bold text-white mb-3">Kết Quả Hòa Hợp</h1>
          <p className="text-white/60 max-w-sm">{result.score > 80 ? 'Một mối nhân duyên tiền định' : result.score > 50 ? 'Sự kết hợp đầy tiềm năng' : 'Cần nhiều sự thấu cảm và hóa giải'}</p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-20 space-y-8">
        {/* Comparison Table Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel p-8"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
             <Star className="w-5 h-5 text-brand-gold" />
             <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Thông Số Đối Chiếu</h2>
          </div>
          <div className="prose prose-invert max-w-none prose-sm lg:prose-base">
            <Markdown remarkPlugins={[remarkGfm]}>{result.aiInterpretation.comparisonTable}</Markdown>
          </div>
        </motion.div>

        {/* Compatibility Score Bar */}
        <div className="glass-panel p-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-sm uppercase tracking-widest text-white/40">Chỉ số hòa hợp</h3>
              <p className="text-3xl font-display font-bold text-white">{result.score}%</p>
            </div>
            <p className="text-xs text-white/30 italic">Dựa trên 12 yếu tố bản mệnh</p>
          </div>
          <div className="h-4 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${result.score}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-rose-500 to-brand-gold"
            />
          </div>
        </div>

        {/* Detailed Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="glass-panel p-8 border-emerald-500/10 bg-emerald-500/[0.01]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-display font-bold text-white uppercase">Sự Tương Hợp</h2>
              </div>
              <TTSPlayer text={result.aiInterpretation.compatibilityAnalysis} />
            </div>
            <div className="prose prose-invert max-w-none text-white/80">
              <Markdown remarkPlugins={[remarkGfm]}>{result.aiInterpretation.compatibilityAnalysis}</Markdown>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="glass-panel p-8 border-rose-500/10 bg-rose-500/[0.01]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
                <h2 className="text-xl font-display font-bold text-white uppercase">Xung Khắc Cần Lưu Ý</h2>
              </div>
              <TTSPlayer text={result.aiInterpretation.conflicts} />
            </div>
            <div className="prose prose-invert max-w-none text-white/80">
              <Markdown remarkPlugins={[remarkGfm]}>{result.aiInterpretation.conflicts}</Markdown>
            </div>
          </motion.div>
        </div>

        {/* Solution section */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="glass-panel p-8 border-brand-gold/10 bg-brand-gold/[0.02]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-brand-gold" />
              <h2 className="text-xl font-display font-bold text-white uppercase">Giải Pháp & Hóa Giải</h2>
            </div>
            <TTSPlayer text={result.aiInterpretation.solutions} />
          </div>
          <div className="prose prose-invert max-w-none text-white/80">
            <Markdown remarkPlugins={[remarkGfm]}>{result.aiInterpretation.solutions}</Markdown>
          </div>
        </motion.div>

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all text-xs uppercase tracking-wider font-display font-bold"
          >
            <RefreshCcw className="w-4 h-4 text-brand-gold" /> Trở Lại
          </button>
          <button 
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-gold to-amber-500 text-black font-display font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-gold/20"
          >
            <Share2 className="w-4 h-4" /> Chia Sẻ Kết Quả
          </button>
        </div>

        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-emerald-500 text-black font-bold text-xs shadow-2xl flex items-center gap-2 z-50 pointer-events-none"
            >
              <Check className="w-4 h-4" /> {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEO Block */}
        <div className="mt-20 pt-20 border-t border-white/5 opacity-[0.03] text-[10px] space-y-4">
           <h3>Xem ngày lành tháng tốt cho hôn nhân</h3>
           <p>Kết quả đối chiếu tuổi vợ chồng dựa trên các phép tính mệnh hỏa mệnh thủy. Xem chi tiết lục xung, lục hại và cách hóa giải để cuộc sống gia đình ấm êm, hạnh phúc.</p>
           {Array(30).fill("Cách chọn hướng nhà hợp tuổi vợ chồng để kích hoạt tài lộc và bình an.").join(" ")}
        </div>
      </div>
    </div>
  );
}

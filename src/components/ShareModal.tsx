import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, 
  Download, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  Smartphone, 
  Square, 
  Image as ImageIcon,
  ExternalLink,
  MessageCircle,
  QrCode
} from 'lucide-react';
import { NumerologyResult } from '../types';
import { generateDestinyCardCanvas } from '../lib/exportCanvas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: NumerologyResult;
}

type CardFormat = 'portrait' | 'story' | 'square';

export function ShareModal({ isOpen, onClose, result }: Props) {
  const [format, setFormat] = useState<CardFormat>('portrait');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Re-generate preview when format or result changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsGenerating(true);

    generateDestinyCardCanvas(result, format)
      .then((canvas) => {
        if (isMounted) {
          setPreviewUrl(canvas.toDataURL('image/png'));
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate preview image:', err);
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, format, result]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const canvas = await generateDestinyCardCanvas(result, format);
      const link = document.createElement('a');
      const sanitizedName = result.input.fullName.trim().replace(/\s+/g, '_').toLowerCase();
      link.download = `heysimi_ban_menh_${sanitizedName}_${format}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Đã tải ảnh Thẻ Bản Mệnh HD về máy thành công!');
    } catch (err) {
      console.error('Error downloading card image:', err);
      showToast('Có lỗi xảy ra khi tải ảnh, vui lòng thử lại!');
    } finally {
      setIsGenerating(false);
    }
  };

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('name', result.input.fullName);
    url.searchParams.set('dob', result.input.birthDate);
    url.searchParams.set('gender', result.input.gender);
    return url.toString();
  };

  const handleCopyLink = () => {
    const shareUrl = getShareUrl();
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      showToast('Đã sao chép liên kết luận giải vào bộ nhớ tạm!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleNativeShare = async () => {
    const shareUrl = getShareUrl();
    const shareData = {
      title: `Bản Mệnh ${result.input.fullName} - Số Chủ Đạo ${result.numerology.lifePath}`,
      text: `Khám phá mật mã Thần số học Pythagoras & Chiêm tinh học của ${result.input.fullName} (Số chủ đạo ${result.numerology.lifePath}, Cung ${result.numerology.zodiacData.name}) trên Hey! Si Mì`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Chia sẻ thành công!');
      } catch (err) {
        if ((err as any).name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShareFacebook = () => {
    const shareUrl = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  };

  const handleShareZalo = () => {
    const shareUrl = encodeURIComponent(getShareUrl());
    window.open(`https://zalo.me/share?url=${shareUrl}`, '_blank');
  };

  const handleShareTelegram = () => {
    const shareUrl = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Bản Mệnh của ${result.input.fullName} - Số Chủ Đạo ${result.numerology.lifePath}`);
    window.open(`https://t.me/share/url?url=${shareUrl}&text=${text}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-brand-black border border-brand-gold/40 shadow-2xl shadow-black p-6 sm:p-8 space-y-6 text-white"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-display tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Chia Sẻ Mật Mã Bản Mệnh
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Lưu & Lan Tỏa Vận Mệnh Cát Tường
          </h2>
          <p className="text-xs sm:text-sm text-white/60">
            Tải ảnh Thẻ VIP độ phân giải cao hoặc gửi liên kết cho bạn bè & người thân.
          </p>
        </div>

        {/* Layout: Left Preview / Right Options */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Preview Column */}
          <div className="md:col-span-6 flex flex-col items-center space-y-4">
            {/* Format Selector Pills */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10 text-xs w-full justify-center">
              <button
                type="button"
                onClick={() => setFormat('portrait')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  format === 'portrait' ? 'bg-brand-gold text-black font-bold shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Bảng Mệnh (4:5)
              </button>
              <button
                type="button"
                onClick={() => setFormat('story')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  format === 'story' ? 'bg-brand-gold text-black font-bold shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Story (9:16)
              </button>
              <button
                type="button"
                onClick={() => setFormat('square')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  format === 'square' ? 'bg-brand-gold text-black font-bold shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                <Square className="w-3.5 h-3.5" /> Vuông (1:1)
              </button>
            </div>

            {/* Live Canvas Preview Image Box */}
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-brand-gold/30 gold-glow bg-black/60 shadow-2xl flex items-center justify-center min-h-[320px]">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3 p-8">
                  <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
                  <span className="text-xs text-brand-gold font-display uppercase tracking-widest">
                    Đang dựng Thẻ VIP Canvas...
                  </span>
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Thẻ Bản Mệnh Canvas Preview"
                  className="w-full h-auto object-contain rounded-2xl transition-transform hover:scale-[1.01]"
                />
              ) : (
                <span className="text-xs text-white/40">Không thể tải trước ảnh</span>
              )}
            </div>
          </div>

          {/* Right Action Column */}
          <div className="md:col-span-6 space-y-6">
            {/* Download HD Button */}
            <div className="p-5 rounded-2xl bg-brand-gold/5 border border-brand-gold/20 space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-brand-gold font-display font-bold flex items-center gap-2">
                <Download className="w-4 h-4" /> 1. Lưu Ảnh Sắc Nét Cho Mạng Xã Hội
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Tạo tệp ảnh PNG 2K siêu nét, phù hợp để đăng Instagram Story, Facebook Post, Avatar hoặc lưu trữ trong điện thoại.
              </p>
              <button
                type="button"
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-amber-500 text-black font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" /> Tải Ảnh HD Về Điện Thoại / Máy Tính
              </button>
            </div>

            {/* Share Link Section */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-white/70 font-display font-bold flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-400" /> 2. Chia Sẻ Trực Tiếp Qua Liên Kết
              </h4>
              
              {/* Copy URL Input Box */}
              <div className="flex items-center gap-2 p-2 bg-black/40 rounded-xl border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={getShareUrl()}
                  className="w-full bg-transparent text-xs text-white/70 font-mono px-2 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Đã Chép
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-brand-gold" /> Sao Chép
                    </>
                  )}
                </button>
              </div>

              {/* Social Share Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium flex flex-col items-center gap-1 transition-all"
                >
                  <Smartphone className="w-4 h-4 text-brand-gold" />
                  <span className="text-[11px]">Chia sẻ máy</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="p-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 text-xs font-medium flex flex-col items-center gap-1 transition-all text-blue-400"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-[11px]">Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareZalo}
                  className="p-2.5 rounded-xl bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-600/30 text-xs font-medium flex flex-col items-center gap-1 transition-all text-cyan-400"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-[11px]">Zalo</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareTelegram}
                  className="p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-xs font-medium flex flex-col items-center gap-1 transition-all text-sky-400"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-[11px]">Telegram</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Toast notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-emerald-500/90 text-black font-bold text-xs shadow-xl flex items-center gap-2 z-50 pointer-events-none"
            >
              <Check className="w-4 h-4" /> {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

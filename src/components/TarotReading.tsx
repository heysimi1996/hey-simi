import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  RefreshCw, 
  Briefcase, 
  Heart, 
  Moon, 
  Sun, 
  Compass, 
  Copy, 
  Check, 
  Volume2, 
  Flame, 
  Layers, 
  Share2, 
  ChevronRight, 
  Star,
  ShieldAlert,
  Sparkle
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TarotCard, TarotDailyReading } from '../types';
import { TAROT_DECK, getRandomTarotCard, getShuffledDeck } from '../lib/tarot';
import { interpretTarotDaily } from '../lib/gemini';
import { saveTarotHistory } from '../lib/history';
import { TTSPlayer } from './TTSPlayer';
import { Logo } from './Logo';
import { ReadingProgressBar } from './ReadingProgressBar';
import { AmbientSoundPlayer } from './AmbientSoundPlayer';

interface Props {
  onBackToHome?: () => void;
  initialReading?: TarotDailyReading | null;
}

const FOCUS_TOPICS = [
  { id: 'Toàn Diện Ngày Mới', label: 'Toàn Diện Ngày Mới', icon: Sparkles, color: 'text-brand-gold border-brand-gold/30 bg-brand-gold/10' },
  { id: 'Công Việc & Tài Chính', label: 'Công Việc & Tài Lộc', icon: Briefcase, color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' },
  { id: 'Tình Cảm & Nhân Duyên', label: 'Tình Cảm & Trái Tim', icon: Heart, color: 'text-rose-400 border-rose-400/30 bg-rose-400/10' },
  { id: 'Tinh Thần & Chữa Lành', label: 'Tâm Thức & Năng Lượng', icon: Moon, color: 'text-purple-400 border-purple-400/30 bg-purple-400/10' },
];

export function TarotReading({ onBackToHome, initialReading }: Props) {
  const [userName, setUserName] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('Toàn Diện Ngày Mới');
  const [deck, setDeck] = useState<TarotCard[]>(TAROT_DECK);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(initialReading?.card || null);
  const [isReversed, setIsReversed] = useState<boolean>(initialReading?.isReversed || false);
  const [reading, setReading] = useState<TarotDailyReading | null>(initialReading || null);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialReading) {
      setReading(initialReading);
      setSelectedCard(initialReading.card);
      setIsReversed(initialReading.isReversed);
    }
  }, [initialReading]);

  // Shuffle deck on initial mount
  useEffect(() => {
    setDeck(getShuffledDeck());
  }, []);

  const handleShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setDeck(getShuffledDeck());
      setIsShuffling(false);
    }, 600);
  };

  const handleSelectCard = async (card: TarotCard, index: number) => {
    if (isLoadingAI || reading) return;
    
    // Subtle 20% chance of reversed
    const reversed = Math.random() < 0.2;
    setSelectedCard(card);
    setIsReversed(reversed);
    setIsLoadingAI(true);

    try {
      const aiResult = await interpretTarotDaily(
        card,
        reversed,
        userName.trim() || 'Bạn',
        selectedTopic
      );

      const drawnDate = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const newReading: TarotDailyReading = {
        card,
        isReversed: reversed,
        questionOrFocus: selectedTopic,
        userName: userName.trim() || 'Bạn',
        drawnAt: drawnDate,
        aiInterpretation: aiResult
      };

      setReading(newReading);
      saveTarotHistory(newReading);
    } catch (err) {
      console.error("Tarot draw error:", err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleReset = () => {
    setSelectedCard(null);
    setReading(null);
    handleShuffle();
  };

  const handleCopyReading = () => {
    if (!reading) return;
    const textToCopy = `✨ THÔNG ĐIỆP TAROT NGÀY MỚI (${reading.drawnAt}) ✨
Lá bài: ${reading.card.romanNumeral}. ${reading.card.name} - ${reading.card.vietnameseName} (${reading.isReversed ? 'Ngược' : 'Xuôi'})
Tâm điểm: ${reading.questionOrFocus}

🔮 TỔNG QUAN NGÀY MỚI:
${reading.aiInterpretation.overviewMessage}

💼 CÔNG VIỆC & TÀI LỘC:
${reading.aiInterpretation.careerAndFinance}

❤️ TÌNH CẢM & NHÂN DUYÊN:
${reading.aiInterpretation.loveAndRelationships}

🧘 TINH THẦN & NĂNG LƯỢNG:
${reading.aiInterpretation.mindAndSpirit}

⚡ LỜI KHUYÊN HÀNH ĐỘNG:
${reading.aiInterpretation.actionableAdvice}

🌟 AFFIRMATION MANTRA:
"${reading.aiInterpretation.affirmation}"
🍀 Biểu tượng may mắn: ${reading.aiInterpretation.luckySymbol}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const fullSpeechText = reading 
    ? `Thông điệp Tarot ngày hôm nay dành cho bạn. Lá bài ${reading.card.name}, ${reading.card.vietnameseName}, trạng thái ${reading.isReversed ? 'Ngược' : 'Xuôi'}. ${reading.aiInterpretation.overviewMessage}. Về công việc và tài lộc: ${reading.aiInterpretation.careerAndFinance}. Về tình cảm: ${reading.aiInterpretation.loveAndRelationships}. Về tinh thần: ${reading.aiInterpretation.mindAndSpirit}. Lời khuyên hành động: ${reading.aiInterpretation.actionableAdvice}. Câu khẳng định của ngày: ${reading.aiInterpretation.affirmation}.`
    : '';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
      {/* Top Reading Progress Bar */}
      <ReadingProgressBar color="purple" showBackToTop={true} />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-display tracking-widest uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Trải Bài Tarot Hàng Ngày • Thông Điệp Vũ Trụ
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-wide">
          Rút 1 Lá Bài Định Mệnh Hôm Nay
        </h1>
        <p className="text-white/60 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
          Tập trung tâm trí, gửi gắm ước nguyện và chọn một lá bài Tarot ngẫu nhiên để AI giải mã chi tiết năng lượng công việc, tình duyên và hướng đi tâm thức trong ngày.
        </p>
      </div>

      {!reading ? (
        /* STEP 1: PREPARATION & CARD SPREAD */
        <div className="space-y-8">
          {/* Intention & Topic Controls */}
          <div className="max-w-2xl mx-auto glass-panel p-5 sm:p-6 border border-white/10 rounded-2xl space-y-5 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-display uppercase tracking-widest text-white/60 mb-2">
                  Tên của bạn (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ví dụ: Minh Anh, An Nhiên..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-display uppercase tracking-widest text-white/60 mb-2">
                  Tâm điểm bạn muốn hướng tới
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                >
                  {FOCUS_TOPICS.map((topic) => (
                    <option key={topic.id} value={topic.id} className="bg-brand-black text-white">
                      {topic.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Topic Badges Selector */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {FOCUS_TOPICS.map((topic) => {
                const Icon = topic.icon;
                const isSelected = selectedTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display transition-all ${
                      isSelected
                        ? `${topic.color} shadow-lg font-bold border scale-105`
                        : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{topic.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-white/50">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" /> 22 Lá Ẩn Chính (Major Arcana)
              </span>
              <button
                onClick={handleShuffle}
                disabled={isShuffling || isLoadingAI}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-brand-gold transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
                <span>Xáo lại bài</span>
              </button>
            </div>
          </div>

          {/* SPREAD OF 22 TAROT CARDS */}
          <div className="relative">
            <div className="text-center mb-6">
              <p className="text-xs uppercase tracking-[0.25em] text-brand-gold font-display animate-pulse">
                ✦ Hãy nhắm mắt 3 giây, hít sâu và chạm vào 1 lá bài dưới đây ✦
              </p>
            </div>

            {isLoadingAI ? (
              /* Loading State during drawing */
              <div className="py-20 flex flex-col items-center justify-center space-y-6">
                <div className="relative w-28 h-44 rounded-2xl bg-gradient-to-br from-purple-600/30 to-brand-gold/20 border-2 border-brand-gold animate-pulse flex flex-col items-center justify-center shadow-[0_0_40px_rgba(197,160,89,0.3)]">
                  <Sparkles className="w-10 h-10 text-brand-gold animate-spin" />
                  <span className="text-[10px] font-display uppercase tracking-widest text-white/80 mt-3">Đang mở bài...</span>
                </div>
                <div className="text-center space-y-2 max-w-md">
                  <h3 className="text-lg font-display text-white font-bold">Vũ Trụ Đang Truyền Tải Thông Điệp</h3>
                  <p className="text-xs text-white/50">AI đang kết nối trực giác và luận giải thông điệp ngày mới từ lá bài bạn đã chọn...</p>
                </div>
              </div>
            ) : (
              /* Grid of Cards */
              <motion.div 
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2.5 sm:gap-3 justify-items-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {deck.map((card, index) => (
                  <motion.button
                    key={`${card.id}-${index}`}
                    onClick={() => handleSelectCard(card, index)}
                    whileHover={{ scale: 1.08, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative w-full aspect-[2/3.3] max-w-[105px] rounded-xl bg-gradient-to-b from-[#1c1829] via-[#0f0c1b] to-[#08070d] border border-purple-500/30 hover:border-brand-gold p-1.5 flex flex-col items-center justify-between cursor-pointer transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.35)] overflow-hidden"
                  >
                    {/* Golden Card Back Sacred Geometry Pattern */}
                    <div className="w-full h-full rounded-lg border border-purple-500/20 group-hover:border-brand-gold/40 flex flex-col items-center justify-between p-2 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-black/40">
                      <div className="flex justify-between w-full text-[9px] font-mono text-purple-300/60 group-hover:text-brand-gold">
                        <span>✦</span>
                        <span>✦</span>
                      </div>

                      <div className="flex flex-col items-center justify-center my-auto">
                        <div className="w-8 h-8 rounded-full border border-purple-400/30 group-hover:border-brand-gold flex items-center justify-center bg-purple-500/10 group-hover:bg-brand-gold/10 transition-colors">
                          <Star className="w-4 h-4 text-purple-300 group-hover:text-brand-gold transition-colors" />
                        </div>
                        <span className="text-[8px] font-display uppercase tracking-widest text-purple-300/40 group-hover:text-white/80 mt-1.5">
                          Tarot
                        </span>
                      </div>

                      <div className="flex justify-between w-full text-[9px] font-mono text-purple-300/60 group-hover:text-brand-gold">
                        <span>✦</span>
                        <span>✦</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        /* STEP 2: REVEALED TAROT CARD & AI READING */
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Top Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/50">Trải bài cho:</span>
              <span className="text-xs font-display font-bold text-brand-gold uppercase">{reading.userName}</span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-white/60">{reading.drawnAt}</span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 border border-purple-500/20 text-purple-300">
                {reading.questionOrFocus}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <AmbientSoundPlayer />
              <button
                onClick={handleCopyReading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-brand-gold" />}
                <span>{copied ? 'Đã sao chép!' : 'Chia sẻ'}</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-gold text-black text-xs font-display font-bold hover:bg-brand-gold/90 transition-all shadow-lg"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rút Lá Khác</span>
              </button>
            </div>
          </div>

          {/* Hero Revealed Card Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* The 3D Tarot Card Visual Component */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <motion.div 
                initial={{ rotateY: 180, scale: 0.9 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className={`relative w-full max-w-[280px] aspect-[2/3.4] rounded-3xl p-4 bg-gradient-to-b from-[#1f1a33] via-[#120f21] to-[#090812] border-2 ${
                  reading.isReversed ? 'border-rose-500/40' : 'border-brand-gold'
                } shadow-[0_0_40px_rgba(197,160,89,0.25)] flex flex-col justify-between overflow-hidden group`}
              >
                {/* Background Ambient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${reading.card.themeColor} opacity-30 pointer-events-none`} />

                {/* Top Numerology & Astrological Meta */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-display font-black text-brand-gold">{reading.card.romanNumeral}</span>
                    <span className="text-[10px] uppercase font-mono text-white/50">{reading.card.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/80 font-mono">
                      {reading.card.element}
                    </span>
                  </div>
                </div>

                {/* Center Sacred Illustration */}
                <div className={`relative z-10 flex flex-col items-center justify-center my-auto py-4 transition-transform ${reading.isReversed ? 'rotate-180' : ''}`}>
                  <div className="w-24 h-24 rounded-2xl bg-white/5 border border-brand-gold/30 flex items-center justify-center text-5xl shadow-2xl shadow-purple-900/50 group-hover:scale-105 transition-transform">
                    {reading.card.icon}
                  </div>
                  <span className="text-[11px] text-white/50 font-mono mt-3 text-center px-2">
                    {reading.card.planetOrSign}
                  </span>
                </div>

                {/* Bottom Card Title & Status */}
                <div className="relative z-10 border-t border-white/10 pt-2 text-center">
                  <h3 className="text-lg font-display font-bold text-white">{reading.card.vietnameseName}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      reading.isReversed 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {reading.isReversed ? 'Vị Trí Ngược' : 'Vị Trí Xuôi'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Keywords Tag Pill list */}
              <div className="mt-4 flex flex-wrap gap-1.5 justify-center max-w-[280px]">
                {(reading.isReversed ? reading.card.reversedKeywords : reading.card.uprightKeywords).map((kw, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                    #{kw}
                  </span>
                ))}
              </div>

              {/* Archetype explanation card */}
              <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center max-w-[280px]">
                <span className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">Cổ Mẫu Năng Lượng</span>
                <p className="text-xs text-white/70 italic">"{reading.card.archetype}"</p>
              </div>
            </div>

            {/* Reading Details & Interpretations */}
            <div className="lg:col-span-8 space-y-6">
              {/* Overview & TTS Header */}
              <div className="glass-panel p-6 rounded-2xl border border-brand-gold/30 bg-brand-gold/[0.02] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-6 bg-brand-gold rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide uppercase">
                      Thông Điệp Vũ Trụ Hôm Nay
                    </h2>
                  </div>
                  <TTSPlayer text={fullSpeechText} />
                </div>

                <div className="prose prose-invert max-w-none text-white/90 text-sm sm:text-base leading-relaxed">
                  <Markdown remarkPlugins={[remarkGfm]}>{reading.aiInterpretation.overviewMessage}</Markdown>
                </div>
              </div>

              {/* 3 Core Pillars: Work, Love, Mind */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Career & Wealth */}
                <div className="glass-panel p-5 rounded-2xl border-emerald-500/20 bg-emerald-500/[0.02] space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Briefcase className="w-4 h-4" />
                    <h3 className="text-xs font-display uppercase tracking-wider font-bold">Công Việc & Tài Lộc</h3>
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    <Markdown>{reading.aiInterpretation.careerAndFinance}</Markdown>
                  </div>
                </div>

                {/* 2. Love & Relationships */}
                <div className="glass-panel p-5 rounded-2xl border-rose-500/20 bg-rose-500/[0.02] space-y-3">
                  <div className="flex items-center gap-2 text-rose-400">
                    <Heart className="w-4 h-4" />
                    <h3 className="text-xs font-display uppercase tracking-wider font-bold">Tình Cảm & Nhân Duyên</h3>
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    <Markdown>{reading.aiInterpretation.loveAndRelationships}</Markdown>
                  </div>
                </div>

                {/* 3. Mind & Spirit */}
                <div className="glass-panel p-5 rounded-2xl border-purple-500/20 bg-purple-500/[0.02] space-y-3">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Moon className="w-4 h-4" />
                    <h3 className="text-xs font-display uppercase tracking-wider font-bold">Tâm Thức & Năng Lượng</h3>
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    <Markdown>{reading.aiInterpretation.mindAndSpirit}</Markdown>
                  </div>
                </div>
              </div>

              {/* Actionable Advice & Affirmation Mantra */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Action of the Day */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-gold/10 via-brand-black to-brand-gold/5 border border-brand-gold/30 space-y-2">
                  <div className="flex items-center gap-2 text-brand-gold">
                    <Sun className="w-4 h-4" />
                    <h4 className="text-xs font-display uppercase tracking-wider font-bold">Hành Động Khuyên Làm Hôm Nay</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                    {reading.aiInterpretation.actionableAdvice}
                  </p>
                </div>

                {/* Affirmation Mantra */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/20 via-brand-black to-purple-950/10 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-300">
                      <Sparkles className="w-4 h-4" />
                      <h4 className="text-xs font-display uppercase tracking-wider font-bold">Khẳng Định Ngày Mới (Affirmation)</h4>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-purple-200 italic font-display leading-relaxed">
                    "{reading.aiInterpretation.affirmation}"
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-[11px] text-white/40">
                    <span>🍀 Vật phẩm may mắn:</span>
                    <span className="text-brand-gold font-medium">{reading.aiInterpretation.luckySymbol}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

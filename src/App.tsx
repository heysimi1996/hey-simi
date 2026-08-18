import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RefreshCw, Compass, Shield, Eye, Layers, History } from 'lucide-react';
import { Logo } from './components/Logo';
import { InputForm } from './components/InputForm';
import { IntroNotice } from './components/IntroNotice';
import { DailyForecastWidget } from './components/DailyForecastWidget';
import { HistoryModal } from './components/HistoryModal';
import { AnalysisResult } from './components/AnalysisResult';
import { CompatibilityForm } from './components/CompatibilityForm';
import { CompatibilityResult } from './components/CompatibilityResult';
import { TarotReading } from './components/TarotReading';
import { LoadingScreen } from './components/LoadingScreen';
import { ThemeToggle } from './components/ThemeToggle';
import { AmbientSoundPlayer } from './components/AmbientSoundPlayer';
import { HeroBanner } from './components/HeroBanner';
import { ASSETS } from './constants/assets';
import { 
  UserInput, 
  NumerologyData, 
  AnalysisResult as AnalysisResultType, 
  CompatibilityResult as CompatibilityResultType,
  TarotDailyReading 
} from './types';
import { 
  calculateLifePath, 
  calculateNameNumbers, 
  generateBirthChart, 
  analyzeArrows, 
  calculatePersonalYear, 
  calculatePyramids, 
  calculateElement,
  calculateZodiac, 
  reduceNumber 
} from './lib/numerology';
import { interpretNumerology, interpretCompatibility } from './lib/gemini';
import { 
  saveSingleAnalysisHistory, 
  saveCompatibilityHistory, 
  getHistory 
} from './lib/history';

export default function App() {
  const [mode, setMode] = useState<'single' | 'compatibility' | 'tarot'>('single');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResultType | null>(null);
  const [selectedTarotReading, setSelectedTarotReading] = useState<TarotDailyReading | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [historyCount, setHistoryCount] = useState<number>(0);

  useEffect(() => {
    const updateCount = () => {
      setHistoryCount(getHistory().length);
    };
    updateCount();
    window.addEventListener('heysimi_history_updated', updateCount);

    // Auto-analyze if opened from a shared link
    const searchParams = new URLSearchParams(window.location.search);
    const sharedName = searchParams.get('name');
    const sharedDob = searchParams.get('dob');
    const sharedGender = (searchParams.get('gender') === 'Nữ' ? 'Nữ' : 'Nam') as 'Nam' | 'Nữ';

    if (sharedName && sharedDob) {
      handleStartAnalysis({
        fullName: sharedName,
        birthDate: sharedDob,
        birthHour: '',
        gender: sharedGender
      });
    }

    return () => window.removeEventListener('heysimi_history_updated', updateCount);
  }, []);

  const computeNumerologyData = (input: UserInput): NumerologyData => {
    const lifePath = calculateLifePath(input.birthDate);
    const nameData = calculateNameNumbers(input.fullName);
    const birthChart = generateBirthChart(input.birthDate);
    const arrows = analyzeArrows(birthChart);
    const personalYear = calculatePersonalYear(input.birthDate);
    const pyramids = calculatePyramids(input.birthDate);
    const elementData = calculateElement(input.birthDate);
    const zodiacData = calculateZodiac(input.birthDate);
    const maturity = reduceNumber(lifePath + nameData.destiny, true);

    return {
      lifePath,
      destiny: nameData.destiny,
      soulUrge: nameData.soulUrge,
      innerSelf: nameData.innerSelf,
      maturity,
      birthChart,
      arrows,
      personalYear,
      pyramids,
      elementData,
      zodiacData
    };
  };

  const handleStartAnalysis = async (input: UserInput) => {
    setLoading(true);
    try {
      const numerologyData = computeNumerologyData(input);
      const aiResult = await interpretNumerology(input, numerologyData);

      const fullResult: AnalysisResultType = {
        input,
        numerology: numerologyData,
        aiInterpretation: aiResult
      };

      setAnalysisResult(fullResult);
      saveSingleAnalysisHistory(fullResult);
    } catch (error) {
      console.error("Analysis Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCompatibility = async (p1: UserInput, p2: UserInput) => {
    setLoading(true);
    try {
      const d1 = computeNumerologyData(p1);
      const d2 = computeNumerologyData(p2);

      const aiResult = await interpretCompatibility(p1, d1, p2, d2);

      const compatResult: CompatibilityResultType = {
        score: aiResult.score,
        person1Data: d1,
        person2Data: d2,
        aiInterpretation: aiResult
      };

      setCompatibilityResult(compatResult);
      saveCompatibilityHistory(compatResult);
    } catch (error) {
      console.error("Compatibility Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreSingle = (result: AnalysisResultType) => {
    setAnalysisResult(result);
    setCompatibilityResult(null);
    setMode('single');
  };

  const handleRestoreCompatibility = (result: CompatibilityResultType) => {
    setCompatibilityResult(result);
    setAnalysisResult(null);
    setMode('compatibility');
  };

  const handleRestoreTarot = (reading: TarotDailyReading) => {
    setSelectedTarotReading(reading);
    setAnalysisResult(null);
    setCompatibilityResult(null);
    setMode('tarot');
  };

  return (
    <div className="min-h-screen bg-brand-black text-[#e0e0e0] flex flex-col justify-between selection:bg-brand-gold selection:text-black relative overflow-x-hidden">
      {/* High-res Cosmic Background Atmosphere Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={ASSETS.background}
          alt="Cosmic Starry Background"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-brand-black/90 to-brand-black" />
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-gold/10 blur-[130px] rounded-full" />
      </div>

      {/* Main Header */}
      <header className="relative z-30 border-b border-white/5 bg-brand-black/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
          setAnalysisResult(null);
          setCompatibilityResult(null);
          setSelectedTarotReading(null);
        }}>
          <Logo className="scale-90" />
        </div>

        {/* Mode Navigation Tabs */}
        {!analysisResult && !compatibilityResult && (
          <nav className="flex flex-wrap items-center justify-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 subtle-glow">
            <button
              onClick={() => {
                setMode('single');
                setSelectedTarotReading(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display text-xs uppercase tracking-wider transition-all ${
                mode === 'single'
                  ? 'bg-brand-gold text-black font-bold shadow-lg gold-glow'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tra Cứu Bản Mệnh
            </button>
            <button
              onClick={() => {
                setMode('compatibility');
                setSelectedTarotReading(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display text-xs uppercase tracking-wider transition-all ${
                mode === 'compatibility'
                  ? 'bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              Tương Hợp Tình Duyên
            </button>
            <button
              onClick={() => {
                setMode('tarot');
                setSelectedTarotReading(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display text-xs uppercase tracking-wider transition-all ${
                mode === 'tarot'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-500/30 border border-purple-400/40'
                  : 'text-purple-300/70 hover:text-purple-200 hover:bg-purple-500/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-300" />
              Trải Bài Tarot Hàng Ngày
            </button>
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-2.5">
          <AmbientSoundPlayer />
          
          {/* History Button */}
          <button
            type="button"
            onClick={() => setIsHistoryModalOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-display font-medium text-white/90 hover:text-white transition-all shadow-sm group"
            title="Xem lại lịch sử tra cứu đã lưu"
          >
            <History className="w-4 h-4 text-brand-gold group-hover:rotate-[-20deg] transition-transform" />
            <span className="hidden sm:inline">Lịch sử</span>
            {historyCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-gold text-black text-[10px] font-mono font-bold">
                {historyCount}
              </span>
            )}
          </button>

          <ThemeToggle />

          {(analysisResult || compatibilityResult) && (
            <button
              onClick={() => {
                setAnalysisResult(null);
                setCompatibilityResult(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/80 hover:bg-white/10 transition-all font-display uppercase tracking-wider"
            >
              <RefreshCw className="w-4 h-4 text-brand-gold" />
              Tra Cứu Khác
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="relative z-10 flex-1 flex flex-col">
        {loading ? (
          <LoadingScreen />
        ) : (
          <AnimatePresence mode="wait">
            {analysisResult ? (
              <motion.div
                key="analysis-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AnalysisResult
                  result={analysisResult}
                  onReset={() => setAnalysisResult(null)}
                />
              </motion.div>
            ) : compatibilityResult ? (
              <motion.div
                key="compatibility-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CompatibilityResult
                  result={compatibilityResult}
                  onReset={() => setCompatibilityResult(null)}
                />
              </motion.div>
            ) : mode === 'single' ? (
              <motion.div
                key="input-form-section"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="py-6 space-y-10"
              >
                {/* Hero Banner with Brand Image & 4 Pillars */}
                <div className="max-w-6xl mx-auto px-4">
                  <HeroBanner 
                    onSelectMode={(selectedMode) => {
                      setMode(selectedMode);
                      setSelectedTarotReading(null);
                    }}
                    onScrollToForm={() => {
                      const el = document.getElementById('lookup-form-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                </div>

                {/* 1. Con Số Vũ Trụ Hôm Nay */}
                <DailyForecastWidget />

                {/* 2. Điền thông tin tra cứu bản mệnh (Vị trí thứ 2) */}
                <div id="lookup-form-section" className="space-y-4 scroll-mt-24">
                  <div className="text-center max-w-2xl mx-auto px-4">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[11px] font-display tracking-widest uppercase mb-2">
                      <Sparkles className="w-3.5 h-3.5" /> Tra Cứu Trực Tuyến Miễn Phí
                    </span>
                    <h2 className="text-2xl md:text-4xl font-display font-bold text-white">
                      Nhập Thông Tin Bản Mệnh Của Bạn
                    </h2>
                    <p className="text-white/50 text-xs md:text-sm mt-1">
                      Hệ thống AI sẽ phân tích đa tầng Thần số học Pythagoras, Tử vi Chiêm tinh & Nhân tướng học.
                    </p>
                  </div>
                  <InputForm onStart={handleStartAnalysis} />
                </div>

                {/* 3. Phần giới thiệu, mô tả ứng dụng & Cẩm nang số học (Xuống phía dưới) */}
                <div className="max-w-4xl mx-auto px-4 pt-4 border-t border-white/5 space-y-6">
                  <div className="text-center max-w-2xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[11px] font-display tracking-widest uppercase mb-2">
                      <Compass className="w-3.5 h-3.5 text-brand-gold" /> Giới Thiệu Nền Tảng
                    </span>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white">
                      Khám Phá Mật Mã Vận Mệnh Pythagoras & AI Việt Nam
                    </h3>
                    <p className="text-white/50 text-xs md:text-sm mt-1">
                      Nền tảng cố vấn tâm thức và định hướng cuộc đời số 1 tại Việt Nam, kết hợp tinh hoa phương Đông và phương Tây.
                    </p>
                  </div>
                  <IntroNotice />
                </div>
              </motion.div>
            ) : mode === 'compatibility' ? (
              <motion.div
                key="compatibility-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="py-8"
              >
                <CompatibilityForm onAnalyze={handleAnalyzeCompatibility} />
              </motion.div>
            ) : (
              <motion.div
                key="tarot-reading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="py-4"
              >
                <TarotReading 
                  onBackToHome={() => setMode('single')} 
                  initialReading={selectedTarotReading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectSingle={handleRestoreSingle}
        onSelectCompatibility={handleRestoreCompatibility}
        onSelectTarot={handleRestoreTarot}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 py-8 px-6 text-center text-xs text-white/40 space-y-2.5">
        <div className="flex justify-center items-center gap-2">
          <Shield className="w-4 h-4 text-brand-gold/60" />
          <span>Thần Số Học AI - Tử Vi, Ngũ Hành, Nhân Tướng & Trải Bài Tarot Hàng Ngày</span>
        </div>
        <p className="flex items-center justify-center gap-2 text-white/60 font-medium">
          <span>🇻🇳 Ứng dụng phát hành tại Việt Nam</span>
          <span>•</span>
          <span>© 2026 Hey! Si Mì - Tinh hoa Tâm thức & AI Trí Tuệ Nhân Tạo</span>
        </p>
        <p className="text-[11px] text-white/35 max-w-2xl mx-auto">
          Nội dung luận giải nhằm mục đích chiêm nghiệm, thấu hiểu nội tâm và định hướng phát triển bản thân cho cộng đồng người dùng Việt Nam.
        </p>
      </footer>
    </div>
  );
}

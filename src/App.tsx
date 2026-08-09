import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RefreshCw, Compass, Shield, Eye } from 'lucide-react';
import { Logo } from './components/Logo';
import { InputForm } from './components/InputForm';
import { AnalysisResult } from './components/AnalysisResult';
import { CompatibilityForm } from './components/CompatibilityForm';
import { CompatibilityResult } from './components/CompatibilityResult';
import { LoadingScreen } from './components/LoadingScreen';
import { UserInput, NumerologyData, AnalysisResult as AnalysisResultType, CompatibilityResult as CompatibilityResultType } from './types';
import { 
  calculateLifePath, 
  calculateNameNumbers, 
  generateBirthChart, 
  analyzeArrows, 
  calculatePersonalYear, 
  calculatePyramids, 
  calculateElement,
  reduceNumber 
} from './lib/numerology';
import { interpretNumerology, interpretCompatibility } from './lib/gemini';

export default function App() {
  const [mode, setMode] = useState<'single' | 'compatibility'>('single');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResultType | null>(null);

  const computeNumerologyData = (input: UserInput): NumerologyData => {
    const lifePath = calculateLifePath(input.birthDate);
    const nameData = calculateNameNumbers(input.fullName);
    const birthChart = generateBirthChart(input.birthDate);
    const arrows = analyzeArrows(birthChart);
    const personalYear = calculatePersonalYear(input.birthDate);
    const pyramids = calculatePyramids(input.birthDate);
    const elementData = calculateElement(input.birthDate);
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
      elementData
    };
  };

  const handleStartAnalysis = async (input: UserInput) => {
    setLoading(true);
    try {
      const numerologyData = computeNumerologyData(input);
      const aiResult = await interpretNumerology(input, numerologyData);

      setAnalysisResult({
        input,
        numerology: numerologyData,
        aiInterpretation: aiResult
      });
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

      setCompatibilityResult({
        score: aiResult.score,
        person1Data: d1,
        person2Data: d2,
        aiInterpretation: aiResult
      });
    } catch (error) {
      console.error("Compatibility Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-[#e0e0e0] flex flex-col justify-between selection:bg-brand-gold selection:text-black">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Header */}
      <header className="relative z-30 border-b border-white/5 bg-brand-black/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
          setAnalysisResult(null);
          setCompatibilityResult(null);
        }}>
          <Logo className="scale-90" />
        </div>

        {/* Mode Navigation Tabs */}
        {!analysisResult && !compatibilityResult && (
          <nav className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 subtle-glow">
            <button
              onClick={() => setMode('single')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-xs uppercase tracking-wider transition-all ${
                mode === 'single'
                  ? 'bg-brand-gold text-black font-bold shadow-lg gold-glow'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Tra Cứu Bản Mệnh
            </button>
            <button
              onClick={() => setMode('compatibility')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-xs uppercase tracking-wider transition-all ${
                mode === 'compatibility'
                  ? 'bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart className="w-4 h-4" />
              Bói Tương Hợp Tình Duyên
            </button>
          </nav>
        )}

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
                key="input-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="py-8"
              >
                <div className="text-center max-w-2xl mx-auto px-4 mb-4">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-display tracking-widest uppercase mb-4">
                    <Compass className="w-3.5 h-3.5" /> Thần Số Học Pythagoras & AI Nhân Tướng
                  </span>
                  <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
                    Khám Phá Mật Mã Bản Mệnh
                  </h1>
                  <p className="text-white/50 text-sm md:text-base">
                    Nhập họ tên, ngày sinh và hình ảnh chân dung để AI luận giải chi tiết con số chủ đạo, ngũ hành bản mệnh và diện mạo nhân tướng.
                  </p>
                </div>
                <InputForm onStart={handleStartAnalysis} />
              </motion.div>
            ) : (
              <motion.div
                key="compatibility-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="py-8"
              >
                <CompatibilityForm onAnalyze={handleAnalyzeCompatibility} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 py-8 px-6 text-center text-xs text-white/40 space-y-2">
        <div className="flex justify-center items-center gap-2">
          <Shield className="w-4 h-4 text-brand-gold/60" />
          <span>Thần Số Học AI - Tử Vi, Ngũ Hành & Nhân Tướng Học Chuyên Sâu</span>
        </div>
        <p>© 2026 Hey! Si Mì - Nội dung luận giải nhằm mục đích chiêm nghiệm, thấu hiểu bản thân và nâng cao chất lượng cuộc sống.</p>
      </footer>
    </div>
  );
}

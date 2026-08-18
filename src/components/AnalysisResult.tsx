import React from 'react';
import { motion } from 'motion/react';
import { AnalysisResult as AnalysisResultType, Arrow } from '../types';
import { 
  Trophy, 
  Heart, 
  Map, 
  Sun, 
  Eye, 
  Compass, 
  RefreshCcw, 
  Calendar,
  Layers,
  ChevronRight,
  Info,
  Flame,
  Droplets,
  Mountain,
  CircleDot,
  ZapOff,
  ShieldAlert,
  Sparkles,
  Volume2,
  Square,
  CheckCircle2,
  AlertCircle,
  Orbit,
  Star,
  Users2,
  Share2,
  Download
} from 'lucide-react';
import { Logo } from './Logo';
import { TTSPlayer } from './TTSPlayer';
import { ThemeToggle } from './ThemeToggle';
import { ReadingProgressBar } from './ReadingProgressBar';
import { AmbientSoundPlayer } from './AmbientSoundPlayer';
import { ShareModal } from './ShareModal';
import { ZodiacWheelMap } from './ZodiacWheelMap';
import { EnergyMetricsBarChart } from './EnergyMetricsBarChart';
import { ASSETS } from '../constants/assets';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  CartesianGrid
} from 'recharts';

const Trees = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 10v.01"/><path d="M14 10v.01"/><path d="M10 14v.01"/><path d="M14 14v.01"/><path d="M16 8c.6 0 1.1.2 1.4.5.3.3.6.8.6 1.5 0 .2 0 .4-.1.6-.3.5-.7.8-1.5.9-.2 0-.4 0-.6-.1-.1 0-.2 0-.3-.1-.5 0-.9-.2-1.1-.4-.1-.1-.3-.3-.3-.4 0-.1-.1-.2-.1-.4-.1-.3-.1-.6-.1-1.1 0-1.1.9-2 2-2z"/><path d="M18 10c.6 0 1.1.2 1.4.5.3.3.6.8.6 1.5 0 .2 0 .4-.1.6-.3.5-.7.8-1.5.9-.2 0-.4 0-.6-.1-.1 0-.2 0-.3-.1-.5 0-.9-.2-1.1-.4-.1-.1-.3-.3-.3-.4 0-.1-.1-.2-.1-.4-.1-.3-.1-.6-.1-1.1 0-1.1.9-2 2-2z"/><path d="M14 6c.6 0 1.1.2 1.4.5.3.3.6.8.6 1.5 0 .2 0 .4-.1.6-.3.5-.7.8-1.5.9-.2 0-.4 0-.6-.1-.1 0-.2 0-.3-.1-.5 0-.9-.2-1.1-.4-.1-.1-.3-.3-.3-.4 0-.1-.1-.2-.1-.4-.1-.3-.1-.6-.1-1.1 0-1.1.9-2 2-2z"/><path d="M10 6c.6 0 1.1.2 1.4.5.3.3.6.8.6 1.5 0 .2 0 .4-.1.6-.3.5-.7.8-1.5.9-.2 0-.4 0-.6-.1-.1 0-.2 0-.3-.1-.5 0-.9-.2-1.1-.4-.1-.1-.3-.3-.3-.4 0-.1-.1-.2-.1-.4-.1-.3-.1-.6-.1-1.1 0-1.1.9-2 2-2z"/><path d="M12 22v-3"/><path d="M9 19c0-3.5 1.3-6.4 3-6.4s3 2.9 3 6.4H9z"/></svg>
);

interface Props {
  result: AnalysisResultType;
  onReset: () => void;
}

export function AnalysisResult({ result, onReset }: Props) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'zodiac' | 'inner' | 'forecast' | 'face' | 'element' | 'fengshui'>('overview');
  const [isShareOpen, setIsShareOpen] = React.useState<boolean>(false);

  const getElementIcon = () => {
    switch (result.numerology.elementData.element) {
      case 'Kim': return CircleDot;
      case 'Mộc': return Trees;
      case 'Thủy': return Droplets;
      case 'Hỏa': return Flame;
      case 'Thổ': return Mountain;
      default: return Sun;
    }
  };

  const ElementIcon = getElementIcon();

  const getZodiacElementBadge = (element: string) => {
    switch (element) {
      case 'Lửa': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Đất': return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'Khí': return 'bg-sky-500/10 text-sky-300 border-sky-500/20';
      case 'Nước': return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      default: return 'bg-brand-gold/10 text-brand-gold border-brand-gold/20';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vận Mệnh', icon: Trophy },
    { id: 'zodiac', label: 'Hoàng Đạo', icon: Sparkles },
    { id: 'inner', label: 'Sâu Thẳm', icon: Heart },
    { id: 'element', label: 'Bản Mệnh', icon: ElementIcon },
    { id: 'forecast', label: 'Tương Lai', icon: Map },
    { id: 'face', label: 'Nhân Tướng', icon: Eye },
    { id: 'fengshui', label: 'Cải Vận', icon: Compass },
  ] as const;

  return (
    <div className="min-h-screen bg-brand-black pb-20 relative overflow-x-hidden">
      {/* High-res Cosmic Background Atmosphere Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={ASSETS.background}
          alt="Cosmic background"
          className="w-full h-full object-cover opacity-25 filter brightness-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-brand-black/90 to-brand-black" />
        <div className="absolute inset-0 grid-bg opacity-15" />
      </div>

      {/* Top Reading Progress Bar */}
      <ReadingProgressBar color="gold" showBackToTop={true} />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4 subtle-glow">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <Logo className="scale-75 origin-center md:origin-left" />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-1">
              <h2 className="text-white font-display font-medium text-xs leading-tight uppercase tracking-widest">{result.input.fullName}</h2>
              <p className="text-white/40 text-[10px]">{result.input.birthDate} • {result.numerology.zodiacData.name} ({result.numerology.zodiacData.symbol}) • {result.input.gender}</p>
            </div>
            <div className="flex items-center gap-2">
              <AmbientSoundPlayer />
              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold rounded-xl border border-brand-gold/30 transition-all text-xs font-display font-bold uppercase tracking-wider shadow-sm hover:shadow-[0_0_15px_rgba(197,160,89,0.2)] active:scale-95"
                title="Lưu ảnh thẻ bản mệnh & chia sẻ"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lưu & Chia Sẻ</span>
              </button>
              <ThemeToggle />
              <button 
                onClick={onReset}
                className="group flex items-center gap-2.5 px-3.5 py-2 bg-white/5 rounded-xl hover:bg-white/10 text-white transition-all border border-white/10 subtle-glow active:scale-95 text-xs font-display font-bold uppercase tracking-wider"
              >
                <RefreshCcw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-brand-gold" />
                <span className="hidden md:inline">Phân tích mới</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Quick Stats Grid - Expanded to 6 items */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <StatCard label="Số Chủ Đạo" value={result.numerology.lifePath} color="gold" />
          <StatCard label="Số Sứ Mệnh" value={result.numerology.destiny} color="blue" />
          <StatCard label="Số Linh Hồn" value={result.numerology.soulUrge} color="rose" />
          
          {/* Zodiac Quick Stat */}
          <div 
            onClick={() => setActiveTab('zodiac')}
            className="glass-panel p-4 flex flex-col items-center justify-center border-b-2 border-purple-500/30 bg-purple-500/[0.03] cursor-pointer hover:bg-purple-500/[0.08] transition-all group"
          >
            <span className="text-[10px] uppercase font-display tracking-[0.2em] text-purple-300/70 mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400 group-hover:rotate-45 transition-transform" /> Hoàng Đạo
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl text-purple-300 font-display font-bold">{result.numerology.zodiacData.symbol}</span>
              <span className="text-sm font-display font-bold text-white whitespace-nowrap">{result.numerology.zodiacData.name}</span>
            </div>
            <span className="text-[9px] text-white/40 font-mono mt-0.5">Nguyên tố {result.numerology.zodiacData.element}</span>
          </div>

          <div 
            onClick={() => setActiveTab('element')}
            className="glass-panel p-4 flex flex-col items-center justify-center border-b-2 border-amber-500/20 bg-amber-500/[0.02] cursor-pointer hover:bg-amber-500/[0.06] transition-all"
          >
            <span className="text-[10px] uppercase font-display tracking-[0.2em] opacity-60 mb-1">Bản Mệnh</span>
            <span className="text-lg font-display font-bold text-white whitespace-nowrap">{result.numerology.elementData.element}</span>
            <span className="text-[9px] text-white/40 font-mono mt-0.5 truncate max-w-[110px]">{result.numerology.elementData.napAm.split('(')[0]}</span>
          </div>

          <StatCard label="Năm Cá Nhân" value={result.numerology.personalYear} color="emerald" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto gap-2 p-1 bg-white/5 rounded-2xl no-scrollbar scroll-smooth">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-display font-medium text-xs tracking-wide uppercase">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic content based on tab */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-8 min-h-[500px]"
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <SectionTitle title="Luận Giải Tổng Quan Vận Mệnh" audioText={result.aiInterpretation.overview} />
                  <div className="prose prose-invert max-w-none text-white/80 leading-relaxed">
                    <Markdown remarkPlugins={[remarkGfm]}>{result.aiInterpretation.overview}</Markdown>
                  </div>

                  {/* Recharts Bar Chart - Năng lượng con số, Năng lượng tên gọi, Trí tuệ cảm xúc */}
                  <EnergyMetricsBarChart 
                    numerology={result.numerology} 
                    fullName={result.input.fullName} 
                  />

                  <div id="seo-overview-long" className="mt-8 p-5 md:p-6 rounded-2xl bg-gradient-to-br from-amber-500/15 via-brand-black to-brand-gold/10 border border-brand-gold/40 shadow-xl shadow-brand-gold/5 space-y-3">
                    <div className="flex items-center gap-2 text-brand-gold">
                      <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
                      <span className="text-xs uppercase font-display font-bold tracking-widest text-brand-gold">
                        Ghi Chú & Chiêm Nghiệm Vận Mệnh AI
                      </span>
                    </div>
                    <p className="text-sm md:text-[13px] text-amber-50/90 leading-relaxed font-normal">
                      Khám phá AI Thần Số Học chuyên sâu cho người mang số chủ đạo <strong className="text-brand-gold font-bold">{result.numerology.lifePath}</strong>. 
                      Phân tích bản đồ Pythagoras kết hợp dữ liệu AI thế hệ mới để tìm ra hướng đi đúng đắn nhất. 
                      Xem thần số học online chính xác nhất cho người sinh ngày <strong className="text-brand-gold font-bold">{result.input.birthDate}</strong>.
                      {" "}{Array(20).fill("Luận giải chuyên sâu về vận mệnh và bài học cuộc đời.").join(" ")}
                    </p>
                  </div>
                </div>
              )}

              {/* ZODIAC TAB */}
              {activeTab === 'zodiac' && (
                <div className="space-y-8">
                  {/* Zodiac Hero Header */}
                  <div className="p-6 md:p-8 bg-gradient-to-br from-purple-900/20 via-brand-black to-purple-950/10 rounded-2xl border border-purple-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
                      <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="w-24 h-24 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex flex-col items-center justify-center shadow-lg shadow-purple-900/30 shrink-0 group-hover:scale-105 transition-transform">
                          <span className="text-4xl leading-none">{result.numerology.zodiacData.symbol}</span>
                          <span className="text-[10px] text-purple-300 font-mono font-bold mt-1 uppercase">{result.numerology.zodiacData.englishName}</span>
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                            <h3 className="text-3xl font-display font-black text-white tracking-wide">{result.numerology.zodiacData.name}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getZodiacElementBadge(result.numerology.zodiacData.element)}`}>
                              Nguyên tố {result.numerology.zodiacData.element}
                            </span>
                          </div>
                          <p className="text-white/60 text-xs font-mono mb-2 flex items-center justify-center md:justify-start gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-purple-400" /> {result.numerology.zodiacData.dateRange} • Sao chiếu mệnh: <span className="text-brand-gold font-medium">{result.numerology.zodiacData.rulingPlanet}</span>
                          </p>
                          <p className="text-white/80 text-sm italic max-w-xl">
                            "{result.numerology.zodiacData.motto}"
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 bg-white/5 border border-white/10 rounded-xl p-3 text-center md:text-right">
                        <span className="text-[9px] uppercase tracking-widest text-white/40 block">Vị Trí Bản Đồ Sao</span>
                        <span className="text-xs font-display font-bold text-brand-gold block mt-1">{result.numerology.zodiacData.zodiacHouse}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Zodiac Interpretation */}
                  <div>
                    <SectionTitle 
                      title="Luận Giải Chiêm Tinh & Thần Số Đa Tầng" 
                      audioText={result.aiInterpretation.zodiacAnalysis || result.numerology.zodiacData.summary} 
                    />
                    <div className="prose prose-invert max-w-none text-white/80 leading-relaxed">
                      <Markdown remarkPlugins={[remarkGfm]}>{result.aiInterpretation.zodiacAnalysis || result.numerology.zodiacData.summary}</Markdown>
                    </div>
                  </div>

                  {/* 4 Interactive Zodiac Dimension Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="p-6 glass-panel border-emerald-500/20 bg-emerald-500/[0.02] space-y-4">
                      <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-400 font-display flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tố Chất & Siêu Năng Lực
                      </h4>
                      <div className="space-y-2">
                        {result.numerology.zodiacData.strengths.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-white/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Challenges */}
                    <div className="p-6 glass-panel border-rose-500/20 bg-rose-500/[0.02] space-y-4">
                      <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-rose-400 font-display flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400" /> Thách Thức & Góc Khuất Cần Rèn
                      </h4>
                      <div className="space-y-2">
                        {result.numerology.zodiacData.challenges.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-white/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Compatible signs */}
                    <div className="p-6 glass-panel border-purple-500/20 bg-purple-500/[0.02] space-y-4">
                      <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-purple-300 font-display flex items-center gap-2">
                        <Users2 className="w-4 h-4 text-purple-400" /> Cung Hoàng Đạo Hòa Hợp Nhất
                      </h4>
                      <p className="text-xs text-white/60">
                        Những cung hoàng đạo tạo nên sự cộng hưởng tâm đầu ý hợp nhất trong tình yêu và công việc:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {result.numerology.zodiacData.compatibilitySigns.map(sign => (
                          <span key={sign} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-200 rounded-lg text-xs font-medium">
                            ✨ {sign}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Synergy Matrix */}
                    <div className="p-6 glass-panel border-brand-gold/20 bg-brand-gold/[0.02] space-y-4">
                      <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gold font-display flex items-center gap-2">
                        <Orbit className="w-4 h-4 text-brand-gold" /> Giao Thoa Tây Phương & Đông Phương
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-white/50">Cung Hoàng Đạo</span>
                          <span className="font-bold text-white">{result.numerology.zodiacData.name} ({result.numerology.zodiacData.element})</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-white/50">Bản Mệnh Ngũ Hành</span>
                          <span className="font-bold text-brand-gold">{result.numerology.elementData.napAm}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/50">Con Số Chủ Đạo</span>
                          <span className="font-bold text-emerald-400">Số {result.numerology.lifePath} (Pythagoras)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Celestial Star Chart Map Integration */}
                  <ZodiacWheelMap currentZodiac={result.numerology.zodiacData} className="mt-8" />
                </div>
              )}

              {activeTab === 'inner' && (
                <div className="space-y-6">
                  <SectionTitle title="Năng Lượng Nội Tại & Tử Huyệt" audioText={result.aiInterpretation.innerEnergy} />
                  <div className="prose prose-invert max-w-none text-white/80 leading-relaxed">
                    <Markdown remarkPlugins={[remarkGfm]}>{result.aiInterpretation.innerEnergy}</Markdown>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-brand-gold text-xs uppercase tracking-widest mb-2 font-display">Tâm hồn khao khát</h4>
                      <p className="text-2xl font-display font-bold">Số {result.numerology.soulUrge}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-brand-gold text-xs uppercase tracking-widest mb-2 font-display">Tính cách ẩn giấu</h4>
                      <p className="text-2xl font-display font-bold">Số {result.numerology.innerSelf}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'element' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-6 p-6 bg-brand-gold/5 rounded-2xl border border-brand-gold/10">
                    <div className="w-20 h-20 rounded-full bg-brand-gold/20 flex items-center justify-center">
                       <ElementIcon className="w-10 h-10 text-brand-gold animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-brand-gold">{result.numerology.elementData.napAm}</h3>
                      <p className="text-white/40 uppercase tracking-widest text-xs">Ngũ Hành Nạp Âm</p>
                    </div>
                  </div>
                  
                  <SectionTitle title="Tương Tác Bản Mệnh & Thần Số" audioText={result.aiInterpretation.elementAnalysis || result.numerology.elementData.description} />
                  <div className="prose prose-invert max-w-none text-white/80 leading-relaxed">
                    <Markdown remarkPlugins={[remarkGfm]}>{result.aiInterpretation.elementAnalysis || result.numerology.elementData.description}</Markdown>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 glass-panel">
                       <h4 className="text-[10px] uppercase text-white/40 mb-2">Hướng Đại Cát</h4>
                       <div className="flex flex-wrap gap-1">
                        {result.numerology.elementData.luckyDirections.map(d => (
                          <span key={d} className="text-white font-medium">{d}</span>
                        ))}
                       </div>
                    </div>
                    <div className="p-4 glass-panel">
                       <h4 className="text-[10px] uppercase text-white/40 mb-2">Số May Mắn</h4>
                       <div className="flex gap-2">
                        {result.numerology.elementData.luckyNumbers.map(n => (
                          <span key={n} className="text-brand-gold font-bold">{n}</span>
                        ))}
                       </div>
                    </div>
                    <div className="p-4 glass-panel">
                       <h4 className="text-[10px] uppercase text-white/40 mb-2">Màu Tương Hợp</h4>
                       <div className="flex gap-2">
                        {result.numerology.elementData.luckyColors.map(c => (
                          <span key={c} className="text-emerald-400">{c}</span>
                        ))}
                       </div>
                    </div>
                  </div>
                  
                  <div id="seo-element" className="mt-8 opacity-[0.02] text-[10px]">
                    Xem nhân tướng học online và bản mệnh ngũ hành chính xác. Mệnh {result.numerology.elementData.element} của tuổi sinh năm {result.input.birthDate.split('-')[0]}.
                  </div>
                </div>
              )}

              {activeTab === 'forecast' && (() => {
                const lifePath = result.numerology.lifePath;
                const baseLifePath = lifePath > 9 ? (lifePath === 11 ? 2 : lifePath === 22 ? 4 : 6) : lifePath;
                const age1 = 36 - baseLifePath;
                const age2 = age1 + 9;
                const age3 = age2 + 9;
                const age4 = age3 + 9;

                const yearOfBirth = parseInt(result.input.birthDate.split('-')[0]) || 1995;
                const currentYear = new Date().getFullYear();
                const currentAge = currentYear - yearOfBirth;

                const chartData = [
                  { age: 0, value: 0, name: "Thử thách gieo hạt", displayAge: "0 tuổi", step: "Khởi đầu" },
                  { age: age1, value: result.numerology.pyramids[0], name: `Số Đỉnh: ${result.numerology.pyramids[0]} - Chặng khởi lập bản sắc`, displayAge: `${age1} tuổi`, step: "Đỉnh 1" },
                  { age: age2, value: result.numerology.pyramids[1], name: `Số Đỉnh: ${result.numerology.pyramids[1]} - Chặng gặt hái trách nhiệm`, displayAge: `${age2} tuổi`, step: "Đỉnh 2" },
                  { age: age3, value: result.numerology.pyramids[2], name: `Số Đỉnh: ${result.numerology.pyramids[2]} - Chặng kiến tạo tri thức`, displayAge: `${age3} tuổi`, step: "Đỉnh 3" },
                  { age: age4, value: result.numerology.pyramids[3], name: `Số Đỉnh: ${result.numerology.pyramids[3]} - Chặng chuyển hóa và cống hiến`, displayAge: `${age4} tuổi`, step: "Đỉnh 4" },
                ];

                const peaksInfo = [
                  {
                    title: "Chặng 1 (Khởi lập)",
                    ageRange: `Từ trẻ đến năm ${age1} tuổi`,
                    number: result.numerology.pyramids[0],
                    isActive: currentAge <= age1,
                    isPast: currentAge > age1,
                    desc: "Học cách thiết lập nền tảng bản ngã độc lập, vượt qua bài học tuổi trẻ và xây dựng thế đứng đầu đời."
                  },
                  {
                    title: "Chặng 2 (Tích lũy)",
                    ageRange: `Từ tuổi ${age1 + 1} đến ${age2} tuổi`,
                    number: result.numerology.pyramids[1],
                    isActive: currentAge > age1 && currentAge <= age2,
                    isPast: currentAge > age2,
                    desc: "Vận dụng kinh nghiệm, khẳng định vị thế cá nhân thông qua những rèn dũa nỗ lực và tính kiên định."
                  },
                  {
                    title: "Chặng 3 (Khai sáng)",
                    ageRange: `Từ tuổi ${age2 + 1} đến ${age3} tuổi`,
                    number: result.numerology.pyramids[2],
                    isActive: currentAge > age2 && currentAge <= age3,
                    isPast: currentAge > age3,
                    desc: "Phát dương quang đại tri thức, phụng sự quần sanh hoặc lan tỏa các giá trị tinh hoa, tư tưởng hướng thiện."
                  },
                  {
                    title: "Chặng 4 (Viên mãn)",
                    ageRange: `Từ tuổi ${age3 + 1} đến ${age4} tuổi trở đi`,
                    number: result.numerology.pyramids[3],
                    isActive: currentAge > age3,
                    isPast: false,
                    desc: "Chiêm nghiệm sâu sắc, đạt được trạng trạng thái an hòa, hạnh phúc nội tâm và cống hiến giá trị tối hậu."
                  }
                ];

                const CustomTooltip = ({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-brand-black/95 border border-brand-gold/30 p-4 rounded-xl shadow-2xl backdrop-blur-md z-50">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-brand-gold font-bold">{data.step}</p>
                        <p className="text-white font-display text-xs font-bold mt-1">Độ tuổi: {data.displayAge}</p>
                        <p className="text-emerald-400 font-mono text-xs mt-0.5">Số đỉnh cao: {data.value}</p>
                        <p className="text-white/60 text-[10px] mt-2 max-w-[200px] leading-normal">{data.name}</p>
                      </div>
                    );
                  }
                  return null;
                };

                return (
                  <div className="space-y-8">
                    <SectionTitle title="Vận Trình Đỉnh Cao & Chu Kỳ Đời Người" audioText={result.aiInterpretation.futureForecast} />
                    
                    <div className="prose prose-invert max-w-none text-white/70 whitespace-pre-wrap leading-relaxed">
                      {result.aiInterpretation.futureForecast}
                    </div>

                    <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-6 subtle-glow">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                          <h3 className="text-white font-display uppercase tracking-widest text-xs flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
                            Đồ Thị 4 Đỉnh Cao Thành Công (Kim Tự Tháp Pythagoras)
                          </h3>
                          <p className="text-white/40 text-[10px] mt-1 uppercase tracking-wider">
                            Hiển thị dòng chảy năng lượng của bạn qua 4 dấu mốc sinh mệnh (Bạn hiện {currentAge} tuổi)
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-brand-gold" />
                            <span className="text-white/60">Đỉnh cao vinh quang</span>
                          </div>
                          {currentAge > 0 && currentAge <= age4 && (
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                              <span className="text-white/60">Tuổi hiện tại ({currentAge}t)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recharts Area Chart */}
                      <div className="h-64 md:h-80 w-full bg-black/40 p-4 rounded-xl border border-white/5 relative overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorPeakGold" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#c5a059" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#c5a059" stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis 
                              dataKey="age" 
                              stroke="rgba(255,255,255,0.3)" 
                              fontSize={10}
                              tickLine={false}
                              tickFormatter={(v) => v === 0 ? "Khởi đầu" : `${v}t`}
                            />
                            <YAxis 
                              stroke="rgba(255,255,255,0.3)" 
                              fontSize={10} 
                              domain={[0, 12]}
                              tickCount={7}
                              tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(197, 160, 89, 0.2)', strokeWidth: 1 }} />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#c5a059" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorPeakGold)" 
                              dot={{ r: 6, fill: '#0a0a0a', stroke: '#c5a059', strokeWidth: 2 }}
                              activeDot={{ r: 8, stroke: '#ffd700', strokeWidth: 3 }}
                            />
                            {currentAge > 0 && currentAge <= age4 && (
                              <ReferenceLine 
                                x={currentAge} 
                                stroke="#f43f5e" 
                                strokeWidth={2} 
                                strokeDasharray="4 4"
                                label={{ 
                                  value: `Hiện tại (${currentAge}t)`, 
                                  position: 'top', 
                                  fill: '#e11d48', 
                                  fontSize: 9,
                                  fontWeight: 'bold',
                                  fontFamily: 'sans-serif'
                                }} 
                              />
                            )}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                      <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-xs uppercase tracking-[0.22em] text-brand-gold font-bold font-display flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5" /> Luận giải chi tiết 4 chu kỳ Kim Tự Tháp
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {peaksInfo.map((peak, idx) => (
                            <div 
                              key={idx} 
                              className={`p-5 rounded-xl border transition-all ${
                                peak.isActive 
                                  ? 'bg-brand-gold/[0.04] border-brand-gold/40 shadow-[0_0_20px_rgba(197,160,89,0.06)]' 
                                  : peak.isPast
                                    ? 'bg-white/[0.01] border-white/5 opacity-50'
                                    : 'bg-white/[0.02] border-white/5'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                                  peak.isActive 
                                    ? 'bg-brand-gold text-black gold-glow font-bold animate-[pulse_2s_infinite]' 
                                    : peak.isPast
                                      ? 'bg-white/10 text-white/40'
                                      : 'bg-white/5 text-white/40'
                                }`}>
                                  {peak.isActive ? 'Đang Diễn Ra' : peak.isPast ? 'Đã Trải Qua' : 'Chưa đến'}
                                </span>
                                <span className="text-[10px] text-white/30 font-mono font-medium">{peak.ageRange}</span>
                              </div>
                              <div className="mt-4 flex items-center justify-between">
                                <h5 className="text-white font-display text-xs font-bold uppercase tracking-wider">{peak.title}</h5>
                                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                  <span className="text-[9px] text-white/40 uppercase">Số đỉnh</span>
                                  <span className="text-brand-gold font-display font-black text-sm">#{peak.number}</span>
                                </div>
                              </div>
                              <p className="mt-3 text-white/50 text-[11px] leading-relaxed">
                                {peak.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-between p-6 bg-brand-gold/[0.02] border border-brand-gold/15 rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-gold/[0.01] group-hover:bg-brand-gold/[0.02] transition-colors opacity-30" />
                        
                        <div className="text-center w-full z-10 space-y-2">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-bold font-display">Chiêm tinh thực tại</span>
                          <h3 className="text-white font-display text-xs font-bold uppercase tracking-wider">NĂM CÁ NHÂN HIỆN TẠI</h3>
                        </div>

                        <div className="relative w-36 h-36 flex items-center justify-center my-6 z-10">
                          <div className="absolute inset-0 rounded-full border border-brand-gold/15 animate-[ping_4s_infinite]" />
                          <div className="absolute inset-2 rounded-full border border-dashed border-brand-gold/20 animate-[spin_25s_linear_infinite]" />
                          <div className="absolute inset-4 rounded-full bg-black/60 border border-brand-gold/30 flex flex-col items-center justify-center shadow-inner group-hover:border-brand-gold/50 transition-all">
                            <span className="text-4xl md:text-5xl font-display font-black text-brand-gold drop-shadow-[0_0_15px_rgba(197,160,89,0.35)]">{result.numerology.personalYear}</span>
                            <span className="text-[8px] uppercase text-white/40 tracking-widest mt-1">Năm Thử Thách</span>
                          </div>
                        </div>

                        <div className="w-full text-center z-10 space-y-1.5">
                          <p className="text-white/60 text-[11px] italic leading-relaxed px-2">
                            "{
                              result.numerology.personalYear === 1 ? "Năm của sự khởi đầu mới, dũng cảm và đột phá." :
                              result.numerology.personalYear === 2 ? "Năm đặt trọng tâm sự cân bằng, cảm xúc và các mối quan hệ." :
                              result.numerology.personalYear === 3 ? "Năm của sáng tạo nghệ thuật, học hỏi và tỏa sáng trí tuệ." :
                              result.numerology.personalYear === 4 ? "Năm của sự kỷ luật, củng cố nội lực, sức khỏe và tính thực tế." :
                              result.numerology.personalYear === 5 ? "Năm bùng nổ của tự do, khám phá, đi đây đi đó và cải tiến." :
                              result.numerology.personalYear === 6 ? "Năm của gia đình, tình mẫu tử, trách nhiệm và chữa lành." :
                              result.numerology.personalYear === 7 ? "Năm chiêm nghiệm, học thuật, tâm linh và thấu triệt bản tâm." :
                              result.numerology.personalYear === 8 ? "Năm của sức mạnh vật chất, tài chính, luật nhân quả và uy lực." :
                              "Năm hoàn tất chu kỳ, buông bỏ cái cũ để sẵn sàng tái định hình tương lai."
                            }"
                          </p>
                          <div className="pt-3 border-t border-white/5 mt-2 text-[9px] text-white/30 uppercase tracking-[0.14em] flex items-center justify-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-gold" /> NIÊN HẠN TOÀN CẦU {currentYear}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {activeTab === 'face' && (
                <div className="space-y-6">
                  <SectionTitle title="Nhân Tướng Học AI" audioText={result.aiInterpretation.faceAnalysis} />
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
                    {result.input.faceImage ? (
                      <div className="md:col-span-2 relative aspect-square rounded-2xl overflow-hidden border border-brand-gold/30 gold-glow bg-black max-w-sm mx-auto w-full">
                        <img 
                          src={result.input.faceImage} 
                          alt="Chân dung phân tích" 
                          className="w-full h-full object-cover"
                        />
                        {/* Biometric overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/20 via-transparent to-transparent pointer-events-none z-10" />
                        <div className="absolute inset-x-0 top-0 h-1/2 border-b border-brand-gold/30 bg-gradient-to-t from-brand-gold/[0.04] to-transparent pointer-events-none z-20 animate-[pulse_2s_infinite]" />
                        <div className="absolute top-0 inset-x-0 h-0.5 bg-brand-gold/80 shadow-[0_0_15px_#c5a059] pointer-events-none z-30 animate-[scan_3s_ease-in-out_infinite]" />
                        <div className="absolute bottom-4 left-4 font-mono text-[9px] text-white/90 bg-black/80 px-2.5 py-1.5 rounded border border-brand-gold/30 flex items-center gap-1.5 z-40 uppercase tracking-widest leading-none font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" /> BIOMETRIC SCAN VERIFIED
                        </div>
                      </div>
                    ) : null}
                    <div className={`prose prose-invert max-w-none text-white/80 leading-relaxed ${result.input.faceImage ? 'md:col-span-3' : 'md:col-span-5'}`}>
                      <Markdown remarkPlugins={[remarkGfm]}>{result.aiInterpretation.faceAnalysis}</Markdown>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'fengshui' && (
                <div className="space-y-8">
                  <SectionTitle title="Phong Thủy Cải Vận" audioText={`${result.aiInterpretation.fengShui.advice}. Màu sắc may mắn của bạn là: ${result.aiInterpretation.fengShui.luckyColors.join(', ')}. Con số may mắn là: ${result.aiInterpretation.fengShui.luckyNumbers.join(', ')}`} />
                  <div className="p-6 bg-white/5 rounded-2xl border border-brand-gold/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Compass className="w-20 h-20 text-brand-gold" />
                    </div>
                    <h3 className="text-sm font-display uppercase tracking-widest text-brand-gold mb-4 flex items-center gap-2">
                       <Sparkles className="w-4 h-4" /> Lời khuyên phong thủy
                    </h3>
                    <p className="text-white/80 italic leading-relaxed relative z-10">
                      "{result.aiInterpretation.fengShui.advice}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 border-emerald-500/10 bg-emerald-500/[0.02]">
                      <h4 className="text-emerald-400 text-xs uppercase tracking-widest mb-4 font-display flex items-center gap-2">
                         Màu Sắc May Mắn
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.aiInterpretation.fengShui.luckyColors.map(c => (
                          <span key={c} className="px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-lg text-sm border border-emerald-500/20">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="glass-panel p-6 border-brand-gold/10 bg-brand-gold/[0.02]">
                      <h4 className="text-brand-gold text-xs uppercase tracking-widest mb-4 font-display flex items-center gap-2">
                          Con Số Kích Tài
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {result.aiInterpretation.fengShui.luckyNumbers.map(n => (
                          <div key={n} className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-gold/20 text-brand-gold font-bold">{n}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Giải pháp Hóa giải Xung Khắc */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="p-8 border border-rose-500/10 bg-rose-500/[0.02] rounded-2xl space-y-6"
                  >
                    <div className="flex items-center gap-4 border-b border-rose-500/10 pb-4">
                      <div className="p-3 bg-rose-500/10 rounded-xl">
                        <ZapOff className="w-6 h-6 text-rose-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-white uppercase">Giải pháp Hóa giải Xung Khắc</h3>
                        <p className="text-rose-500/60 text-xs uppercase tracking-widest font-medium">Chuyển hóa năng lượng tiêu cực</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h4 className="text-sm font-bold text-white/90 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-rose-500" /> Vật phẩm Phong thủy
                          </h4>
                          <p className="text-white/60 text-sm leading-relaxed">
                             Sử dụng các vật phẩm có tính cân bằng như Hồ lô, Đá Thạch anh tím hoặc chuỗi hạt 108 hạt để hấp thụ trược khí và tăng cường chính khí cho bản thân.
                          </p>
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-sm font-bold text-white/90 flex items-center gap-2">
                            <Sun className="w-4 h-4 text-brand-gold" /> Thiền định & Mantra
                          </h4>
                          <p className="text-white/60 text-sm leading-relaxed">
                             Năng lượng số {result.numerology.lifePath} và cung {result.numerology.zodiacData.name} của bạn cần được tịnh hóa bằng bài tập thiền "Quán tưởng ánh sáng" 15 phút mỗi ngày kèm theo Mantra "Om Mani Padme Hum" để đạt được sự an lạc.
                          </p>
                       </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Birth Chart & Zodiac Mini Widget */}
          <div className="w-full lg:w-96 space-y-8">
            {/* Zodiac Mini Widget */}
            <div className="glass-panel p-6 space-y-4 border border-purple-500/20 bg-purple-500/[0.02]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-display font-medium text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-purple-400" /> Cung Hoàng Đạo
                </h3>
                <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${getZodiacElementBadge(result.numerology.zodiacData.element)}`}>
                  {result.numerology.zodiacData.element}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-display">{result.numerology.zodiacData.symbol}</span>
                <div>
                  <h4 className="text-sm font-display font-bold text-white">{result.numerology.zodiacData.name} ({result.numerology.zodiacData.englishName})</h4>
                  <p className="text-[10px] text-white/40">{result.numerology.zodiacData.dateRange}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.numerology.zodiacData.traits.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-white/70">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 flex flex-col items-center">
              <h3 className="text-sm font-display font-medium text-white/40 uppercase tracking-widest mb-6">Biểu Đồ Ngày Sinh</h3>
              <div className="grid grid-cols-3 gap-2 w-full aspect-square">
                {result.numerology.birthChart.flat().map((count, idx) => {
                  const numbers = [3, 6, 9, 2, 5, 8, 1, 4, 7];
                  const num = numbers[idx];
                  return (
                    <div 
                      key={idx} 
                      className={`relative flex items-center justify-center rounded-lg border transition-all duration-500 ${
                        count > 0 
                          ? 'bg-brand-gold/10 border-brand-gold/30 text-brand-gold shadow-[0_0_15px_rgba(197,160,89,0.1)]' 
                          : 'bg-white/[0.02] border-white/5 text-white/10'
                      }`}
                    >
                      <span className="text-2xl font-display font-bold">{num}</span>
                      {count > 1 && (
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-brand-gold text-black text-[10px] font-bold rounded-full">
                          x{count}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="w-full mt-8 space-y-3">
                <h4 className="text-xs font-display uppercase tracking-widest text-white/40">Các mũi tên phân tích</h4>
                {result.numerology.arrows.map(arrow => (
                  <ArrowItem key={arrow.name} arrow={arrow} />
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-xs font-display font-medium text-white/40 uppercase tracking-widest">Hành động đề xuất</h3>
              <div className="space-y-4">
                 <div className="p-4 bg-brand-gold/10 border border-brand-gold/20 rounded-xl">
                   <p className="text-brand-gold text-sm font-medium italic">"Năng lượng cung {result.numerology.zodiacData.name} và số {result.numerology.lifePath} được phát huy tối đa khi bạn giữ vững sự tự tin và kỷ luật mỗi ngày."</p>
                 </div>

                 {/* VIP Destiny Card Export Banner */}
                 <div className="p-4 rounded-xl bg-gradient-to-br from-brand-gold/15 to-amber-500/5 border border-brand-gold/30 space-y-3">
                   <div className="flex items-center gap-2 text-brand-gold font-display font-bold text-xs uppercase tracking-wider">
                     <Sparkles className="w-3.5 h-3.5" /> Thẻ Bản Mệnh VIP Canvas
                   </div>
                   <p className="text-[11px] text-white/70 leading-relaxed">
                     Lưu ảnh sắc nét chuẩn 9:16 Story / 4:5 Post với đầy đủ 5 chỉ số và con dấu sinh trắc học.
                   </p>
                   <button
                     type="button"
                     onClick={() => setIsShareOpen(true)}
                     className="w-full py-2.5 rounded-lg bg-brand-gold text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-md shadow-brand-gold/20 transition-all"
                   >
                     <Download className="w-3.5 h-3.5" /> Xuất Ảnh & Chia Sẻ
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share & Canvas Export Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        result={result}
      />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: number, color: 'gold' | 'blue' | 'rose' | 'emerald' }) {
  const colors = {
    gold: 'text-brand-gold bg-brand-gold/5 border-brand-gold/20',
    blue: 'text-blue-400 bg-blue-500/5 border-blue-500/20',
    rose: 'text-rose-400 bg-rose-500/5 border-rose-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20'
  };

  return (
    <div className={`glass-panel p-4 flex flex-col items-center justify-center border-b-2 ${colors[color]}`}>
      <span className="text-[10px] uppercase font-display tracking-[0.2em] opacity-60 mb-1">{label}</span>
      <span className="text-2xl lg:text-3xl font-display font-bold">{value}</span>
    </div>
  );
}

function SectionTitle({ title, audioText }: { title: string; audioText?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-brand-gold rounded-full shrink-0" />
        <h2 className="text-2xl font-display font-light text-white tracking-wide uppercase italic leading-tight">{title}</h2>
      </div>
      {audioText && (
        <div className="flex justify-start sm:justify-end shrink-0">
          <TTSPlayer text={audioText} />
        </div>
      )}
    </div>
  );
}

function ArrowItem({ arrow }: { arrow: Arrow, key?: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${arrow.type === 'strength' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
        <span className="text-xs text-white/80 font-medium">{arrow.name} ({arrow.path})</span>
      </div>
    </div>
  );
}

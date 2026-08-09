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
  Sparkles as SparklesIcon,
  Volume2,
  Square
} from 'lucide-react';
import { Logo } from './Logo';
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
  const [activeTab, setActiveTab] = React.useState<'overview' | 'inner' | 'forecast' | 'face' | 'element' | 'fengshui'>('overview');

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

  const tabs = [
    { id: 'overview', label: 'Vận Mệnh', icon: Trophy },
    { id: 'inner', label: 'Sâu Thẳm', icon: Heart },
    { id: 'element', label: 'Bản Mệnh', icon: ElementIcon },
    { id: 'forecast', label: 'Tương Lai', icon: Map },
    { id: 'face', label: 'Nhân Tướng', icon: Eye },
    { id: 'fengshui', label: 'Cải Vận', icon: Compass },
  ] as const;

  return (
    <div className="min-h-screen bg-brand-black pb-20">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4 subtle-glow">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <Logo className="scale-75 origin-center md:origin-left" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <h2 className="text-white font-display font-medium text-xs leading-tight uppercase tracking-widest">{result.input.fullName}</h2>
              <p className="text-white/40 text-[10px]">{result.input.birthDate} • {result.input.gender}</p>
            </div>
            <button 
              onClick={onReset}
              className="group flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all border border-white/10 subtle-glow active:scale-95"
            >
              <RefreshCcw className="w-4 h-4 transition-transform group-hover:rotate-180" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-display font-bold">Phân tích mới</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Số Chủ Đạo" value={result.numerology.lifePath} color="gold" />
          <StatCard label="Số Sứ Mệnh" value={result.numerology.destiny} color="blue" />
          <StatCard label="Số Linh Hồn" value={result.numerology.soulUrge} color="rose" />
          <StatCard label="Năm Cá Nhân" value={result.numerology.personalYear} color="emerald" />
          <div className="glass-panel p-4 flex flex-col items-center justify-center border-b-2 border-white/20 col-span-2 lg:col-span-1">
            <span className="text-[10px] uppercase font-display tracking-[0.2em] opacity-60 mb-1">Bản Mệnh</span>
            <span className="text-xl font-display font-bold text-white whitespace-nowrap">{result.numerology.elementData.element}</span>
          </div>
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
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-display font-medium text-sm tracking-wide uppercase">{tab.label}</span>
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
                <div className="space-y-6">
                  <SectionTitle title="Luận Giải Tổng Quan Vận Mệnh" audioText={result.aiInterpretation.overview} />
                  <div className="prose prose-invert max-w-none text-white/70 leading-relaxed whitespace-pre-wrap">
                    {result.aiInterpretation.overview}
                  </div>
                  <div id="seo-overview-long" className="mt-8 pt-8 border-t border-white/5 opacity-[0.02] text-[10px]">
                    Khám phá AI Thần Số Học chuyên sâu cho người mang số chủ đạo {result.numerology.lifePath}. 
                    Phân tích bản đồ Pythagoras kết hợp dữ liệu AI thế hệ mới để tìm ra hướng đi đúng đắn nhất. 
                    Xem thần số học online chính xác nhất cho người sinh ngày {result.input.birthDate}.
                    {/* Placeholder for long SEO content */}
                    {Array(20).fill("Luận giải chuyên sâu về vận mệnh và bài học cuộc đời.").join(" ")}
                  </div>
                </div>
              )}

              {activeTab === 'inner' && (
                <div className="space-y-6">
                  <SectionTitle title="Năng Lượng Nội Tại & Tử Huyệt" audioText={result.aiInterpretation.innerEnergy} />
                  <div className="prose prose-invert max-w-none text-white/70 leading-relaxed whitespace-pre-wrap">
                    {result.aiInterpretation.innerEnergy}
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
                  <div className="prose prose-invert max-w-none text-white/70 leading-relaxed whitespace-pre-wrap">
                    {result.aiInterpretation.elementAnalysis || result.numerology.elementData.description}
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
                        <div className="absolute inset-0 bg-brand-gold/[0.01] group-hover:bg-brand-gold/[0.02] transition-colors" opacity-30 />
                        
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
                    <div className={`prose prose-invert max-w-none text-white/70 leading-relaxed whitespace-pre-wrap ${result.input.faceImage ? 'md:col-span-3' : 'md:col-span-5'}`}>
                      {result.aiInterpretation.faceAnalysis}
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
                       <SparklesIcon className="w-4 h-4" /> Lời khuyên phong thủy
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

                  {/* New Section: Hóa giải Xung Khắc */}
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
                             Năng lượng số {result.numerology.lifePath} của bạn cần được tịnh hóa bằng bài tập thiền "Quán tưởng ánh sáng" 15 phút mỗi ngày kèm theo Mantra "Om Mani Padme Hum" để đạt được sự an lạc.
                          </p>
                       </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Birth Chart */}
          <div className="w-full lg:w-96 space-y-8">
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
                   <p className="text-brand-gold text-sm font-medium italic">"Hãy tập thói quen ghi chép lại các ý tưởng vào sáng sớm để kích hoạt năng lượng số {result.numerology.lifePath}."</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
      <span className="text-3xl font-display font-bold">{value}</span>
    </div>
  );
}

function TTSPlayer({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (isPlaying) {
        window.speechSynthesis?.cancel();
      }
    };
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (!window.speechSynthesis) {
      alert("Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản tự động.");
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      window.speechSynthesis.cancel();
      
      const cleanedText = text
        .replace(/[*#_`~]/g, '')
        .replace(/-\s+/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.88; // Tốc độ vừa phải
      utterance.pitch = 0.82; // Giọng nam trầm, ấm áp

      // Find Vietnamese male voice
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = voices.find(v => v.lang.includes('vi-VN') && (v.name.toLowerCase().includes('nam') || v.name.toLowerCase().includes('male')));
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.includes('vi-VN') && v.name.toLowerCase().includes('microsoft'));
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.includes('vi-VN'));
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('vi'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      setIsPlaying(true);
      setIsPaused(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="flex items-center gap-3 bg-brand-gold/5 hover:bg-brand-gold/10 border border-brand-gold/20 hover:border-brand-gold/30 px-4 py-2 rounded-xl transition-all subtle-glow select-none">
      <button 
        onClick={handleTogglePlay}
        className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-brand-gold hover:text-white transition-colors"
        title={isPlaying ? (isPaused ? "Tiếp tục" : "Tạm dừng") : "Nghe đọc luận giải"}
      >
        {isPlaying && !isPaused ? (
          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-0.5 h-3 w-4">
              <span className="w-0.5 bg-brand-gold rounded-full animate-[soundWave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.1s', height: '60%' }} />
              <span className="w-0.5 bg-brand-gold rounded-full animate-[soundWave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.3s', height: '100%' }} />
              <span className="w-0.5 bg-brand-gold rounded-full animate-[soundWave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.2s', height: '40%' }} />
              <span className="w-0.5 bg-brand-gold rounded-full animate-[soundWave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.4s', height: '80%' }} />
            </div>
            <span>Đang đọc</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 animate-[pulse_1.5s_infinite]" />
            <span>{isPaused ? "Bị Tạm Dừng" : "Nghe Đọc AI"}</span>
          </div>
        )}
      </button>

      {isPlaying && (
        <div className="h-3 w-px bg-brand-gold/20" />
      )}

      {isPlaying && (
        <button 
          onClick={handleStop}
          className="text-white/60 hover:text-rose-400 transition-colors"
          title="Dừng đọc"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      )}

      <span className="text-[9px] text-white/40 uppercase tracking-widest hidden sm:inline font-mono">
        {isPlaying ? (isPaused ? "Đã tạm dừng" : "Nam trầm ấm") : "Giọng nam trầm"}
      </span>
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

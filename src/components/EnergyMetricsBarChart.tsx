import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { BarChart3, Sparkles } from 'lucide-react';
import { NumerologyData } from '../types';

interface Props {
  numerology: NumerologyData;
  fullName: string;
}

interface ChartItem {
  key: string;
  name: string;
  shortName: string;
  score: number;
  color: string;
  fillGradient: string;
  icon?: string;
  subtitle?: string;
  desc?: string;
  level?: string;
}

export function EnergyMetricsBarChart({ numerology, fullName }: Props) {
  const [viewMode, setViewMode] = useState<'pillars' | 'detailed'>('pillars');

  // 1. Calculate Năng lượng con số (0-100) based on LifePath and Maturity
  const calcNumberEnergy = (lifePath: number, maturity: number) => {
    const isMaster = [11, 22, 33].includes(lifePath);
    const base = isMaster ? 94 : 70 + ((lifePath * 3) % 20);
    const maturityBonus = (maturity % 9) * 2;
    return Math.min(100, Math.max(68, base + maturityBonus));
  };

  // 2. Calculate Năng lượng tên gọi (0-100) based on Destiny and InnerSelf
  const calcNameEnergy = (destiny: number, innerSelf: number) => {
    const isMaster = [11, 22, 33].includes(destiny);
    const base = isMaster ? 93 : 72 + ((destiny * 3) % 20);
    const innerBonus = (innerSelf % 7) * 2;
    return Math.min(100, Math.max(65, base + innerBonus));
  };

  // 3. Calculate Trí tuệ cảm xúc (EQ & Tâm thức) (0-100) based on SoulUrge and LifePath
  const calcEmotionalIntelligence = (soulUrge: number, lifePath: number) => {
    let base = 75 + ((soulUrge * 4) % 18);
    if ([2, 6, 9, 11, 33].includes(soulUrge) || [2, 6, 9].includes(lifePath)) {
      base += 8; // High empathy & intuition
    }
    return Math.min(100, Math.max(70, base));
  };

  const numberEnergyScore = calcNumberEnergy(numerology.lifePath, numerology.maturity);
  const nameEnergyScore = calcNameEnergy(numerology.destiny, numerology.innerSelf);
  const eqScore = calcEmotionalIntelligence(numerology.soulUrge, numerology.lifePath);

  // 3 Main Energy Pillars data for Recharts BarChart
  const pillarsData: ChartItem[] = [
    {
      key: 'number',
      name: 'Năng Lượng Con Số',
      shortName: 'Con Số',
      score: numberEnergyScore,
      color: '#f0b90b',
      fillGradient: 'url(#goldBarGrad)',
      icon: '✨',
      subtitle: `Số Chủ Đạo ${numerology.lifePath} & Số Trưởng Thành ${numerology.maturity}`,
      desc: 'Phản ánh nội lực bẩm sinh, định hướng đường đời và tần số rung động cốt lõi của ngày sinh.',
      level: numberEnergyScore >= 90 ? 'Cực Đại' : numberEnergyScore >= 80 ? 'Rất Mạnh' : 'Ổn Định'
    },
    {
      key: 'name',
      name: 'Năng Lượng Tên Gọi',
      shortName: 'Tên Gọi',
      score: nameEnergyScore,
      color: '#a855f7',
      fillGradient: 'url(#purpleBarGrad)',
      icon: '📜',
      subtitle: `Số Sứ Mệnh ${numerology.destiny} & Số Nhân Cách ${numerology.innerSelf}`,
      desc: 'Phản ánh năng lượng giao tiếp xã hội, khả năng hiện thực hóa mục tiêu và danh xưng cuộc đời.',
      level: nameEnergyScore >= 90 ? 'Cực Đại' : nameEnergyScore >= 80 ? 'Rất Mạnh' : 'Hài Hòa'
    },
    {
      key: 'eq',
      name: 'Trí Tuệ Cảm Xúc',
      shortName: 'Cảm Xúc (EQ)',
      score: eqScore,
      color: '#10b981',
      fillGradient: 'url(#emeraldBarGrad)',
      icon: '💎',
      subtitle: `Số Linh Hồn ${numerology.soulUrge} & Tâm Thức Giác Ngộ`,
      desc: 'Phản ánh khả năng thấu cảm, trực giác nhạy bén, trí thông minh nội tâm và chiều sâu tâm thức.',
      level: eqScore >= 90 ? 'Thượng Thừa' : eqScore >= 80 ? 'Xuất Sắc' : 'Nhạy Cảm'
    }
  ];

  // 5 Detailed Indices data for Recharts BarChart
  const detailedData: ChartItem[] = [
    {
      key: 'lifepath',
      name: 'Số Chủ Đạo',
      shortName: 'Chủ Đạo',
      score: Math.min(100, [11, 22, 33].includes(numerology.lifePath) ? 96 : 70 + (numerology.lifePath % 9) * 3 + 6),
      color: '#f0b90b',
      fillGradient: 'url(#goldBarGrad)',
      subtitle: `Số #${numerology.lifePath}`,
      desc: 'Định hướng sứ mệnh đường đời bẩm sinh',
      level: 'Cốt Lõi'
    },
    {
      key: 'destiny',
      name: 'Số Sứ Mệnh',
      shortName: 'Sứ Mệnh',
      score: Math.min(100, [11, 22, 33].includes(numerology.destiny) ? 94 : 68 + (numerology.destiny % 9) * 3 + 8),
      color: '#a855f7',
      fillGradient: 'url(#purpleBarGrad)',
      subtitle: `Số #${numerology.destiny}`,
      desc: 'Năng lực và thành tựu hướng tới',
      level: 'Mục Tiêu'
    },
    {
      key: 'soul',
      name: 'Số Linh Hồn',
      shortName: 'Linh Hồn',
      score: Math.min(100, 72 + (numerology.soulUrge % 9) * 3 + 6),
      color: '#10b981',
      fillGradient: 'url(#emeraldBarGrad)',
      subtitle: `Số #${numerology.soulUrge}`,
      desc: 'Khao khát thầm kín và cảm xúc bên trong',
      level: 'Tâm Thức'
    },
    {
      key: 'inner',
      name: 'Số Nhân Cách',
      shortName: 'Nhân Cách',
      score: Math.min(100, 68 + (numerology.innerSelf % 9) * 3 + 8),
      color: '#a855f7',
      fillGradient: 'url(#purpleBarGrad)',
      subtitle: `Số #${numerology.innerSelf}`,
      desc: 'Ấn tượng biểu đạt trong mắt người khác',
      level: 'Biểu Hiện'
    },
    {
      key: 'maturity',
      name: 'Số Trưởng Thành',
      shortName: 'Trưởng Thành',
      score: Math.min(100, 70 + (numerology.maturity % 9) * 3 + 7),
      color: '#f0b90b',
      fillGradient: 'url(#goldBarGrad)',
      subtitle: `Số #${numerology.maturity}`,
      desc: 'Sức mạnh bộc phát ở giai đoạn chín muồi',
      level: 'Hậu Vận'
    }
  ];

  const activeChartData = viewMode === 'pillars' ? pillarsData : detailedData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d: ChartItem = payload[0].payload;
      return (
        <div className="bg-brand-black/95 border border-brand-gold/40 p-4 rounded-xl shadow-2xl backdrop-blur-md z-50 text-xs min-w-[200px]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <p className="text-white font-display font-bold text-sm">{d.name}</p>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-white/60 text-[11px]">Chỉ số năng lượng:</span>
            <span className="text-brand-gold font-mono font-black text-lg">{d.score}%</span>
          </div>
          {d.subtitle && (
            <p className="text-white/50 text-[10px] mt-1 font-mono border-t border-white/5 pt-1.5">{d.subtitle}</p>
          )}
          {d.level && (
            <div className="inline-block mt-2 px-2 py-0.5 rounded bg-white/10 text-white/90 text-[10px] font-bold">
              Mức độ: {d.level}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/[0.04] via-brand-black/90 to-brand-gold/[0.03] border border-brand-gold/30 shadow-xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-[10px] font-display uppercase tracking-widest mb-2 font-bold">
            <BarChart3 className="w-3.5 h-3.5" /> Biểu Đồ Trực Quan Hóa Năng Lượng (Recharts)
          </div>
          <h3 className="text-xl md:text-2xl font-display font-bold text-white flex items-center gap-2">
            Phổ Năng Lượng Tam Hợp Bản Thân
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Trực quan hóa 3 trục: Năng lượng con số, Năng lượng tên gọi & Trí tuệ cảm xúc của <strong className="text-white/90">{fullName}</strong>
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('pillars')}
            className={`px-3 py-1.5 rounded-lg text-xs font-display transition-all ${
              viewMode === 'pillars'
                ? 'bg-brand-gold text-black font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            3 Trục Cốt Lõi
          </button>
          <button
            type="button"
            onClick={() => setViewMode('detailed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-display transition-all ${
              viewMode === 'detailed'
                ? 'bg-brand-gold text-black font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Chi Tiết Chỉ Số
          </button>
        </div>
      </div>

      {/* Main Recharts Bar Chart Container */}
      <div className="mt-6 relative z-10">
        <div className="h-64 sm:h-72 md:h-80 w-full bg-black/40 p-3 sm:p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activeChartData}
              margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
            >
              {/* SVG Gradients for high-end luxury glow bars */}
              <defs>
                <linearGradient id="goldBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffd700" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#b38728" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="purpleBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#7e22ce" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="emeraldBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#047857" stopOpacity={0.7} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.06} vertical={false} />
              
              <XAxis 
                dataKey={viewMode === 'pillars' ? 'shortName' : 'shortName'}
                stroke="#a3a3a3" 
                tick={{ fill: '#d4d4d4', fontSize: 11, fontFamily: 'Space Grotesk, sans-serif' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              
              <YAxis 
                stroke="#a3a3a3" 
                domain={[0, 100]}
                tick={{ fill: '#737373', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              
              <ReferenceLine y={80} stroke="#f0b90b" strokeDasharray="4 4" opacity={0.3} label={{ value: 'Mức Xuất Sắc (80%)', fill: '#c5a059', fontSize: 9, position: 'right' }} />

              <Bar 
                dataKey="score" 
                radius={[8, 8, 0, 0]} 
                maxBarSize={viewMode === 'pillars' ? 68 : 46}
                animationDuration={1200}
              >
                {activeChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fillGradient || entry.color} 
                    stroke={entry.color}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3 Pillar Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 relative z-10">
        {pillarsData.map((item) => (
          <div 
            key={item.key}
            className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-brand-gold/40 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                  {item.name}
                </h4>
              </div>
              <span className="font-mono font-black text-sm" style={{ color: item.color }}>
                {item.score}%
              </span>
            </div>

            <div className="text-[10px] text-brand-gold/80 font-mono font-medium">
              {item.subtitle}
            </div>

            <p className="text-[11px] text-white/60 leading-relaxed pt-1 border-t border-white/5">
              {item.desc}
            </p>

            <div className="pt-2 flex items-center justify-between text-[10px]">
              <span className="text-white/40">Cường độ:</span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/80 font-semibold">
                {item.level}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Holistic Synergy Insight */}
      <div className="mt-6 p-4 rounded-xl bg-brand-gold/[0.03] border border-brand-gold/20 flex items-start gap-3 text-xs text-white/70 leading-relaxed">
        <Sparkles className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
        <div>
          <strong className="text-brand-gold font-display uppercase tracking-wider block mb-1">
            Tổng Quan Cân Bằng Năng Lượng Pythagoras
          </strong>
          {numberEnergyScore >= 85 && nameEnergyScore >= 80 ? (
            <span>
              Bản mệnh có sự hòa quyện rất mạnh mẽ giữa <strong>Năng lượng con số ngày sinh ({numerology.lifePath})</strong> và <strong>Tên gọi danh xưng ({numerology.destiny})</strong>. Cùng với chỉ số <strong>Trí tuệ cảm xúc ({eqScore}%)</strong>, bạn sở hữu trực giác sắc bén và nội lực để biến mọi mục tiêu thành hiện thực.
            </span>
          ) : (
            <span>
              Trục năng lượng thể hiện sự phát triển đồng đều. Việc thấu hiểu và rèn luyện các phẩm chất của <strong>Số chủ đạo #{numerology.lifePath}</strong> kết hợp phát huy <strong>Trí tuệ cảm xúc #{numerology.soulUrge}</strong> sẽ giúp bạn đạt được trạng thái an hòa và thành tựu bền vững.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

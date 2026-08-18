import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bell, 
  Moon, 
  Wind, 
  Sliders, 
  Play, 
  Pause,
  Headphones,
  Music2,
  X
} from 'lucide-react';
import { ambientSound, AMBIENT_PRESETS, AmbientPreset } from '../lib/ambientSound';

interface Props {
  className?: string;
  autoPlayPrompt?: boolean;
}

export function AmbientSoundPlayer({ className = '', autoPlayPrompt = false }: Props) {
  const [isPlaying, setIsPlaying] = useState<boolean>(ambientSound.getIsPlaying());
  const [currentPreset, setCurrentPreset] = useState<AmbientPreset>(ambientSound.getCurrentPreset());
  const [volume, setVolume] = useState<number>(ambientSound.getVolume());
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Keep local state in sync
    const checkState = () => {
      setIsPlaying(ambientSound.getIsPlaying());
      setCurrentPreset(ambientSound.getCurrentPreset());
    };
    const interval = setInterval(checkState, 800);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    const newState = ambientSound.toggle(currentPreset);
    setIsPlaying(newState);
  };

  const handleSelectPreset = (preset: AmbientPreset) => {
    setCurrentPreset(preset);
    if (isPlaying) {
      ambientSound.start(preset);
    } else {
      ambientSound.switchPreset(preset);
      ambientSound.start(preset);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    ambientSound.setVolume(val);
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bell': return <Bell className="w-4 h-4" />;
      case 'Moon': return <Moon className="w-4 h-4" />;
      case 'Wind': return <Wind className="w-4 h-4" />;
      case 'Sparkles':
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const activePresetInfo = AMBIENT_PRESETS.find(p => p.id === currentPreset) || AMBIENT_PRESETS[0];

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Trigger Capsule Button */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-md border border-brand-gold/30 shadow-lg shadow-black/40">
        <button
          type="button"
          onClick={handleToggle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-display tracking-wider transition-all duration-300 ${
            isPlaying
              ? 'bg-gradient-to-r from-brand-gold/20 to-amber-500/20 text-brand-gold border border-brand-gold/40 shadow-[0_0_15px_rgba(197,160,89,0.25)]'
              : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title={isPlaying ? 'Tắt âm thanh nền thiền định' : 'Bật âm thanh nền thư giãn 432Hz'}
        >
          {isPlaying ? (
            <>
              {/* Sound Wave Animation */}
              <div className="flex items-end gap-0.5 h-3.5 w-3.5">
                <span className="w-0.5 bg-brand-gold rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
                <span className="w-0.5 bg-brand-gold rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-2/3" />
                <span className="w-0.5 bg-brand-gold rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-4/5" />
                <span className="w-0.5 bg-brand-gold rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-1/2" />
              </div>
              <span className="hidden sm:inline font-bold uppercase text-[11px]">Nhạc Thiền: {activePresetInfo.name}</span>
              <span className="sm:hidden font-bold uppercase text-[10px]">Thiền</span>
            </>
          ) : (
            <>
              <Headphones className="w-3.5 h-3.5 text-white/50" />
              <span className="hidden sm:inline text-[11px] font-medium">Âm Thanh Thiền</span>
              <span className="sm:hidden text-[10px]">Nhạc</span>
            </>
          )}
        </button>

        {/* Settings / Volume Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-full text-white/60 hover:text-brand-gold hover:bg-white/10 transition-colors ${isOpen ? 'text-brand-gold bg-white/10' : ''}`}
          title="Tùy chỉnh giai điệu & âm lượng"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Preset & Volume Controls Modal/Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-4 rounded-2xl bg-brand-black/95 backdrop-blur-xl border border-brand-gold/30 shadow-2xl shadow-black/80 z-50 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Music2 className="w-4 h-4 text-brand-gold" />
                <h4 className="text-xs font-display uppercase tracking-widest font-bold text-white">
                  Âm Thanh Nền Thư Giãn
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets List */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 block">
                Chọn tần số năng lượng
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {AMBIENT_PRESETS.map((preset) => {
                  const isSelected = currentPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-brand-gold/15 border-brand-gold/50 text-white shadow-[0_0_15px_rgba(197,160,89,0.15)]'
                          : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-brand-gold text-black' : 'bg-white/5 text-white/40'}`}>
                          {getPresetIcon(preset.iconName)}
                        </div>
                        <div>
                          <div className={`text-xs font-medium ${isSelected ? 'text-brand-gold font-bold' : ''}`}>
                            {preset.name}
                          </div>
                          <div className="text-[10px] text-white/40 line-clamp-1">
                            {preset.description}
                          </div>
                        </div>
                      </div>
                      {isSelected && isPlaying && (
                        <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping mr-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="flex items-center gap-1.5">
                  {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-brand-gold" />}
                  Âm lượng
                </span>
                <span className="font-mono font-bold text-white">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold"
              />
            </div>

            {/* Main Play / Pause Action in modal */}
            <button
              type="button"
              onClick={handleToggle}
              className={`w-full py-2.5 rounded-xl font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all ${
                isPlaying
                  ? 'bg-white/10 text-white hover:bg-white/15 border border-white/10'
                  : 'bg-gradient-to-r from-brand-gold to-amber-500 text-black shadow-lg shadow-brand-gold/20 hover:brightness-110'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Tạm Dừng Âm Thanh
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> Phát Âm Thanh Thư Giãn
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

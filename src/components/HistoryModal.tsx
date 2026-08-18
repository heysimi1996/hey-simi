import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  X, 
  Trash2, 
  Clock, 
  User, 
  Heart, 
  Layers, 
  ChevronRight, 
  Sparkles,
  Search,
  AlertCircle
} from 'lucide-react';
import { HistoryItem, AnalysisResult, CompatibilityResult, TarotDailyReading } from '../types';
import { getHistory, deleteHistoryItem, clearAllHistory } from '../lib/history';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectSingle: (result: AnalysisResult) => void;
  onSelectCompatibility: (result: CompatibilityResult) => void;
  onSelectTarot?: (reading: TarotDailyReading) => void;
}

export function HistoryModal({
  isOpen,
  onClose,
  onSelectSingle,
  onSelectCompatibility,
  onSelectTarot
}: Props) {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'single' | 'compatibility' | 'tarot'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadHistory = () => {
    setHistoryList(getHistory());
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => loadHistory();
    window.addEventListener('heysimi_history_updated', handleUpdate);
    return () => window.removeEventListener('heysimi_history_updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  const filteredItems = historyList
    .filter(item => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.subtitle.toLowerCase().includes(query) ||
          item.tag.toLowerCase().includes(query)
        );
      }
      return true;
    });

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteHistoryItem(id);
    setHistoryList(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử tra cứu đã lưu không?')) {
      clearAllHistory();
      setHistoryList([]);
    }
  };

  const handleSelectItem = (item: HistoryItem) => {
    if (item.type === 'single' && item.analysisResult) {
      onSelectSingle(item.analysisResult);
      onClose();
    } else if (item.type === 'compatibility' && item.compatibilityResult) {
      onSelectCompatibility(item.compatibilityResult);
      onClose();
    } else if (item.type === 'tarot' && item.tarotReading && onSelectTarot) {
      onSelectTarot(item.tarotReading);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl glass-panel border border-white/15 bg-brand-black/95 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-md">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                Lịch Sử Tra Cứu Gần Đây
                {historyList.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-mono font-normal">
                    {historyList.length} bản ghi
                  </span>
                )}
              </h3>
              <p className="text-xs text-white/50">Lưu trữ cục bộ trên thiết bị của bạn (LocalStorage)</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:px-6 bg-white/[0.02] border-b border-white/5 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên, con số hoặc ngày..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterType === 'all'
                    ? 'bg-brand-gold text-black font-bold shadow-sm'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                Tất cả ({historyList.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('single')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterType === 'single'
                    ? 'bg-brand-gold text-black font-bold shadow-sm'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                Bản Mệnh
              </button>
              <button
                type="button"
                onClick={() => setFilterType('compatibility')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterType === 'compatibility'
                    ? 'bg-rose-500 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                Tương Hợp
              </button>
              <button
                type="button"
                onClick={() => setFilterType('tarot')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterType === 'tarot'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                Tarot
              </button>
            </div>

            {historyList.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1 text-[11px] text-rose-400/80 hover:text-rose-400 py-1 px-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                title="Xóa toàn bộ lịch sử"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
              </button>
            )}
          </div>
        </div>

        {/* History Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-white/60">
                {historyList.length === 0 
                  ? 'Chưa có lịch sử tra cứu nào được lưu.' 
                  : 'Không tìm thấy kết quả phù hợp với bộ lọc.'
                }
              </p>
              <p className="text-xs text-white/40 max-w-sm">
                Khi bạn thực hiện tra cứu Bản Mệnh, Đối Chiếu Tình Duyên hoặc Rút Bài Tarot, kết quả sẽ tự động lưu tại đây để bạn xem lại bất cứ lúc nào.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSingle = item.type === 'single';
              const isCompat = item.type === 'compatibility';
              const isTarot = item.type === 'tarot';

              const Icon = isSingle ? User : isCompat ? Heart : Layers;
              const iconColor = isSingle ? 'text-amber-400' : isCompat ? 'text-rose-400' : 'text-purple-400';
              const bgBadge = isSingle 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                : isCompat 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                : 'bg-purple-500/10 border-purple-500/30 text-purple-300';

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className="group relative p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-brand-gold/40 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 ${iconColor} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-display font-bold text-white group-hover:text-brand-gold transition-colors truncate">
                          {item.title}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-medium ${bgBadge}`}>
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 truncate">
                        {item.subtitle}
                      </p>
                      <span className="block text-[10px] text-white/30 font-mono">
                        {item.dateFormatted}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(e, item.id)}
                      className="p-2 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Xóa bản ghi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-brand-gold group-hover:text-black flex items-center justify-center text-white/60 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-white/10 bg-black/30 flex items-center justify-between text-xs text-white/40">
          <span>💡 Bấm vào một mục bất kỳ để mở lại chi tiết kết quả phân tích.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import { HistoryItem, AnalysisResult, CompatibilityResult, TarotDailyReading } from '../types';

const HISTORY_STORAGE_KEY = 'heysimi_numerology_history_v1';
const MAX_HISTORY_ITEMS = 30;

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse history:', e);
    return [];
  }
}

export function saveSingleAnalysisHistory(result: AnalysisResult): HistoryItem {
  const item: HistoryItem = {
    id: `single_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: 'single',
    title: result.input.fullName,
    subtitle: `Số chủ đạo ${result.numerology.lifePath} • ${result.numerology.zodiacData.name} • ${result.numerology.elementData.element}`,
    tag: `Số ${result.numerology.lifePath}`,
    timestamp: Date.now(),
    dateFormatted: new Date().toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    analysisResult: result
  };

  saveHistoryItem(item);
  return item;
}

export function saveCompatibilityHistory(result: CompatibilityResult): HistoryItem {
  const p1 = result.person1Data;
  const p2 = result.person2Data;
  const item: HistoryItem = {
    id: `compat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: 'compatibility',
    title: `Tương Hợp: Số ${p1.lifePath} & Số ${p2.lifePath}`,
    subtitle: `Điểm hòa hợp: ${result.score}% • ${p1.zodiacData.name} & ${p2.zodiacData.name}`,
    tag: `${result.score}% Hòa Hợp`,
    timestamp: Date.now(),
    dateFormatted: new Date().toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    compatibilityResult: result
  };

  saveHistoryItem(item);
  return item;
}

export function saveTarotHistory(reading: TarotDailyReading): HistoryItem {
  const item: HistoryItem = {
    id: `tarot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: 'tarot',
    title: `${reading.card.romanNumeral}. ${reading.card.name} (${reading.isReversed ? 'Ngược' : 'Xuôi'})`,
    subtitle: `${reading.userName} • ${reading.questionOrFocus}`,
    tag: `Tarot Ngày`,
    timestamp: Date.now(),
    dateFormatted: reading.drawnAt || new Date().toLocaleDateString('vi-VN'),
    tarotReading: reading
  };

  saveHistoryItem(item);
  return item;
}

function saveHistoryItem(item: HistoryItem) {
  if (typeof window === 'undefined') return;
  try {
    const list = getHistory();
    // Filter duplicates if any
    const filtered = list.filter(i => {
      if (item.type === 'single' && i.type === 'single' && i.title === item.title && i.analysisResult?.input.birthDate === item.analysisResult?.input.birthDate) {
        return false;
      }
      return true;
    });

    const updated = [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('heysimi_history_updated'));
  } catch (e) {
    console.error('Failed to save history item:', e);
  }
}

export function deleteHistoryItem(id: string): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const list = getHistory();
    const updated = list.filter(i => i.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('heysimi_history_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to delete history item:', e);
    return getHistory();
  }
}

export function clearAllHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    window.dispatchEvent(new Event('heysimi_history_updated'));
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

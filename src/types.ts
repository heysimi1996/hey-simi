export type Gender = 'Nam' | 'Nữ';

export interface UserInput {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  birthHour: string;
  gender: Gender;
  faceImage?: string; // Base64 representation of face photo
  facialFeatures?: {
    forehead: string;
    eyes: string;
    mouth: string;
  };
}

export interface ZodiacData {
  name: string; // e.g. "Bảo Bình"
  englishName: string; // e.g. "Aquarius"
  symbol: string; // e.g. "♒"
  dateRange: string; // e.g. "20/01 - 18/02"
  element: 'Lửa' | 'Đất' | 'Khí' | 'Nước';
  rulingPlanet: string; // e.g. "Sao Thiên Vương & Sao Thổ"
  traits: string[]; // Key characteristics
  strengths: string[];
  challenges: string[];
  compatibilitySigns: string[];
  zodiacHouse: string;
  motto: string;
  summary: string;
}

export interface ElementData {
  element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
  napAm: string;
  description: string;
  luckyColors: string[];
  luckyNumbers: number[];
  luckyDirections: string[];
}

export interface NumerologyData {
  lifePath: number;
  destiny: number;
  soulUrge: number;
  innerSelf: number; // Potential/Personality
  maturity: number;
  birthChart: number[][]; // 3x3 grid
  arrows: Arrow[];
  personalYear: number;
  pyramids: number[];
  elementData: ElementData;
  zodiacData: ZodiacData;
}

export interface Arrow {
  name: string;
  type: 'strength' | 'weakness';
  path: string; // e.g. "1-2-3", "1-5-9"
  description: string;
}

export interface CompatibilityInput {
  person1: UserInput;
  person2: UserInput;
}

export interface CompatibilityResult {
  score: number;
  person1Data: NumerologyData;
  person2Data: NumerologyData;
  aiInterpretation: {
    comparisonTable: string;
    compatibilityAnalysis: string;
    conflicts: string;
    solutions: string;
  };
}

export interface AnalysisResult {
  input: UserInput;
  numerology: NumerologyData;
  aiInterpretation: {
    overview: string;
    innerEnergy: string;
    futureForecast: string;
    faceAnalysis: string;
    elementAnalysis: string;
    zodiacAnalysis: string;
    fengShui: {
      luckyColors: string[];
      luckyNumbers: number[];
      advice: string;
    };
  };
}

export type NumerologyResult = AnalysisResult;

export interface TarotCard {
  id: number;
  romanNumeral: string;
  name: string; // e.g. "The Fool"
  vietnameseName: string; // e.g. "Kẻ Khờ"
  element: string; // e.g. "Khí"
  planetOrSign: string; // e.g. "Sao Thiên Vương"
  icon: string;
  themeColor: string;
  keywords: string[];
  uprightKeywords: string[];
  reversedKeywords: string[];
  archetype: string;
  coreMessage: string;
  advice: string;
}

export interface TarotDailyReading {
  card: TarotCard;
  isReversed: boolean;
  questionOrFocus: string;
  userName: string;
  drawnAt: string;
  aiInterpretation: {
    overviewMessage: string;
    careerAndFinance: string;
    loveAndRelationships: string;
    mindAndSpirit: string;
    actionableAdvice: string;
    affirmation: string;
    luckySymbol: string;
  };
}

export interface HistoryItem {
  id: string;
  type: 'single' | 'compatibility' | 'tarot';
  title: string;
  subtitle: string;
  tag: string;
  timestamp: number;
  dateFormatted: string;
  analysisResult?: AnalysisResult;
  compatibilityResult?: CompatibilityResult;
  tarotReading?: TarotDailyReading;
}

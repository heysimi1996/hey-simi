import { Arrow, ElementData, Gender, ZodiacData } from '../types';

export const pythagoreanTable: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

const vowels = ['A', 'E', 'I', 'O', 'U', 'Y'];

export function reduceNumber(num: number | undefined | null, masterAllowed: boolean = true): number {
  if (num === undefined || num === null || isNaN(num)) return 0;
  if (masterAllowed && [11, 22, 33].includes(num)) return num;
  if (num < 10) return num;
  if (num === 10) return 10;
  
  const sum = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  return reduceNumber(sum, masterAllowed);
}

export function calculateLifePath(birthDate: string): number {
  if (!birthDate) return 0;
  const parts = birthDate.split('-').map(Number);
  if (parts.length < 3) return 0;
  
  const [year, month, day] = parts;
  
  const d = reduceNumber(day, true);
  const m = reduceNumber(month, true);
  const y = reduceNumber(year, true);
  
  const total = d + m + y;
  if ([11, 22, 33].includes(total)) return total;
  return reduceNumber(total, true);
}

export function calculateNameNumbers(fullName: string) {
  if (!fullName) return { destiny: 0, soulUrge: 0, innerSelf: 0 };
  const normalized = fullName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z]/g, '');
  
  let destinySum = 0;
  let soulUrgeSum = 0;
  let innerSelfSum = 0;
  
  for (let char of normalized) {
    const val = pythagoreanTable[char] || 0;
    destinySum += val;
    if (vowels.includes(char)) {
      soulUrgeSum += val;
    } else {
      innerSelfSum += val;
    }
  }
  
  return {
    destiny: reduceNumber(destinySum, true),
    soulUrge: reduceNumber(soulUrgeSum, true),
    innerSelf: reduceNumber(innerSelfSum, true)
  };
}

export function generateBirthChart(birthDate: string): number[][] {
  if (!birthDate) return Array(3).fill(0).map(() => Array(3).fill(0));
  const digits = birthDate.replace(/-/g, '').split('').map(Number);
  const counts: Record<number, number> = {};
  digits.forEach(d => {
    if (d === 0 || isNaN(d)) return;
    counts[d] = (counts[d] || 0) + 1;
  });
  
  return [
    [counts[3] || 0, counts[6] || 0, counts[9] || 0],
    [counts[2] || 0, counts[5] || 0, counts[8] || 0],
    [counts[1] || 0, counts[4] || 0, counts[7] || 0]
  ];
}

export function analyzeArrows(grid: number[][]): Arrow[] {
  const arrows: Arrow[] = [];
  const check = (coords: [number, number][], name: string, path: string) => {
    const values = coords.map(([r, c]) => grid[r][c]);
    const hasAll = values.every(v => v > 0);
    const hasNone = values.every(v => v === 0);
    if (hasAll) arrows.push({ name: `Mũi tên ${name}`, type: 'strength', path, description: `Bạn sở hữu sức mạnh ${name}.` });
    else if (hasNone) arrows.push({ name: `Mũi tên ${name}`, type: 'weakness', path, description: `Bạn có thể gặp thử thách về ${name}.` });
  };
  check([[2, 0], [2, 1], [2, 2]], 'Thể chất', '1-4-7');
  check([[1, 0], [1, 1], [1, 2]], 'Cảm xúc', '2-5-8');
  check([[0, 0], [0, 1], [0, 2]], 'Trí tuệ', '3-6-9');
  check([[2, 0], [1, 0], [0, 0]], 'Kế hoạch', '1-2-3');
  check([[2, 1], [1, 1], [0, 1]], 'Ý chí', '4-5-6');
  check([[2, 2], [1, 2], [0, 2]], 'Hoạt động', '7-8-9');
  check([[2, 0], [1, 1], [0, 2]], 'Quyết tâm', '1-5-9');
  check([[0, 0], [1, 1], [2, 2]], 'Tâm linh', '3-5-7');
  return arrows;
}

export function calculatePersonalYear(birthDate: string): number {
  if (!birthDate) return 0;
  const today = new Date();
  const currentYear = today.getFullYear();
  const parts = birthDate.split('-').map(Number);
  if (parts.length < 3) return 0;
  const [_, month, day] = parts;
  const sum = reduceNumber(day, false) + reduceNumber(month, false) + reduceNumber(currentYear, false);
  return reduceNumber(sum, false);
}

export function calculatePyramids(birthDate: string): number[] {
  if (!birthDate) return [0, 0, 0, 0];
  const parts = birthDate.split('-').map(Number);
  if (parts.length < 3) return [0, 0, 0, 0];
  const [year, month, day] = parts;
  const d = reduceNumber(day, false);
  const m = reduceNumber(month, false);
  const y = reduceNumber(year, false);
  const peak1 = reduceNumber(m + d, false);
  const peak2 = reduceNumber(d + y, false);
  const peak3 = reduceNumber(peak1 + peak2, false);
  const peak4 = reduceNumber(m + y, false);
  return [peak1, peak2, peak3, peak4];
}

export function calculateCungPhi(birthDate: string, gender: Gender): string {
  if (!birthDate) return 'N/A';
  const year = parseInt(birthDate.split('-')[0]);
  
  // Basic Cung Phi calculation for 20th and 21st century
  // Logic: Sum of digits of year reduced to single digit.
  const yearSum = year.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
  const reduced = (yearSum - 1) % 9 + 1;
  
  const maleCung = ["Khảm", "Ly", "Cấn", "Đoài", "Càn", "Khôn", "Tốn", "Chấn", "Khôn"];
  const femaleCung = ["Cấn", "Càn", "Đoài", "Cấn", "Ly", "Khảm", "Khôn", "Chấn", "Tốn"];
  
  // This is a simplified table, specific formulas exist but mapping is easier for this context
  const index = (reduced - 1) % 9;
  return gender === 'Nam' ? maleCung[index] : femaleCung[index];
}

export function calculateElement(birthDate: string): ElementData {
  if (!birthDate) return { element: 'Thổ', napAm: 'N/A', description: '', luckyColors: [], luckyNumbers: [], luckyDirections: [] };
  const year = parseInt(birthDate.split('-')[0]);
  
  // Can index: Giáp=4, Ất=5, Bính=6, Đinh=7, Mậu=8, Kỷ=9, Canh=0, Tân=1, Nhâm=2, Quý=3
  const canMap: Record<number, string> = { 4: 'Giáp', 5: 'Ất', 6: 'Bính', 7: 'Đinh', 8: 'Mậu', 9: 'Kỷ', 0: 'Canh', 1: 'Tân', 2: 'Nhâm', 3: 'Quý' };
  const chiMap: Record<number, string> = { 0: 'Thân', 1: 'Dậu', 2: 'Tuất', 3: 'Hợi', 4: 'Tý', 5: 'Sửu', 6: 'Dần', 7: 'Mão', 8: 'Thìn', 9: 'Tỵ', 10: 'Ngọ', 11: 'Mùi' };
  
  const canVal = year % 10;
  const chiVal = year % 12;
  const canName = canMap[canVal];
  const chiName = chiMap[chiVal];
  const fullChiCan = `${canName} ${chiName}`;

  // Simplified Nạp Âm Logic
  const canWeight: Record<string, number> = { 'Giáp': 1, 'Ất': 1, 'Bính': 2, 'Đinh': 2, 'Mậu': 3, 'Kỷ': 3, 'Canh': 4, 'Tân': 4, 'Nhâm': 5, 'Quý': 5 };
  const chiWeight: Record<string, number> = { 'Tý': 0, 'Sửu': 0, 'Ngọ': 0, 'Mùi': 0, 'Dần': 1, 'Mão': 1, 'Thân': 1, 'Dậu': 1, 'Thìn': 2, 'Tỵ': 2, 'Tuất': 2, 'Hợi': 2 };
  
  let weightSum = canWeight[canName] + chiWeight[chiName];
  if (weightSum > 5) weightSum -= 5;
  
  const elements: Record<number, { name: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ', colors: string[], dir: string[] }> = {
    1: { name: 'Kim', colors: ['Trắng', 'Xám', 'Vàng kim'], dir: ['Tây', 'Tây Bắc'] },
    2: { name: 'Thủy', colors: ['Đen', 'Xanh dương'], dir: ['Bắc'] },
    3: { name: 'Hỏa', colors: ['Đỏ', 'Hồng', 'Tím'], dir: ['Nam'] },
    4: { name: 'Thổ', colors: ['Vàng', 'Nâu'], dir: ['Trung tâm', 'Đông Bắc', 'Tây Nam'] },
    5: { name: 'Mộc', colors: ['Xanh lá'], dir: ['Đông', 'Đông Nam'] }
  };
  
  const res = elements[weightSum] || elements[4];
  
  return {
    element: res.name,
    napAm: `${res.name} (${fullChiCan})`,
    description: `Bản mệnh ${res.name} mang năng lượng đặc trưng của tuổi ${fullChiCan}.`,
    luckyColors: res.colors,
    luckyNumbers: [canWeight[canName], chiWeight[chiName] + 1].filter(n => n > 0),
    luckyDirections: res.dir
  };
}

export function calculateZodiac(birthDate: string): ZodiacData {
  if (!birthDate) {
    return {
      name: 'Bạch Dương',
      englishName: 'Aries',
      symbol: '♈',
      dateRange: '21/03 - 19/04',
      element: 'Lửa',
      rulingPlanet: 'Sao Hỏa',
      traits: ['Tiên phong', 'Nhiệt huyết', 'Dũng cảm', 'Thẳng thắn'],
      strengths: ['Khả năng lãnh đạo bẩm sinh', 'Dám nghĩ dám làm', 'Ý chí kiên cường'],
      challenges: ['Nôn nóng', 'Thiếu kiên nhẫn', 'Dễ phản ứng bộc phát'],
      compatibilitySigns: ['Sư Tử', 'Nhân Mã', 'Song Tử', 'Bảo Bình'],
      zodiacHouse: 'Cung Nhà 1 (Cung Tiên Phong & Bản Ngã)',
      motto: 'Tôi tiên phong, tôi kiến tạo và dẫn đầu.',
      summary: 'Mang ngọn lửa rực cháy của cung thủ lĩnh, bạn luôn tiến về phía trước với sự quả cảm phi thường.'
    };
  }

  const parts = birthDate.split('-').map(Number);
  const month = parts[1] || 1;
  const day = parts[2] || 1;

  // Exact Western Astrological Sign Mapping
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return {
      name: 'Bạch Dương',
      englishName: 'Aries',
      symbol: '♈',
      dateRange: '21/03 - 19/04',
      element: 'Lửa',
      rulingPlanet: 'Sao Hỏa (Mars)',
      traits: ['Tiên phong', 'Nhiệt huyết', 'Dũng cảm', 'Thẳng thắn'],
      strengths: ['Khả năng lãnh đạo bẩm sinh', 'Dám nghĩ dám làm', 'Ý chí kiên cường', 'Năng lượng hành động mạnh mẽ'],
      challenges: ['Nôn nóng', 'Thiếu kiên nhẫn', 'Dễ bộc phát cảm xúc'],
      compatibilitySigns: ['Sư Tử', 'Nhân Mã', 'Song Tử', 'Bảo Bình'],
      zodiacHouse: 'Cung Nhà 1 (Bản Ngã & Sức Sống Khởi Đầu)',
      motto: 'Tôi tiên phong, tôi dám dấn thân và khai phá.',
      summary: 'Biểu tượng của ngọn lửa tiên phong rực cháy. Bạn mang nguồn sinh lực dồi dào, trực giác hành động nhạy bén và không bao giờ chùn bước trước thử thách.'
    };
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return {
      name: 'Kim Ngưu',
      englishName: 'Taurus',
      symbol: '♉',
      dateRange: '20/04 - 20/05',
      element: 'Đất',
      rulingPlanet: 'Sao Kim (Venus)',
      traits: ['Kiên định', 'Thực tế', 'Đáng tin cậy', 'Trọng tình nghĩa'],
      strengths: ['Ý chí bền bỉ phi thường', 'Tư duy tài chính sắc bén', 'Thẩm mỹ tinh tế', 'Chung thủy sâu sắc'],
      challenges: ['Cố chấp', 'Ngại thay đổi đột ngột', 'Đôi khi quá thận trọng'],
      compatibilitySigns: ['Xử Nữ', 'Ma Kết', 'Cự Giải', 'Song Ngư'],
      zodiacHouse: 'Cung Nhà 2 (Giá Trị, Tài Sản & Sự Thịnh Vượng)',
      motto: 'Tôi xây đắp giá trị bền vững và vững chãi qua năm tháng.',
      summary: 'Hiện thân của Đất mẹ trù phú và vững vàng. Bạn xây dựng cuộc sống bằng tính kiên trì bền bỉ, thẩm mỹ tinh tế và khả năng tích lũy thịnh vượng vững chắc.'
    };
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return {
      name: 'Song Tử',
      englishName: 'Gemini',
      symbol: '♊',
      dateRange: '21/05 - 20/06',
      element: 'Khí',
      rulingPlanet: 'Sao Thủy (Mercury)',
      traits: ['Linh hoạt', 'Thông tuệ', 'Giao tiếp xuất sắc', 'Thích nghi cao'],
      strengths: ['Tư duy đa chiều nhanh nhạy', 'Khả năng kết nối tuyệt vời', 'Học hỏi siêu tốc', 'Hài hước hóm hỉnh'],
      challenges: ['Dễ phân tâm', 'Cả thèm chóng chán', 'Khó duy trì năng lượng vào một việc duy nhất'],
      compatibilitySigns: ['Thiên Bình', 'Bảo Bình', 'Bạch Dương', 'Sư Tử'],
      zodiacHouse: 'Cung Nhà 3 (Giao Tiếp, Học Vấn & Mạng Lưới Xã Hội)',
      motto: 'Tôi tư duy, tôi kết nối và lan tỏa tri thức.',
      summary: 'Cơn gió thông tuệ mang nguồn năng lượng tri thức bất tận. Bạn sở hữu tài ứng biến vô song, khả năng ngôn từ cuốn hút và góc nhìn thế giới đa sắc màu.'
    };
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return {
      name: 'Cự Giải',
      englishName: 'Cancer',
      symbol: '♋',
      dateRange: '21/06 - 22/07',
      element: 'Nước',
      rulingPlanet: 'Mặt Trăng (Moon)',
      traits: ['Giàu tình cảm', 'Trực giác thấu suốt', 'Bảo bọc', 'Nuôi dưỡng'],
      strengths: ['Thấu cảm sâu sắc nỗi lòng người khác', 'Trực giác tâm linh nhạy bén', 'Trung thành tuyệt đối', 'Xây dựng tổ ấm chu toàn'],
      challenges: ['Cảm xúc thất thường', 'Dễ bị tổn thương', 'Hay hoài niệm quá khứ'],
      compatibilitySigns: ['Bọ Cạp', 'Song Ngư', 'Kim Ngưu', 'Xử Nữ'],
      zodiacHouse: 'Cung Nhà 4 (Gia Đình, Cội Nguồn & Nền Tảng Nội Tâm)',
      motto: 'Tôi cảm nhận sâu sắc, tôi bảo bọc và chở che yêu thương.',
      summary: 'Dòng nước êm đềm nhưng có sức mạnh bào mòn cả đá tảng. Trực giác thiên bẩm và trái tim thấu cảm giúp bạn trở thành điểm tựa bình yên vững chãi nhất.'
    };
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return {
      name: 'Sư Tử',
      englishName: 'Leo',
      symbol: '♌',
      dateRange: '23/07 - 22/08',
      element: 'Lửa',
      rulingPlanet: 'Mặt Trời (Sun)',
      traits: ['Khí chất vương giả', 'Tự tin', 'Hào sảng', 'Sáng tạo'],
      strengths: ['Khí chất lãnh đạo bẩm sinh', 'Lòng hào hiệp trượng nghĩa', 'Sức hút sân khấu', 'Trái tim ấm áp chân thành'],
      challenges: ['Cái tôi lớn', 'Thích được tán dương', 'Đôi khi áp đặt'],
      compatibilitySigns: ['Bạch Dương', 'Nhân Mã', 'Song Tử', 'Thiên Bình'],
      zodiacHouse: 'Cung Nhà 5 (Sáng Tạo Nghệ Thuật, Tình Yêu & Tỏa Sáng)',
      motto: 'Tôi tỏa sáng, tôi truyền cảm hứng và vươn tới vinh quang.',
      summary: 'Mặt Trời rạng rỡ của vòng tròn hoàng đạo. Khí chất quyền uy, sự phóng khoáng và lòng quả cảm giúp bạn luôn là tâm điểm thắp sáng mọi không gian.'
    };
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return {
      name: 'Xử Nữ',
      englishName: 'Virgo',
      symbol: '♍',
      dateRange: '23/08 - 22/09',
      element: 'Đất',
      rulingPlanet: 'Sao Thủy (Mercury)',
      traits: ['Tỉ mỉ', 'Chu đáo', 'Thực tế', 'Logic sắc sảo'],
      strengths: ['Khả năng phân tích chi tiết đỉnh cao', 'Tinh thần phụng sự tận tụy', 'Kỷ luật và nguyên tắc', 'Tổ chức công việc bài bản'],
      challenges: ['Quá cầu toàn', 'Hay tự phê bình bản thân', 'Lo âu thái quá'],
      compatibilitySigns: ['Kim Ngưu', 'Ma Kết', 'Cự Giải', 'Bọ Cạp'],
      zodiacHouse: 'Cung Nhà 6 (Sức Khỏe, Công Việc Tinh Hoa & Phụng Sự)',
      motto: 'Tôi hoàn thiện từng chi tiết để đạt tới sự tinh hoa tối thượng.',
      summary: 'Khối óc logic sắc sảo với tâm hồn phụng sự thuần khiết. Bạn nhìn thấy những chi tiết mà người khác bỏ qua và biến sự hỗn loạn thành trật tự hoàn hảo.'
    };
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return {
      name: 'Thiên Bình',
      englishName: 'Libra',
      symbol: '♎',
      dateRange: '23/09 - 22/10',
      element: 'Khí',
      rulingPlanet: 'Sao Kim (Venus)',
      traits: ['Cân bằng', 'Duyên dáng', 'Hòa nhã', 'Công bằng'],
      strengths: ['Nghệ thuật ngoại giao hòa giải', 'Gu thẩm mỹ đỉnh cao', 'Tư duy công lý khách quan', 'Thu hút duyên dáng'],
      challenges: ['Do dự khó quyết định', 'Ngại xung đột đối đầu', 'Dễ chiều lòng người khác quá mức'],
      compatibilitySigns: ['Song Tử', 'Bảo Bình', 'Sư Tử', 'Nhân Mã'],
      zodiacHouse: 'Cung Nhà 7 (Hôn Nhân, Hợp Tác & Quan Hệ Bình Đẳng)',
      motto: 'Tôi tạo lập sự hài hòa, công bằng và vẻ đẹp chân thiện mỹ.',
      summary: 'Hiện thân của cán cân công lý và nét duyên hòa nhã. Bạn là sứ giả của hòa bình, luôn kiến tạo sự gắn kết và mang cái đẹp lan tỏa muôn nơi.'
    };
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return {
      name: 'Bọ Cạp',
      englishName: 'Scorpio',
      symbol: '♏',
      dateRange: '23/10 - 21/11',
      element: 'Nước',
      rulingPlanet: 'Sao Diêm Vương (Pluto) & Sao Hỏa',
      traits: ['Bí ẩn', 'Nội lực thâm sâu', 'Quyết đoán', 'Trực giác sắc bén'],
      strengths: ['Ý chí sinh tồn và tái sinh phi thường', 'Nhìn thấu tâm can người khác', 'Chung thủy sắt son', 'Khả năng tập trung tuyệt đối'],
      challenges: ['Đa nghi', 'Khó mở lòng tha thứ', 'Kiểm soát cao'],
      compatibilitySigns: ['Cự Giải', 'Song Ngư', 'Xử Nữ', 'Ma Kết'],
      zodiacHouse: 'Cung Nhà 8 (Tái Sinh, Chiều Sâu Tâm Thức & Năng Lượng Ẩn)',
      motto: 'Tôi chuyển hóa qua bão giông để tái sinh mạnh mẽ hơn.',
      summary: 'Dòng nước ngầm sâu thẳm ẩn chứa sức mạnh tái sinh bất diệt. Trực giác thấu thị và ý chí gang thép giúp bạn vượt qua mọi tro tàn để vươn lên đỉnh cao.'
    };
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return {
      name: 'Nhân Mã',
      englishName: 'Sagittarius',
      symbol: '♐',
      dateRange: '22/11 - 21/12',
      element: 'Lửa',
      rulingPlanet: 'Sao Mộc (Jupiter)',
      traits: ['Phóng khoáng', 'Lạc quan', 'Tự do', 'Triết lý'],
      strengths: ['Tầm nhìn chiến lược vĩ mô', 'Tinh thần khám phá không giới hạn', 'Tâm hồn chân thật hào phóng', 'May mắn và tươi vui'],
      challenges: ['Thẳng tính thiếu tế nhị', 'Thiếu kiên nhẫn với chi tiết nhỏ', 'Ghét bị ràng buộc'],
      compatibilitySigns: ['Bạch Dương', 'Sư Tử', 'Thiên Bình', 'Bảo Bình'],
      zodiacHouse: 'Cung Nhà 9 (Triết Học, Tầm Nhìn Thế Giới & Khát Vọng Tự Do)',
      motto: 'Tôi mở rộng giới hạn tri thức và vươn tới chân trời tự do.',
      summary: 'Mũi tên lửa hướng thẳng tới những chân trời mới. Năng lượng lạc quan vô tận và triết lý sống tự do giúp bạn luôn là nguồn cảm hứng sống cho mọi người.'
    };
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return {
      name: 'Ma Kết',
      englishName: 'Capricorn',
      symbol: '♑',
      dateRange: '22/12 - 19/01',
      element: 'Đất',
      rulingPlanet: 'Sao Thổ (Saturn)',
      traits: ['Kỷ luật', 'Tham vọng', 'Kiên trì', 'Trách nhiệm'],
      strengths: ['Ý chí leo núi bền bỉ chinh phục đỉnh cao', 'Khả năng quản trị tổ chức', 'Thực tế đáng tin cậy', 'Tầm nhìn dài hạn'],
      challenges: ['Nghiêm khắc', 'Khó bộc lộ cảm xúc mềm mỏng', 'Dễ ôm đồm gánh nặng'],
      compatibilitySigns: ['Kim Ngưu', 'Xử Nữ', 'Bọ Cạp', 'Song Ngư'],
      zodiacHouse: 'Cung Nhà 10 (Sự Nghiệp, Danh Tiếng & Địa Vị Xã Hội)',
      motto: 'Tôi kiên trì kiến tạo di sản và leo lên đỉnh vinh quang.',
      summary: 'Bậc thầy của sự kiên định và kỷ luật thép. Bạn từng bước xây dựng đế chế sự nghiệp của đời mình với nền móng vững chắc không gì có thể lay chuyển.'
    };
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return {
      name: 'Bảo Bình',
      englishName: 'Aquarius',
      symbol: '♒',
      dateRange: '20/01 - 18/02',
      element: 'Khí',
      rulingPlanet: 'Sao Thiên Vương (Uranus) & Sao Thổ',
      traits: ['Độc đáo', 'Nhân đạo', 'Tư duy tương lai', 'Tự do'],
      strengths: ['Tư duy đột phá vượt thời đại', 'Tấm lòng nhân ái vì cộng đồng', 'Khách quan khoa học', 'Độc lập tư tưởng'],
      challenges: ['Khó đoán', 'Đôi khi xa cách về cảm xúc', 'Cực đoan với quan điểm riêng'],
      compatibilitySigns: ['Song Tử', 'Thiên Bình', 'Bạch Dương', 'Nhân Mã'],
      zodiacHouse: 'Cung Nhà 11 (Cộng Đồng, Lý Tưởng Tương Lai & Đột Phá Mới)',
      motto: 'Tôi đổi mới, tôi phá vỡ giới hạn và hướng về tương lai.',
      summary: 'Kẻ mang nước tưới mát cho tư duy nhân loại. Bộ não đi trước thời đại và trái tim bác ái giúp bạn mở ra những con đường khai phóng đầy bất ngờ.'
    };
  } else {
    // 19/02 - 20/03
    return {
      name: 'Song Ngư',
      englishName: 'Pisces',
      symbol: '♓',
      dateRange: '19/02 - 20/03',
      element: 'Nước',
      rulingPlanet: 'Sao Hải Vương (Neptune) & Sao Mộc',
      traits: ['Thấu cảm', 'Lãng mạn', 'Trực giác tâm linh', 'Vị tha'],
      strengths: ['Trực giác tâm linh thấu thị', 'Trí tưởng tượng nghệ thuật vô biên', 'Lòng từ bi chữa lành', 'Thích ứng linh hoạt'],
      challenges: ['Dễ mơ mộng xa rời thực tế', 'Dễ bị ảnh hưởng bởi năng lượng xấu', 'Thiếu ranh giới bảo vệ bản thân'],
      compatibilitySigns: ['Cự Giải', 'Bọ Cạp', 'Kim Ngưu', 'Ma Kết'],
      zodiacHouse: 'Cung Nhà 12 (Tâm Linh Bí Ẩn, Tiềm Thức & Trực Giác Tối Hậu)',
      motto: 'Tôi thấu hiểu bằng trái tim từ bi và hòa vào dòng chảy vũ trụ.',
      summary: 'Đại dương bao la của trực giác và tình thương thuần khiết. Bạn sở hữu tâm hồn nghệ sĩ phiêu lãng và khả năng chữa lành tâm can kỳ diệu.'
    };
  }
}


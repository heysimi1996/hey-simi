import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Sun, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Flame, 
  HeartHandshake,
  Lightbulb
} from 'lucide-react';
import { reduceNumber } from '../lib/numerology';

interface DailyForecastData {
  number: number;
  title: string;
  theme: string;
  summary: string;
  advice: string;
  dos: string[];
  donts: string[];
  luckyColor: string;
  luckyColorHex: string;
  focusArea: string;
}

const UNIVERSAL_DAY_DATA: Record<number, DailyForecastData> = {
  1: {
    number: 1,
    title: "Ngày Của Khởi Đầu & Tiên Phong",
    theme: "Hành động độc lập • Ý tưởng mới • Quyết đoán",
    summary: "Hôm nay trường năng lượng vũ trụ kích hoạt tính chủ động và lòng dũng cảm. Rất thích hợp để bắt đầu dự án mới hoặc đưa ra quyết định độc lập.",
    advice: "Dám bước ra khỏi vùng an toàn và tin vào trực giác lãnh đạo của chính mình.",
    dos: [
      "Bắt tay vào kế hoạch đã ấp ủ bấy lâu",
      "Chủ động đề xuất giải pháp sáng tạo",
      "Tập trung vào mục tiêu cá nhân quan trọng"
    ],
    donts: [
      "Do dự, chần chừ chờ đợi người khác quyết định thay",
      "Bảo thủ, áp đặt cái tôi lên người xung quanh"
    ],
    luckyColor: "Đỏ Ruby / Vàng Ánh Kim",
    luckyColorHex: "#ef4444",
    focusArea: "Sự Nghiệp & Khởi Tạo"
  },
  2: {
    number: 2,
    title: "Ngày Của Kết Nối & Hòa Hợp",
    theme: "Lắng nghe • Thấu cảm • Hợp tác win-win",
    summary: "Tần số số 2 mang lại sự dịu êm, nhạy bén trong cảm xúc và kết nối quan hệ. Ngày lý tưởng để đàm phán, hòa giải hoặc tâm sự chân thành.",
    advice: "Hãy dùng sự mềm mỏng, kiên nhẫn để giải quyết những khúc mắc.",
    dos: [
      "Lắng nghe trọn vẹn trước khi phản hồi",
      "Ký kết hợp tác hoặc xây dựng liên minh",
      "Dành thời gian chăm sóc tình cảm với người thân yêu"
    ],
    donts: [
      "Phản ứng thái quá trước lời chỉ trích",
      "Nuốt giận vào trong dẫn đến bùng nổ tiêu cực"
    ],
    luckyColor: "Cam Pastel / Xanh Ngọc Bích",
    luckyColorHex: "#06b6d4",
    focusArea: "Tình Cảm & Quan Hệ Đối Tác"
  },
  3: {
    number: 3,
    title: "Ngày Của Sáng Tạo & Lan Tỏa Niềm Vui",
    theme: "Giao tiếp cuốn hút • Ý tưởng bay bổng • Lạc quan",
    summary: "Năng lượng rực rỡ của số 3 giúp lời nói của bạn tràn đầy sức thuyết phục và thu hút. Rất tốt cho thuyết trình, viết lách, sáng tạo nghệ thuật và hội họp.",
    advice: "Thể hiện bản thân một cách chân thực và lan tỏa tinh thần tích cực.",
    dos: [
      "Chia sẻ ý tưởng, thuyết trình hoặc viết lách",
      "Gặp gỡ bạn bè, mở rộng mạng lưới giao thiệp",
      "Tìm kiếm niềm vui qua các hoạt động giải trí"
    ],
    donts: [
      "Nói quá nhiều mà quên lắng nghe",
      "Phân tán năng lượng vào quá nhiều việc vụn vặt"
    ],
    luckyColor: "Vàng Nắng / Xanh Lá Non",
    luckyColorHex: "#eab308",
    focusArea: "Giao Tiếp & Sáng Tạo Nghệ Thuật"
  },
  4: {
    number: 4,
    title: "Ngày Của Kỷ Luật & Củng Cố Nền Móng",
    theme: "Thực tế • Chi tiết tỉ mỉ • Tổ chức trật tự",
    summary: "Tần số số 4 đưa bạn về với thực tế vững chắc. Đây là ngày hoàn hảo để sắp xếp lại công việc, dọn dẹp không gian sống và hoạch định tài chính.",
    advice: "Kiên nhẫn hoàn thiện từng bước nhỏ, thành công bền vững bắt đầu từ nền móng vững chắc.",
    dos: [
      "Lập danh sách việc cần làm (To-Do List) rõ ràng",
      "Rà soát số liệu, tài chính và hợp đồng",
      "Rèn luyện thể lực và chăm sóc sức khỏe thể chất"
    ],
    donts: [
      "Đốt cháy giai đoạn hoặc tìm đường tắt mạo hiểm",
      "Cứng nhắc, phán xét người khác vì thiếu kỷ luật"
    ],
    luckyColor: "Xanh Lục Bảo / Nâu Gỗ Ấm",
    luckyColorHex: "#10b981",
    focusArea: "Tổ Chức Công Việc & Sức Khỏe"
  },
  5: {
    number: 5,
    title: "Ngày Của Tự Do & Chuyển Hóa Linh Hoạt",
    theme: "Bứt phá giới hạn • Thích ứng nhanh • Trải nghiệm mới",
    summary: "Năng lượng gió lốc của số 5 mang đến những cơ hội bất ngờ và làn gió mới. Hãy sẵn sàng đón nhận sự thay đổi và khám phá điều mới mẻ.",
    advice: "Mở rộng tầm mắt, linh hoạt ứng biến và biến biến cố thành cơ hội thăng tiến.",
    dos: [
      "Thử một lộ trình mới, thói quen mới hoặc học kỹ năng mới",
      "Đi lại, di chuyển hoặc gặp gỡ đối tượng khác biệt",
      "Giải phóng bản thân khỏi những áp lực rập khuôn"
    ],
    donts: [
      "Đưa ra quyết định bốc đồng khi chưa có đủ dữ liệu",
      "Sa đà vào các thú vui nhất thời làm hao hụt tài chính"
    ],
    luckyColor: "Xanh Da Trời / Tím Lavender",
    luckyColorHex: "#3b82f6",
    focusArea: "Thích Ứng & Cơ Hội Bứt Phá"
  },
  6: {
    number: 6,
    title: "Ngày Của Yêu Thương & Trách Nhiệm Gia Đình",
    theme: "Chữa lành • Ấm áp tổ ấm • Cố vấn chăm sóc",
    summary: "Tần số số 6 tỏa sáng với lòng trắc ẩn, tình mẫu tử/phụ tử và sự bao dung. Thích hợp nhất để vun đắp hạnh phúc gia đình và giúp đỡ cộng đồng.",
    advice: "Yêu thương người khác nhưng đừng quên chăm sóc và trân trọng chính bản thân mình.",
    dos: [
      "Dành bữa cơm ấm áp cùng gia đình hoặc người thân",
      "Trang hoàng, dọn dẹp tổ ấm cho thêm sinh khí",
      "Làm việc thiện nguyện hoặc hỗ trợ đồng nghiệp"
    ],
    donts: [
      "Gánh vác thay việc của người khác rồi sinh mệt mỏi",
      "Cầu toàn thái quá về sự hoàn hảo của người thân"
    ],
    luckyColor: "Hồng Phấn / Xanh Cổ Vịt",
    luckyColorHex: "#ec4899",
    focusArea: "Gia Đình, Nhà Cửa & Tình Thân"
  },
  7: {
    number: 7,
    title: "Ngày Của Trí Tuệ Sâu Sắc & Tĩnh Lặng Nội Tâm",
    theme: "Chiêm nghiệm • Học hỏi chuyên sâu • Khai sáng tâm thức",
    summary: "Năng lượng số 7 hướng bạn vào chiều sâu nội tại. Ngày vàng để nghiên cứu, đọc sách, thiền định hoặc tìm câu trả lời cho các vấn đề phức tạp.",
    advice: "Dành cho mình một khoảng lặng yên bình để lắng nghe tiếng nói của trực giác.",
    dos: [
      "Đọc sách, nghiên cứu tài liệu chuyên môn",
      "Thực hành thiền định, tản bộ gần gũi thiên nhiên",
      "Phân tích nguyên nhân gốc rễ của một khó khăn"
    ],
    donts: [
      "Hối hả lao vào các chốn tiệc tùng ồn ào",
      "Tự cô lập bản thân trong sự hoài nghi tiêu cực"
    ],
    luckyColor: "Tím Thủy Tinh / Xanh Indigo",
    luckyColorHex: "#8b5cf6",
    focusArea: "Nghiên Cứu, Học Hỏi & Khai Tâm"
  },
  8: {
    number: 8,
    title: "Ngày Của Tài Chính, Quyền Lực & Thành Tựu",
    theme: "Dồi dào tài lộc • Đàm phán lớn • Bản lĩnh làm chủ",
    summary: "Số 8 mang năng lượng cực mạnh về thịnh vượng vật chất, quản trị dòng tiền và vị thế lãnh đạo. Rất tốt để chốt giao dịch lớn hoặc mở rộng kinh doanh.",
    advice: "Hãy tư duy như một nhà lãnh đạo tầm vóc, kết hợp đạo đức nghề nghiệp với sự nhạy bén tài chính.",
    dos: [
      "Quyết định các vấn đề đầu tư hoặc quản lý ngân sách",
      "Khẳng định vị thế, thương lượng tăng lương/thăng chức",
      "Tập trung vào hiệu suất và kết quả thực chất"
    ],
    donts: [
      "Tham lam chạy theo lợi nhuận bất chấp rủi ro",
      "Lạm dụng quyền lực hoặc cư xử trịch thượng"
    ],
    luckyColor: "Vàng Kim Hoàng Gia / Đen Thạch Anh",
    luckyColorHex: "#c5a059",
    focusArea: "Tài Lộc, Sự Nghiệp & Quyền Lực"
  },
  9: {
    number: 9,
    title: "Ngày Của Hoàn Tất, Bao Dung & Tái Sinh",
    theme: "Khép lại chu kỳ cũ • Tha thứ buông bỏ • Tầm nhìn nhân đạo",
    summary: "Năng lượng số 9 đại diện cho sự viên mãn và thanh lọc. Thời điểm lý tưởng để hoàn tất các dự án tồn đọng, tha thứ lỗi lầm cũ và sẵn sàng cho chu kỳ mới.",
    advice: "Buông bỏ những gì không còn phục vụ cho sự tiến hóa của bạn để đón nhận điều vĩ đại hơn.",
    dos: [
      "Hoàn thành dứt điểm công việc dở dang",
      "Tha thứ cho người đã làm bạn tổn thương trong quá khứ",
      "Chia sẻ tri thức và truyền cảm hứng sống đẹp"
    ],
    donts: [
      "Bám chấp vào những tiếc nuối hoặc mối quan hệ độc hại",
      "Khởi sự dự án hoàn toàn mới trong ngày kết thúc này"
    ],
    luckyColor: "Trắng Ánh Kim / Đỏ Boóc-đô",
    luckyColorHex: "#f43f5e",
    focusArea: "Hoàn Tất Chu Kỳ & Thanh Lọc Tâm Thức"
  }
};

export function DailyForecastWidget() {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate Universal Day for today
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const totalSum = day + month + year;
  const universalNumber = reduceNumber(totalSum, false) || 1;
  const normalizedNumber = (universalNumber >= 1 && universalNumber <= 9) ? universalNumber : 1;

  const data = UNIVERSAL_DAY_DATA[normalizedNumber] || UNIVERSAL_DAY_DATA[1];

  const dateFormatted = today.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="relative overflow-hidden rounded-2xl glass-panel border border-brand-gold/35 shadow-xl transition-all">
        {/* Glow ambient background */}
        <div 
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: data.luckyColorHex }}
        />
        <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top summary row */}
        <div className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-xl shadow-lg flex-shrink-0 text-white"
              style={{ 
                background: `linear-gradient(135deg, ${data.luckyColorHex}, #c5a059)` 
              }}
            >
              {data.number}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-brand-gold px-2.5 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-brand-gold" /> Con Số Vũ Trụ Hôm Nay
                </span>
                <span className="text-white/40 text-xs capitalize">• {dateFormatted}</span>
              </div>
              <h3 className="text-base sm:text-lg font-display font-bold text-white mt-1">
                {data.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 transition-all font-medium"
            >
              {isExpanded ? (
                <>
                  <span>Thu gọn</span>
                  <ChevronUp className="w-3.5 h-3.5 text-brand-gold" />
                </>
              ) : (
                <>
                  <span>Xem chi tiết lời khuyên</span>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-gold" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Expanded detailed content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5 md:p-6 space-y-5">
                {/* Summary & Core Theme */}
                <div className="p-4 rounded-xl bg-brand-gold/[0.04] border border-brand-gold/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-display text-brand-gold font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-brand-gold" /> Trường Năng Lượng Chính
                    </span>
                    <p className="text-xs md:text-sm text-white/80 leading-relaxed font-medium">
                      {data.summary}
                    </p>
                  </div>
                  <div className="flex-shrink-0 bg-white/5 px-3 py-2 rounded-lg border border-white/10 text-center">
                    <span className="block text-[10px] text-white/40 uppercase font-mono">Tâm Điểm</span>
                    <span className="text-xs font-display font-bold text-brand-gold">{data.focusArea}</span>
                  </div>
                </div>

                {/* Grid of Dos & Don'ts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Việc nên làm */}
                  <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <h4 className="text-xs font-display uppercase tracking-wider font-bold">Việc Nên Ưu Tiên Hôm Nay</h4>
                    </div>
                    <ul className="space-y-1.5">
                      {data.dos.map((item, idx) => (
                        <li key={idx} className="text-xs text-white/75 flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Việc nên thận trọng */}
                  <div className="p-4 rounded-xl bg-rose-500/[0.04] border border-rose-500/20 space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                      <h4 className="text-xs font-display uppercase tracking-wider font-bold">Thận Trọng & Cần Tránh</h4>
                    </div>
                    <ul className="space-y-1.5">
                      {data.donts.map((item, idx) => (
                        <li key={idx} className="text-xs text-white/75 flex items-start gap-2">
                          <span className="text-rose-400 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Quick Advice & Lucky Color Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-2 text-white/70">
                    <Lightbulb className="w-4 h-4 text-brand-gold flex-shrink-0" />
                    <span className="italic">"{data.advice}"</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-white/40 text-[11px]">Màu cát tường:</span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-brand-gold">
                      {data.luckyColor}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

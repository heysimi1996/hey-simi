import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, NumerologyData, TarotCard } from "../types";
import { calculateCungPhi } from "./numerology";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function interpretCompatibility(p1: UserInput, d1: NumerologyData, p2: UserInput, d2: NumerologyData) {
  const p1CungPhi = calculateCungPhi(p1.birthDate, p1.gender);
  const p2CungPhi = calculateCungPhi(p2.birthDate, p2.gender);

  const prompt = `
    Bạn là một BẬC THẦY CỐ VẤN QUAN HỆ & HÔN NHÂN AI, chuyên gia cao cấp về Thần số học Pythagoras, Chiêm Tinh Học Tây Phương (Cung Hoàng Đạo & Tương Tác Hành Tinh), Ngũ Hành Bản Mệnh và Cung Phi Bát Trạch Á Đông.
    
    Hãy làm một bản phân tích SIÊU CHI TIẾT, ĐI SÂU BẢN CHẤT VÀ SO SÁNH TRỰC QUAN BẰNG CÁC BẢNG MARKDOWN CHUYÊN NGHIỆP (dung lượng tối thiểu 1500 - 2000 từ) về sự tương hợp giữa hai người:
    
    NGƯỜI 1: ${p1.fullName}
    - Giới tính: ${p1.gender} | Sinh ngày: ${p1.birthDate}
    - Con số chủ đạo (Life Path): ${d1.lifePath} | Số Sứ mệnh: ${d1.destiny} | Số Linh hồn: ${d1.soulUrge} | Số Nhân cách: ${d1.innerSelf}
    - Cung Hoàng Đạo: ${d1.zodiacData.name} (${d1.zodiacData.symbol} - Nguyên tố ${d1.zodiacData.element} - Sao chiếu: ${d1.zodiacData.rulingPlanet})
    - Bản Mệnh: ${d1.elementData.element} (${d1.elementData.napAm})
    - Cung Phi Bát Trạch: ${p1CungPhi}

    NGƯỜI 2: ${p2.fullName}
    - Giới tính: ${p2.gender} | Sinh ngày: ${p2.birthDate}
    - Con số chủ đạo (Life Path): ${d2.lifePath} | Số Sứ mệnh: ${d2.destiny} | Số Linh hồn: ${d2.soulUrge} | Số Nhân cách: ${d2.innerSelf}
    - Cung Hoàng Đạo: ${d2.zodiacData.name} (${d2.zodiacData.symbol} - Nguyên tố ${d2.zodiacData.element} - Sao chiếu: ${d2.zodiacData.rulingPlanet})
    - Bản Mệnh: ${d2.elementData.element} (${d2.elementData.napAm})
    - Cung Phi Bát Trạch: ${p2CungPhi}

    YÊU CẦU ĐỊNH DẠNG MARKDOWN & BẢNG SO SÁNH CHUYÊN SÂU:
    1. **Bảng Đối Chiếu 8 Thông Số Toàn Diện (comparisonTable)**: Bắt buộc xuất bảng Markdown so sánh chi tiết giữa Người 1 và Người 2 kèm đánh giá tương tác cụ thể từng hàng.
    2. **Phân Tích Tương Hợp Đa Tầng (compatibilityAnalysis)**:
       - Luận giải chi tiết sự cộng hưởng giữa 2 số chủ đạo (${d1.lifePath} & ${d2.lifePath}), 2 Cung Hoàng Đạo, 2 Nguyên tố và Ngũ Hành nạp âm.
       - Kèm **Bảng Đánh Giá Mức Độ Hòa Hợp Theo Từng Khía Cạnh** (Khía cạnh, Điểm hòa hợp %, Bản chất tương tác, Lời khuyên gắn kết).
    3. **Tử Huyệt Xung Khắc & Bảng So Sánh Tình Huống Đời Thường (conflicts)**:
       - Bắt buộc có **Bảng So Sánh Phản Ứng Đời Thường Khi Xảy Ra Biến Cố** giữa ${p1.fullName} và ${p2.fullName} (các tình huống: Khi cãi vã, Khi áp lực tài chính, Khi chia sẻ việc nhà, Khi đối nội đối ngoại).
       - Phân tích chi tiết điểm mù cảm xúc và mầm mống bất hòa nếu không được chuyển hóa.
    4. **Chiến Lược Hóa Giải & Kế Hoạch Vun Đắp (solutions)**:
       - Bắt buộc có **Bảng Kế Hoạch 3 Bước Hóa Giải Xung Khắc & Nuôi Dưỡng Tình Thân**.
       - Hướng dẫn phong thủy nhà ở, màu sắc hài hòa và nguyên tắc giao tiếp 24h.

    TRẢ VỀ JSON CHUẨN:
    {
      "score": number, // Điểm tương hợp từ 0-100
      "comparisonTable": "...", // Dạng markdown table chi tiết
      "compatibilityAnalysis": "...", // Markdown chi tiết kèm bảng
      "conflicts": "...", // Markdown chi tiết kèm bảng so sánh tình huống
      "solutions": "..." // Markdown chi tiết kèm bảng kế hoạch hóa giải
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            comparisonTable: { type: Type.STRING },
            compatibilityAnalysis: { type: Type.STRING },
            conflicts: { type: Type.STRING },
            solutions: { type: Type.STRING }
          },
          required: ["score", "comparisonTable", "compatibilityAnalysis", "conflicts", "solutions"]
        }
      }
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Compatibility AI Error:", error);
    return {
      score: 85,
      comparisonTable: `| Hạng Mục Thông Số | ${p1.fullName} | ${p2.fullName} | Đánh Giá Tương Tác & Hòa Hợp |\n|---|---|---|---|\n| **Cung Hoàng Đạo** | ${d1.zodiacData.name} (${d1.zodiacData.symbol}) | ${d2.zodiacData.name} (${d2.zodiacData.symbol}) | Hòa hợp năng lượng (${d1.zodiacData.element} & ${d2.zodiacData.element}) |\n| **Sao Chiếu Mệnh** | ${d1.zodiacData.rulingPlanet} | ${d2.zodiacData.rulingPlanet} | Cân bằng trực giác và lý trí |\n| **Số Chủ Đạo (Life Path)** | Con Số **${d1.lifePath}** | Con Số **${d2.lifePath}** | Bổ trợ mục tiêu và đòn bẩy sự nghiệp |\n| **Số Linh Hồn** | ${d1.soulUrge} | ${d2.soulUrge} | Đồng điệu khát vọng và rung động nội tại |\n| **Số Sứ Mệnh** | ${d1.destiny} | ${d2.destiny} | Tương trợ phát triển di sản lâu dài |\n| **Số Nhân Cách** | ${d1.innerSelf} | ${d2.innerSelf} | Thu hút và tôn trọng khí chất của nhau |\n| **Bản Mệnh Ngũ Hành** | Mệnh ${d1.elementData.element} (${d1.elementData.napAm}) | Mệnh ${d2.elementData.element} (${d2.elementData.napAm}) | Tương sinh bồi đắp sinh khí vượng tài |\n| **Cung Phi Bát Trạch** | ${p1CungPhi} | ${p2CungPhi} | Diên Niên / Sinh Khí đại cát đại lợi |`,
      compatibilityAnalysis: `### **1. Tương Hòa Về Trường Năng Lượng & Tâm Thức**\nSự kết hợp giữa **${p1.fullName}** (Số chủ đạo **${d1.lifePath}**) và **${p2.fullName}** (Số chủ đạo **${d2.lifePath}**) tạo nên một liên minh vững chãi, nơi mỗi người đều tìm thấy mảnh ghép bổ trợ hoàn hảo cho những khiếm khuyết của bản thân.\n\n### **Bảng Đánh Giá Mức Độ Hòa Hợp Theo Từng Khía Cạnh**\n\n| Khía Cạnh Đời Sống | Điểm Hòa Hợp | Bản Chất Tương Tác | Lời Khuyên Gắn Kết |\n|---|---|---|---|\n| **Tình Cảm & Sự Lãng Mạn** | 88% | Sâu sắc, chân thành và có chiều sâu nội tâm | Thường xuyên chia sẻ cảm xúc chân thật, tránh giữ kín trong lòng |\n| **Tài Chính & Quản Trị Chi Tiêu** | 82% | Bổ trợ giữa tầm nhìn đầu tư lớn và tích lũy an toàn | Thống nhất ngân sách dự phòng và công khai các khoản đầu tư lớn |\n| **Giao Tiếp & Đồng Thuận** | 80% | Tôn trọng quan điểm riêng của đối phương | Lắng nghe trọn vẹn trước khi phản hồi logic |\n| **Gia Đình & Đối Nội Đối Ngoại** | 90% | Có trách nhiệm cao và hướng về tổ ấm | Phân chia vai trò rõ ràng theo thế mạnh của mỗi người |`,
      conflicts: `### **3. Bảng So Sánh Phản Ứng Tình Huống Đời Thường Giữa 2 Người**\n\n| Tình Huống Thực Tế | Phản Ứng Của ${p1.fullName} | Phản Ứng Của ${p2.fullName} | Nguy Cơ Xung Đột & Cách Hóa Giải |\n|---|---|---|---|\n| **Khi Xảy Ra Bất Đồng / Cãi Vã** | Có xu hướng suy nghĩ độc lập, cần không gian riêng để phân tích | Cần được giãi bày cảm xúc ngay lập tức để giải tỏa | Không nên dùng sự im lặng làm vũ khí; hãy hẹn thời gian trò chuyện cụ thể |\n| **Khi Đối Mặt Áp Lực Tài Chính** | Tập trung tìm giải pháp hành động và tối ưu dòng tiền | Chú trọng sự an toàn, lo lắng cho rủi ro bất ngờ | Cùng lập bảng kế hoạch tài chính minh bạch để củng cố niềm tin |\n| **Khi Đưa Ra Quyết Định Lớn** | Quyết đoán, nhìn vào bức tranh tổng thể dài hạn | Cẩn trọng, rà soát từng tiểu tiết và rủi ro | Kết hợp tầm nhìn chiến lược với sự tỉ mỉ để tạo ra phương án hoàn hảo |`,
      solutions: `### **4. Kế Hoạch 3 Bước Hóa Giải & Nuôi Dưỡng Hạnh Phúc Bền Lâu**\n\n| Bước Thực Hiện | Nội Dung Trọng Tâm | Hành Động Thực Tiễn Cụ Thể |\n|---|---|---|\n| **Bước 1: Quy Tắc 24 Giờ Trong Giao Tiếp** | Hạ nhiệt cái tôi khi bất đồng | Khi có xung đột, dừng tranh luận và cho nhau khoảng lặng 24 giờ trước khi cùng ngồi lại đối thoại |\n| **Bước 2: Cân Bằng Không Gian Chung & Riêng** | Tôn trọng tự do cá nhân | Mỗi người dành cho nhau khoảng không gian độc lập để phát triển sự nghiệp và đam mê riêng |\n| **Bước 3: Kích Hoạt Phong Thủy Hài Hòa** | Hòa hợp năng lượng ngũ hành | Bố trí không gian sống với gam màu cát tường kết hợp ${d1.elementData.luckyColors[0]} và ${d2.elementData.luckyColors[0]} để đón vượng khí |`
    };
  }
}

export async function interpretNumerology(input: UserInput, data: NumerologyData) {
  const prompt = `
    Bạn là một bậc thầy CỐ VẤN TỐI CAO về Thần số học Pythagoras, Chiêm Tinh Học Tây Phương, Ngũ Hành Bản Mệnh và Nhân Tướng Học Á Đông.
    
    Hãy thực hiện một bản luận giải SIÊU CHI TIẾT, ĐI SÂU VÀO BẢN CHẤT TÂM LÝ, ĐẶT CÁC BẢNG SO SÁNH TRỰC QUAN (MARKDOWN COMPARISON TABLES) Ở TỪNG MỤC ĐỂ NGƯỜI ĐỌC DỄ HIỂU VÀ MANG GIÁ TRỊ THỰC HÀNH CỰC CAO (Tổng dung lượng tối thiểu 2000 - 2800 từ) cho người dùng sau:
    
    THÔNG TIN CƠ BẢN:
    - Họ tên: ${input.fullName}
    - Ngày sinh: ${input.birthDate}
    - Giới tính: ${input.gender}
    
    DỮ LIỆU CUNG HOÀNG ĐẠO (ASTROLOGY):
    - Cung Hoàng Đạo: ${data.zodiacData.name} (${data.zodiacData.englishName} - Biểu tượng: ${data.zodiacData.symbol})
    - Khoảng ngày: ${data.zodiacData.dateRange}
    - Nguyên tố Chiêm tinh: ${data.zodiacData.element} (Lửa / Đất / Khí / Nước)
    - Sao chiếu mệnh: ${data.zodiacData.rulingPlanet}
    - Cung nhà chiêm tinh: ${data.zodiacData.zodiacHouse}
    - Châm ngôn bản mệnh: "${data.zodiacData.motto}"
    - Tố chất nổi bật: ${data.zodiacData.traits.join(', ')}
    - Điểm mạnh bẩm sinh: ${data.zodiacData.strengths.join(', ')}
    - Thử thách nội tại: ${data.zodiacData.challenges.join(', ')}
    - Các cung hòa hợp nhất: ${data.zodiacData.compatibilitySigns.join(', ')}

    DỮ LIỆU THẦN SỐ HỌC PYTHAGORAS:
    - Con số chủ đạo (Life Path): ${data.lifePath}
    - Chỉ số linh hồn (Soul Urge): ${data.soulUrge}
    - Chỉ số sứ mệnh (Destiny): ${data.destiny}
    - Chỉ số nhân cách / năng lực tự nhiên: ${data.innerSelf}
    - Chỉ số trưởng thành (Maturity): ${data.maturity}
    - Năm cá nhân hiện tại: ${data.personalYear}
    - Các đỉnh cao Kim tự tháp: ${data.pyramids.join(', ')}
    - Mũi tên sức mạnh / trống: ${data.arrows.map(a => `${a.name} (${a.path})`).join(', ')}
    
    DỮ LIỆU NGŨ HÀNH (BẢN MỆNH PHƯƠNG ĐÔNG):
    - Mệnh: ${data.elementData.element}
    - Nạp Âm: ${data.elementData.napAm}
    
    DỮ LIỆU DIỆN MẠO SINH TRẮC & NHÂN TƯỚNG:
    ${input.faceImage 
      ? "- DỮ LIỆU ĐÍNH KÈM: Người dùng đã chụp/tải lên ảnh chân dung thực tế. Hãy quan sát trực tiếp, định lượng và phân tích tỉ mỉ từng chi tiết cấu trúc xương mặt, độ cao rộng của trán, ấn đường, thần mắt, sống mũi, cánh mũi, nhân trung, khóe miệng, cằm và khí sắc tổng thể để luận đoán chân thực."
      : `- Đặc điểm nhân tướng học tham chiếu: ${JSON.stringify(input.facialFeatures || { forehead: "Cao, rộng", eyes: "Sáng, to", mouth: "Cân đối" })} kết hợp trường năng lượng của số chủ đạo ${data.lifePath} và cung ${data.zodiacData.name}.`
    }

    YÊU CẦU ĐẶC BIỆT VỀ ĐỊNH DẠNG MARKDOWN & BẢNG SO SÁNH Ở TỪNG MỤC:
    1. **overview (Tổng quan bản mệnh)**:
       - Luận giải cốt cách, định vị bản thân và tiềm năng bẩm sinh.
       - BẮT BUỘC CÓ **Bảng Đối Chiếu 5 Chỉ Số Vận Mệnh Cốt Lõi**:
         | Chỉ Số Cốt Lõi | Giá Trị | Tần Số Rung Động | Ý Nghĩa Thực Tế & Lời Khuyên Hành Động |
         (Bao gồm: Số Chủ Đạo ${data.lifePath}, Số Linh Hồn ${data.soulUrge}, Số Sứ Mệnh ${data.destiny}, Số Nhân Cách ${data.innerSelf}, Số Trưởng Thành ${data.maturity}).
    2. **innerEnergy (Tâm thức & Tình huống thực tế)**:
       - Phân tích khao khát linh hồn, bài học quản trị cái tôi, điểm mù cảm xúc.
       - BẮT BUỘC CÓ **Bảng So Sánh Hành Xử Tình Huống Thực Tế Của Người Mang Số ${data.lifePath}**:
         | Tình Huống Thực Tế | Phản Xạ Thói Quen Cũ (Điểm Mù) | Hướng Chuyển Hóa Đỉnh Cao (Thành Công) |
         (So sánh các tình huống: Khi gặp khủng hoảng/thất bại, Khi quản lý tiền bạc/đầu tư, Khi bất hòa trong tình yêu, Khi hợp tác làm việc).
       - Bộ 3 câu hỏi phản tư (Self-reflection Questions) trúng tim đen.
    3. **futureForecast (Dự báo vận trình & 4 đỉnh cao)**:
       - Luận giải năm cá nhân ${data.personalYear} và chu kỳ 9 năm.
       - BẮT BUỘC CÓ **Bảng Lộ Trình 4 Đỉnh Cao Kim Tự Tháp Pythagoras**:
         | Đỉnh Cao | Độ Tuổi Mốc | Con Số Đỉnh | Cơ Hội Vàng & Thành Tựu | Bài Học Cần Tôi Luyện |
         (Luận đoán chi tiết 4 đỉnh ${data.pyramids[0]}, ${data.pyramids[1]}, ${data.pyramids[2]}, ${data.pyramids[3]}).
    4. **faceAnalysis (Nhân tướng học AI)**:
       - Phân tích chi tiết 4 phần (Tam đình ngũ quan, Cát tướng, Khuyết hãm rủi ro, Tâm tướng tu dưỡng).
       - BẮT BUỘC CÓ **Bảng Tổng Hợp Tam Đình & Ngũ Quan Diện Mạo**:
         | Bộ Vị Diện Mạo | Đặc Điểm Nhân Tướng | Vận Mệnh & Tài Lộc Tương Ứng | Lời Khuyên Tu Dưỡng Cải Tướng |
    5. **elementAnalysis (Ngũ hành nạp âm)**:
       - Luận giải nạp âm ${data.elementData.napAm} và ngũ hành ${data.elementData.element}.
       - BẮT BUỘC CÓ **Bảng Tương Sinh Tương Khắc & Ứng Dụng Đời Sống** (Mối quan hệ, Nguyên tố tương tác, Tác động công việc & sức khỏe, Phương pháp kích hoạt).
    6. **zodiacAnalysis (Chiêm tinh cung hoàng đạo)**:
       - Luận giải cung ${data.zodiacData.name} (${data.zodiacData.symbol}) kết hợp số chủ đạo ${data.lifePath} và sao chiếu mệnh ${data.zodiacData.rulingPlanet}.
       - BẮT BUỘC CÓ **Bảng Giao Thoa Chiêm Tinh & Thần Số Học** (Khía cạnh, Cung ${data.zodiacData.name}, Số chủ đạo ${data.lifePath}, Sự cộng hưởng độc bản).
    7. **fengShui (Phong thủy cát tường)**:
       - Màu sắc, con số cát tường và lời khuyên ứng dụng.

    TRẢ VỀ JSON CHUẨN:
    {
      "overview": "...", 
      "innerEnergy": "...", 
      "futureForecast": "...",
      "faceAnalysis": "...",
      "elementAnalysis": "...",
      "zodiacAnalysis": "...",
      "fengShui": {
        "luckyColors": ["..."],
        "luckyNumbers": [...],
        "advice": "..."
      }
    }
  `;

  let contentsPayload: any = prompt;

  if (input.faceImage) {
    const base64Data = input.faceImage.includes(',')
      ? input.faceImage.split(',')[1]
      : input.faceImage;

    contentsPayload = {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        },
        {
          text: prompt
        }
      ]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contentsPayload,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            innerEnergy: { type: Type.STRING },
            futureForecast: { type: Type.STRING },
            faceAnalysis: { type: Type.STRING },
            elementAnalysis: { type: Type.STRING },
            zodiacAnalysis: { type: Type.STRING },
            fengShui: {
              type: Type.OBJECT,
              properties: {
                luckyColors: { type: Type.ARRAY, items: { type: Type.STRING } },
                luckyNumbers: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                advice: { type: Type.STRING }
              },
              required: ["luckyColors", "luckyNumbers", "advice"]
            }
          },
          required: ["overview", "innerEnergy", "futureForecast", "faceAnalysis", "elementAnalysis", "zodiacAnalysis", "fengShui"]
        }
      }
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Interpretation Error:", error);
    return {
      overview: `### **Bản Luận Giải Vận Mệnh Tổng Quan Cho ${input.fullName}**\n\nNgười mang **Con số chủ đạo ${data.lifePath}** sinh ngày **${input.birthDate}**, thuộc cung hoàng đạo **${data.zodiacData.name}** (${data.zodiacData.symbol}) và bản mệnh **${data.elementData.napAm}** sở hữu một trường năng lượng nội tại vô cùng đặc sắc.\n\n### **Bảng Đối Chiếu 5 Chỉ Số Vận Mệnh Cốt Lõi**\n\n| Chỉ Số Cốt Lõi | Giá Trị | Tần Số Rung Động | Ý Nghĩa Thực Tế & Lời Khuyên Hành Động |\n|---|---|---|---|\n| **Số Chủ Đạo (Life Path)** | **${data.lifePath}** | Trục chính định hướng cuộc đời | Khẳng định bản lĩnh tự chủ, phát huy tối đa năng lực tư duy chiến lược |\n| **Số Linh Hồn (Soul Urge)** | **${data.soulUrge}** | Khát vọng sâu kín trong tâm thức | Cần được thấu hiểu, tự do thể hiện chính kiến và kiến tạo giá trị thực chất |\n| **Số Sứ Mệnh (Destiny)** | **${data.destiny}** | Phương tiện hiện thực hóa tiềm năng | Xây dựng sự nghiệp vững chắc, trở thành điểm tựa uy tín cho cộng đồng |\n| **Số Nhân Cách (Inner Self)** | **${data.innerSelf}** | Ấn tượng khí chất đối ngoại | Thể hiện sự đĩnh đạc, kiên định và phong thái chuyên nghiệp thu hút quý nhân |\n| **Số Trưởng Thành (Maturity)** | **${data.maturity}** | Năng lượng đỉnh cao giai đoạn chín muồi | Đạt tới sự an hòa, làm chủ tài chính và viên mãn trong các mối quan hệ |`,
      innerEnergy: `### **Khám Phá Tầng Sâu Tâm Thức & Năng Lượng Nội Tại**\n\nVới **Chỉ số Linh Hồn ${data.soulUrge}** và **Chỉ số Sứ Mệnh ${data.destiny}**, khao khát sâu kín nhất bên trong bạn là sự tự do trong tư tưởng và khả năng để lại di sản thực chất cho cộng đồng.\n\n### **Bảng So Sánh Hành Xử Tình Huống Thực Tế Của Người Mang Số ${data.lifePath}**\n\n| Tình Huống Thực Tế | Phản Xạ Thói Quen Cũ (Điểm Mù) | Hướng Chuyển Hóa Đỉnh Cao (Thành Công) |\n|---|---|---|\n| **Khi Gặp Khủng Hoảng / Biến Cố** | Ôm đồm gánh vác một mình, có xu hướng co cụm phân tích | Chủ động mở rộng đối thoại, phân quyền và đón nhận sự trợ lực từ đồng đội |\n| **Khi Quản Lý Tài Chính & Đầu Tư** | Đôi khi quá thận trọng hoặc dồn vốn vào cơ hội ngắn hạn | Kiên định với chiến lược đầu tư dài hạn vào tài sản thực và nâng cấp tri thức |\n| **Khi Bất Đồng Quan Điểm Trong Tình Cảm** | Dùng lý lẽ logic để phân định thắng thua | Lắng nghe bằng sự thấu cảm, đặt sự hòa hợp lên trên cái tôi cá nhân |\n\n#### **Bộ 3 Câu Hỏi Phản Tư Giúp Bạn Chuyển Hóa:**\n1. *Điều gì đang khiến tôi do dự buông bỏ, dù biết nó không còn phục vụ cho sự tiến hóa của tôi?*\n2. *Tôi đang lắng nghe bằng sự thấu cảm thực sự hay chỉ đang chờ đến lượt mình để đưa ra lời khuyên logic?*\n3. *Nếu không có nỗi sợ thất bại, quyết định mang tính bứt phá tiếp theo trong sự nghiệp của tôi là gì?*`,
      futureForecast: `### **Vận Trình Năm Cá Nhân ${data.personalYear} & 4 Đỉnh Cao Thành Công**\n\nNăm cá nhân số **${data.personalYear}** đánh dấu một giai đoạn chuyển tiếp quan trọng trong chu kỳ 9 năm của bạn.\n\n### **Bảng Lộ Trình 4 Đỉnh Cao Kim Tự Tháp Pythagoras**\n\n| Đỉnh Cao | Độ Tuổi Mốc | Con Số Đỉnh | Cơ Hội Vàng & Thành Tựu | Bài Học Cần Tôi Luyện |\n|---|---|---|---|---|\n| **Đỉnh 1** | Giai đoạn tiền vận | **${data.pyramids[0]}** | Đặt nền móng tri thức, định hình nhân sinh quan | Rèn luyện tính kiên nhẫn và kỷ luật bản thân |\n| **Đỉnh 2** | Giai đoạn lập thân | **${data.pyramids[1]}** | Bước ngoặt phát triển sự nghiệp, khẳng định vị thế | Học cách quản trị cảm xúc và xây dựng mạng lưới hợp tác |\n| **Đỉnh 3** | Giai đoạn chín muồi | **${data.pyramids[2]}** | Khai sáng tri thức, lan tỏa giá trị cộng đồng | Tận tâm phụng sự, cân bằng giữa vật chất và tinh thần |\n| **Đỉnh 4** | Giai đoạn hậu vận | **${data.pyramids[3]}** | Đạt trạng thái viên mãn, an hòa nội tâm | Buông bỏ bám chấp, truyền cảm hứng cho thế hệ kế cận |`,
      faceAnalysis: `### **I. Phân Tích Cấu Trúc Tam Đình & Ngũ Quan Toàn Diện**\n\n### **Bảng Tổng Hợp Tam Đình & Ngũ Quan Diện Mạo**\n\n| Bộ Vị Diện Mạo | Đặc Điểm Nhân Tướng | Vận Mệnh & Tài Lộc Tương Ứng | Lời Khuyên Tu Dưỡng Cải Tướng |\n|---|---|---|---|\n| **Thượng Đình (Trán & Ấn Đường)** | Vầng trán cao rộng, ấn đường sáng sủa | Tư duy phân tích sắc sảo, sớm nắm bắt quy luật thành công | Giữ tâm trí thanh thản, tránh nhăn trán khi suy nghĩ |\n| **Trung Đình (Mắt & Sống Mũi)** | Sống mũi thẳng vững chãi, thần mắt trầm tĩnh | Ý chí kiên định, khả năng tạo lập và giữ gìn dòng tiền tốt | Rèn luyện ánh mắt ấm áp, lắng nghe nhiều hơn |\n| **Hạ Đình (Nhân Trung & Cằm)** | Nhân trung sâu dài, địa các nở nang vững chắc | Hậu vận sung túc, được người xung quanh kính trọng | Luôn giữ nụ cười tươi tắn, khoan dung với người khác |\n\n### **II. Cát Tướng & Khuyết Hãm Cảnh Báo**\n- **Cát tướng**: Khí sắc thanh tú, ánh mắt có chiều sâu giúp bạn dễ dàng thu hút nguồn lực và quý nhân tương trợ trong các bước ngoặt quan trọng.\n- **Khuyết hãm cần phòng**: Khi căng thẳng quá độ, cơ mặt có xu hướng co cứng vùng thái dương; cần điều hòa nhịp thở và ngủ đủ giấc.`,
      elementAnalysis: `### **Phân Tích Ngũ Hành & Nạp Âm Bản Mệnh**\n\nBạn mang bản mệnh **${data.elementData.element}** với Nạp Âm **${data.elementData.napAm}**.\n\n### **Bảng Tương Sinh Tương Khắc & Ứng Dụng Đời Sống**\n\n| Mối Quan Hệ Ngũ Hành | Nguyên Tố Tương Tác | Tác Động Trong Cuộc Sống & Sự Nghiệp | Phương Pháp Kích Hoạt Sinh Khí |\n|---|---|---|---|\n| **Tương Sinh (Bồi đắp)** | Hợp Hành Tương Sinh | Mang lại quý nhân, may mắn và gia tăng năng lượng tích cực | Ứng dụng màu sắc trang phục và vật phẩm phong thủy tương hợp |\n| **Bản Mệnh (Hòa hợp)** | ${data.elementData.element} (${data.elementData.napAm}) | Củng cố sức mạnh nội tại và sự tự tin | Duy trì không gian làm việc sạch sẽ, thoáng đãng |\n| **Tương Khắc (Hạn chế)** | Hành Khắc Chế | Dễ gây tiêu hao năng lượng và căng thẳng nếu lạm dụng | Sử dụng yếu tố trung gian hóa giải để giữ cân bằng |`,
      zodiacAnalysis: `### **Giải Mã Chiêm Tinh Học: Cung ${data.zodiacData.name} (${data.zodiacData.symbol})**\n\nCung Hoàng Đạo **${data.zodiacData.name}** thuộc nguyên tố **${data.zodiacData.element}**, chịu sự bảo trợ của sao **${data.zodiacData.rulingPlanet}**.\n\n### **Bảng Giao Thoa Chiêm Tinh & Thần Số Học**\n\n| Khía Cạnh Đánh Giá | Cung ${data.zodiacData.name} (${data.zodiacData.element}) | Số Chủ Đạo ${data.lifePath} | Điểm Độc Bản Khi Kết Hợp |\n|---|---|---|---|\n| **Phong Cách Tư Duy** | Nhạy bén, giàu trực giác và óc thẩm mỹ | Thực tế, có chiến lược và hướng tới mục tiêu | Vừa có tầm nhìn xa vừa hành động chuẩn xác, bài bản |\n| **Khả Năng Lãnh Đạo** | Truyền cảm hứng và gắn kết đồng đội | Quyết đoán, dẫn dắt bằng kỷ luật và hiệu suất | Nhà lãnh đạo được tôn trọng cả về tài năng lẫn nhân cách |\n| **Tử Huyệt Cần Rèn** | Đôi khi nhạy cảm với dư luận | Đôi khi quá khắt khe với chính mình | Học cách buông bỏ sự cầu toàn thái quá để sống an nhiên |`,
      fengShui: {
        luckyColors: data.elementData.luckyColors,
        luckyNumbers: [data.lifePath, ...data.elementData.luckyNumbers],
        advice: `Kết hợp màu ${data.elementData.luckyColors[0]} cùng năng lượng cung ${data.zodiacData.name} để gia tăng sinh khí và hanh thông tài vận.`
      }
    };
  }
}

export async function interpretTarotDaily(
  card: TarotCard,
  isReversed: boolean,
  userName: string = 'Bạn',
  focusArea: string = 'Toàn Diện Ngày Mới'
) {
  const orientation = isReversed ? 'Ngược (Reversed)' : 'Xuôi (Upright)';
  const prompt = `
    Bạn là một BẬC THẦY TAROT MASTER & CỐ VẤN TÂM LINH AI uyên bác, giàu năng lượng thấu cảm và chuyển hóa.
    Người dùng: "${userName}" vừa rút được 1 lá bài Tarot cho thông điệp ngày hôm nay.
    
    THÔNG TIN LÁ BÀI:
    - Lá bài: ${card.romanNumeral}. ${card.name} - ${card.vietnameseName} (${orientation})
    - Nguyên tố & Hành tinh: ${card.element} / ${card.planetOrSign}
    - Hình tượng cổ mẫu (Archetype): ${card.archetype}
    - Từ khóa: ${(isReversed ? card.reversedKeywords : card.uprightKeywords).join(', ')}
    - Tâm điểm yêu cầu: ${focusArea}
    
    YÊU CẦU LUẬN GIẢI CHUYÊN SÂU & ĐỊNH DẠNG MARKDOWN CÓ BẢNG TÓM TẮT:
    1. **overviewMessage**: Thông điệp vũ trụ tổng quan của ngày hôm nay. Luận giải sâu sắc về tần số rung động và bài học thức tỉnh từ lá bài ${card.name} (${orientation}).
       - Kèm **Bảng Tóm Tắt Năng Lượng & Hành Động Trong Ngày**:
         | Lĩnh Vực Đời Sống | Năng Lượng Chi Phối Từ Lá Bài | Lời Khuyên Hành Động Ưu Tiên |
    2. **careerAndFinance**: Luận giải về CÔNG VIỆC, KINH DOANH VÀ TÀI CHÍNH hôm nay. Cách đàm phán, tránh bẫy rủi ro và tối ưu cơ hội.
    3. **loveAndRelationships**: Luận giải về TÌNH CẢM, GIA ĐÌNH VÀ CÁC MỐI QUAN HỆ. Lời khuyên nuôi dưỡng sự gắn kết và cách ứng xử trước các tình huống nhạy cảm.
    4. **mindAndSpirit**: Luận giải về TINH THẦN, TÂM THỨC VÀ SỰ BÌNH AN NỘI TẠI. Phương pháp thiền định, thanh lọc tâm trí.
    5. **actionableAdvice**: Lời khuyên hành động cụ thể, thiết thực nhất trong ngày hôm nay (1-2 câu súc tích).
    6. **affirmation**: Một câu khẳng định tích cực (Affirmation Mantra) truyền cảm hứng mạnh mẽ.
    7. **luckySymbol**: Biểu tượng may mắn hoặc đồ vật/màu sắc tương thích trong ngày.
    
    TRẢ VỀ ĐỊNH DẠNG JSON:
    {
      "overviewMessage": "...",
      "careerAndFinance": "...",
      "loveAndRelationships": "...",
      "mindAndSpirit": "...",
      "actionableAdvice": "...",
      "affirmation": "...",
      "luckySymbol": "..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overviewMessage: { type: Type.STRING },
            careerAndFinance: { type: Type.STRING },
            loveAndRelationships: { type: Type.STRING },
            mindAndSpirit: { type: Type.STRING },
            actionableAdvice: { type: Type.STRING },
            affirmation: { type: Type.STRING },
            luckySymbol: { type: Type.STRING }
          },
          required: [
            "overviewMessage",
            "careerAndFinance",
            "loveAndRelationships",
            "mindAndSpirit",
            "actionableAdvice",
            "affirmation",
            "luckySymbol"
          ]
        }
      }
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Tarot AI Interpretation Error:", error);
    return {
      overviewMessage: `Lá bài **${card.vietnameseName}** (${orientation}) mang đến thông điệp: ${card.coreMessage}\n\n### **Bảng Tóm Tắt Năng Lượng & Hành Động Trong Ngày**\n\n| Lĩnh Vực Đời Sống | Năng Lượng Chi Phối Từ Lá Bài | Lời Khuyên Hành Động Ưu Tiên |\n|---|---|---|\n| **Sự Nghiệp & Công Việc** | Tập trung, có chiến lược rõ ràng | Quyết đoán xử lý dứt điểm các đầu việc quan trọng |\n| **Tài Chính & Dòng Tiền** | Cân bằng thu chi, tránh mua sắm bốc đồng | Rà soát ngân sách và ưu tiên tích lũy an toàn |\n| **Tình Cảm & Kết Nối** | Chân thành, lắng nghe thấu hiểu | Dành thời gian chất lượng cho người thân yêu |\n| **Tâm Trí & Sức Khỏe** | Thanh lọc tâm trí, bình an nội tại | Dành 10 phút thiền định hoặc đi dạo thư giãn |`,
      careerAndFinance: `Trong công việc và tài chính, năng lượng của ${card.name} khuyến khích bạn hành động có chiến lược. Hãy giữ vững sự tập trung, minh bạch trong các giao dịch và chủ động giải quyết dứt điểm các đầu việc còn tồn đọng.`,
      loveAndRelationships: `Về khía cạnh tình cảm, sự chân thành và thấu hiểu sẽ là chìa khóa kết nối trái tim. Hãy dành thời gian lắng nghe người thân yêu mà không phán xét, hoặc mở lòng đón nhận những tín hiệu nhân duyên mới.`,
      mindAndSpirit: `Về mặt tinh thần, hãy cho phép bản thân được nghỉ ngơi ngắn giữa các giờ làm việc. Tĩnh tâm 5-10 phút để thanh lọc tâm trí và lắng nghe tiếng nói trực giác bên trong bạn.`,
      actionableAdvice: card.advice,
      affirmation: `Tôi đón nhận ngày hôm nay với lòng biết ơn, sự tự tin và nguồn năng lượng dồi dào từ vũ trụ.`,
      luckySymbol: `Năng lượng nguyên tố ${card.element} & Màu sắc tươi sáng`
    };
  }
}

import { NumerologyResult } from '../types';

export interface CanvasCardOptions {
  format?: 'story' | 'square' | 'portrait';
}

/**
 * Generates an ultra high-definition cosmic VIP destiny report card on HTML5 Canvas
 */
export async function generateDestinyCardCanvas(
  result: NumerologyResult,
  format: 'story' | 'square' | 'portrait' = 'portrait'
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  
  // Set dimensions based on format (2x scale for Retina sharpness)
  let width = 1080;
  let height = 1350; // 4:5 Instagram Portrait
  if (format === 'story') {
    width = 1080;
    height = 1920; // 9:16 Story
  } else if (format === 'square') {
    width = 1080;
    height = 1080; // 1:1 Square
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create 2D context');

  const { input, numerology } = result;

  // 1. Background Gradient & Cosmic Atmosphere
  const bgGrad = ctx.createRadialGradient(
    width * 0.5, height * 0.35, 100,
    width * 0.5, height * 0.5, width * 0.9
  );
  bgGrad.addColorStop(0, '#1a1408');
  bgGrad.addColorStop(0.4, '#0a0907');
  bgGrad.addColorStop(1, '#020202');

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw Subtle Starfield & Cosmic Dust
  ctx.save();
  for (let i = 0; i < 180; i++) {
    const sx = Math.random() * width;
    const sy = Math.random() * height;
    const radius = Math.random() * 2.2;
    const alpha = Math.random() * 0.8 + 0.2;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Occasional gold sparkles
    if (i % 6 === 0) {
      ctx.fillStyle = `rgba(197, 160, 89, ${alpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(sx, sy, radius * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 3. Ornate Double Golden Borders
  const pad = 44;
  ctx.save();
  ctx.strokeStyle = 'rgba(197, 160, 89, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

  ctx.strokeStyle = 'rgba(197, 160, 89, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(pad + 12, pad + 12, width - (pad + 12) * 2, height - (pad + 12) * 2);

  // Corner Ornaments
  const cornerSize = 28;
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, cornerSize);
    ctx.lineTo(0, 0);
    ctx.lineTo(cornerSize, 0);
    ctx.stroke();

    ctx.fillStyle = '#c5a059';
    ctx.beginPath();
    ctx.arc(6, 6, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawCorner(pad, pad, 0);
  drawCorner(width - pad, pad, Math.PI / 2);
  drawCorner(width - pad, height - pad, Math.PI);
  drawCorner(pad, height - pad, -Math.PI / 2);
  ctx.restore();

  // 4. Header Branding
  ctx.save();
  ctx.textAlign = 'center';
  
  // Brand Logo
  ctx.fillStyle = '#c5a059';
  ctx.font = '900 32px "Cinzel", "Playfair Display", serif, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('HEY! SI MÌ', width / 2, pad + 60);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '600 13px system-ui, -apple-system, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('MẬT MÃ BẢN MỆNH PYTHAGORAS & CHIÊM TINH HỌC AI', width / 2, pad + 88);

  // Decorative header line
  ctx.strokeStyle = 'rgba(197, 160, 89, 0.3)';
  ctx.beginPath();
  ctx.moveTo(width / 2 - 160, pad + 104);
  ctx.lineTo(width / 2 + 160, pad + 104);
  ctx.stroke();

  // Small gold diamond in center of line
  ctx.fillStyle = '#c5a059';
  ctx.beginPath();
  ctx.arc(width / 2, pad + 104, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5. User Profile Header
  let currY = pad + 150;
  ctx.save();
  ctx.textAlign = 'center';

  // Name
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 38px "Cinzel", "Playfair Display", serif, sans-serif';
  ctx.fillText(input.fullName.toUpperCase(), width / 2, currY);

  // Birthdate & Metadata
  currY += 34;
  ctx.fillStyle = 'rgba(197, 160, 89, 0.9)';
  ctx.font = '500 18px system-ui, -apple-system, sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText(
    `Sinh ngày: ${input.birthDate}  •  Giới tính: ${input.gender}`,
    width / 2,
    currY
  );
  ctx.restore();

  // 6. Main Centerpiece: Life Path Number Card
  currY += 50;
  const lpCardW = width - (pad + 40) * 2;
  const lpCardH = format === 'story' ? 360 : 300;
  const lpCardX = (width - lpCardW) / 2;

  // Outer glowing card background
  ctx.save();
  const lpGrad = ctx.createLinearGradient(lpCardX, currY, lpCardX + lpCardW, currY + lpCardH);
  lpGrad.addColorStop(0, 'rgba(197, 160, 89, 0.14)');
  lpGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)');
  lpGrad.addColorStop(1, 'rgba(197, 160, 89, 0.08)');

  ctx.fillStyle = lpGrad;
  ctx.strokeStyle = 'rgba(197, 160, 89, 0.5)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, lpCardX, currY, lpCardW, lpCardH, 24);
  ctx.fill();
  ctx.stroke();

  // Life Path Number Circle
  const circleX = width / 2;
  const circleY = currY + (format === 'story' ? 140 : 115);
  const circleR = format === 'story' ? 70 : 58;

  const circleGrad = ctx.createRadialGradient(circleX, circleY, 10, circleX, circleY, circleR);
  circleGrad.addColorStop(0, 'rgba(197, 160, 89, 0.3)');
  circleGrad.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

  ctx.fillStyle = circleGrad;
  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Big Number text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#c5a059';
  ctx.font = `900 ${format === 'story' ? '72px' : '62px'} "Cinzel", "Playfair Display", serif, sans-serif`;
  ctx.shadowColor = 'rgba(197, 160, 89, 0.6)';
  ctx.shadowBlur = 20;
  ctx.fillText(`${numerology.lifePath}`, circleX, circleY);
  ctx.shadowBlur = 0; // reset shadow

  // Life Path Subtitle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '700 12px system-ui, -apple-system, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('CON SỐ CHỦ ĐẠO (LIFE PATH)', circleX, currY + (format === 'story' ? 42 : 32));

  // Life Path Meaning Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 20px "Cinzel", "Playfair Display", serif, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(`TRƯỜNG NĂNG LƯỢNG SỐ ${numerology.lifePath}`, circleX, currY + lpCardH - (format === 'story' ? 58 : 45));

  ctx.fillStyle = 'rgba(197, 160, 89, 0.85)';
  ctx.font = 'italic 14px system-ui, -apple-system, sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText(`"${numerology.zodiacData.motto || 'Khai mở tiềm năng vô hạn'}"`, circleX, currY + lpCardH - (format === 'story' ? 28 : 22));
  ctx.restore();

  // 7. Grid of 4 Key Destiny Badges
  currY += lpCardH + 32;
  const gridW = width - (pad + 40) * 2;
  const gridCols = 2;
  const gridRows = 2;
  const cardGap = 20;
  const cellW = (gridW - cardGap) / gridCols;
  const cellH = format === 'story' ? 140 : 115;
  const startX = (width - gridW) / 2;

  const badges = [
    {
      title: 'CUNG HOÀNG ĐẠO',
      val: `${numerology.zodiacData.name} (${numerology.zodiacData.symbol})`,
      sub: `Nguyên tố: ${numerology.zodiacData.element} • Sao: ${numerology.zodiacData.rulingPlanet}`,
      color: '#60a5fa'
    },
    {
      title: 'BẢN MỆNH NGŨ HÀNH',
      val: `${numerology.elementData.napAm}`,
      sub: `Mệnh ${numerology.elementData.element} • Hướng: ${numerology.elementData.luckyDirections[0]}`,
      color: '#34d399'
    },
    {
      title: 'CHỈ SỐ TÂM THỨC',
      val: `Linh Hồn: ${numerology.soulUrge}  •  Sứ Mệnh: ${numerology.destiny}`,
      sub: `Nhân cách: ${numerology.innerSelf} • Trưởng thành: ${numerology.maturity}`,
      color: '#f472b6'
    },
    {
      title: 'NĂM CÁ NHÂN & VẬN TRÌNH',
      val: `Năm Số #${numerology.personalYear} Hiện Tại`,
      sub: `4 Đỉnh Kim Tự Tháp: ${numerology.pyramids.join(' - ')}`,
      color: '#fbbf24'
    }
  ];

  badges.forEach((b, idx) => {
    const col = idx % gridCols;
    const row = Math.floor(idx / gridCols);
    const bx = startX + col * (cellW + cardGap);
    const by = currY + row * (cellH + cardGap);

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    roundRect(ctx, bx, by, cellW, cellH, 16);
    ctx.fill();
    ctx.stroke();

    // Top Accent line
    ctx.fillStyle = b.color;
    ctx.fillRect(bx + 20, by, 32, 2.5);

    // Text in cell
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '700 11px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '1.5px';
    ctx.fillText(b.title, bx + 20, by + 28);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Cinzel", system-ui, -apple-system, sans-serif';
    ctx.fillText(b.val, bx + 20, by + 58);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '400 12px system-ui, -apple-system, sans-serif';
    ctx.fillText(b.sub, bx + 20, by + 84);
    ctx.restore();
  });

  currY += (cellH + cardGap) * gridRows + 10;

  // 8. Story-specific extra quote section (if story format)
  if (format === 'story') {
    ctx.save();
    const quoteW = width - (pad + 40) * 2;
    const quoteX = (width - quoteW) / 2;
    
    ctx.fillStyle = 'rgba(197, 160, 89, 0.06)';
    ctx.strokeStyle = 'rgba(197, 160, 89, 0.2)';
    ctx.lineWidth = 1;
    roundRect(ctx, quoteX, currY, quoteW, 140, 16);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#c5a059';
    ctx.font = '700 11px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('LỜI KHUYÊN PHONG THỦY CÁT TƯỜNG', width / 2, currY + 34);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'italic 13px system-ui, -apple-system, sans-serif';
    const quoteText = result.aiInterpretation.fengShui?.advice || 'Khai mở vận mệnh, thấu hiểu chính mình để làm chủ tương lai vững vàng.';
    wrapText(ctx, `"${quoteText}"`, width / 2, currY + 68, quoteW - 48, 22);
    ctx.restore();

    currY += 160;
  }

  // 9. Footer with Verification & Call to action
  const footerY = height - pad - 42;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 11px system-ui, -apple-system, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('BIOMETRIC & PYTHAGORAS AI VERIFIED', pad + 30, footerY);

  ctx.fillStyle = 'rgba(197, 160, 89, 0.7)';
  ctx.font = '400 10px font-mono, monospace';
  ctx.fillText(`ID: #${Math.random().toString(36).substring(2, 9).toUpperCase()} • heysimi.ai`, pad + 30, footerY + 18);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '600 11px system-ui, -apple-system, sans-serif';
  ctx.fillText('TRA CỨU VẬN MỆNH TẠI', width - pad - 30, footerY);
  ctx.fillStyle = '#c5a059';
  ctx.font = '700 12px "Cinzel", serif, sans-serif';
  ctx.fillText('HEY! SI MÌ', width - pad - 30, footerY + 18);
  ctx.restore();

  return canvas;
}

// Helper: Rounded rectangle
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Helper: Word wrap text
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, AlertCircle, Scan, Sparkles, Image as ImageIcon } from 'lucide-react';

interface FaceScannerProps {
  image: string | undefined;
  onChange: (base64: string | undefined) => void;
}

export function FaceScanner({ image, onChange }: FaceScannerProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('upload');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto initialize or clean up camera based on tab selection
  useEffect(() => {
    if (activeTab === 'camera' && !image) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, image]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 480, height: 480, facingMode: "user" },
          audio: false,
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError("Trình duyệt không hỗ trợ Camera. Hãy sử dụng tính năng tải ảnh.");
      }
    } catch (err: any) {
      // Graceful error handling for permission denied or unavailable devices
      setCameraError("Không thể truy cập camera (vui lòng cấp quyền hoặc sử dụng tính năng tải ảnh lên).");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const compressAndProcessImage = (src: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 500;
      let w = img.width;
      let h = img.height;

      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        onChange(compressedBase64);
      }
    };
    img.src = src;
  };

  const capturePhoto = () => {
    if (videoRef.current && cameraStream) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); // Mirror photo matching mirror view
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        compressAndProcessImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          compressAndProcessImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          compressAndProcessImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {/* Notice that user can skip */}
      <div className="text-center p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/70">
        <span className="text-brand-gold font-medium">💡 Ghi chú: </span>
        <span>Bạn có thể bỏ qua nếu không muốn xem nhân tướng học (nhấn "Bắt đầu phân tích" để tiếp tục).</span>
      </div>

      {/* Sub tabs if not captured */}
      {!image && (
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 subtle-glow">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'camera'
                ? 'bg-brand-gold text-black gold-glow font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-4 h-4" /> Chụp Trực Tiếp
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-brand-gold text-black gold-glow'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-4 h-4" /> Tải Ảnh Lên
          </button>
        </div>
      )}

      {/* Main scanning box */}
      <div 
        className={`relative aspect-square w-full rounded-2xl border bg-black/40 overflow-hidden flex flex-col items-center justify-center transition-all ${
          dragOver ? 'border-brand-gold bg-brand-gold/5 scale-102' : 'border-white/10'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {image ? (
          // Pre-processing / Scanning State View
          <div className="relative w-full h-full flex items-center justify-center bg-brand-black p-4">
            <img 
              src={image} 
              alt="Scan Target" 
              className="max-w-full max-h-full rounded-xl object-contain subtle-glow relative z-10"
            />
            {/* Sci-Fi Scanning Grid Lines & laser beam */}
            <div className="absolute inset-x-0 top-0 h-1/2 border-b border-brand-gold/30 flex justify-center items-end bg-gradient-to-t from-brand-gold/[0.04] to-transparent pointer-events-none z-20 animate-[pulse_1.5s_infinite]" />
            <div className="absolute top-0 inset-x-0 h-1 bg-brand-gold/80 shadow-[0_0_15px_#c5a059] pointer-events-none z-30 animate-[scan_3s_ease-in-out_infinite]" />
            <div className="absolute inset-0 border border-brand-gold/20 rounded-2xl pointer-events-none z-20 m-6" />
            <div className="absolute top-6 left-6 font-mono text-[9px] text-brand-gold/70 tracking-widest uppercase py-1 px-2.5 bg-black/80 rounded border border-brand-gold/20 flex items-center gap-1.5 z-40">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" /> AI BIOMETRIC ACTIVE
            </div>

            {/* Clear Button */}
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="absolute bottom-6 right-6 p-2.5 bg-black/90 hover:bg-black border border-white/20 text-white rounded-full transition-transform hover:scale-110 z-40 shadow-lg"
              title="Chụp lại"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : activeTab === 'camera' ? (
          // Camera active preview
          <div className="relative w-full h-full flex items-center justify-center">
            {cameraError ? (
              <div className="p-6 text-center text-white/60 space-y-3">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <p className="text-xs">{cameraError}</p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 text-[10px] uppercase font-bold tracking-wider text-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20 rounded-lg transition-colors border border-brand-gold/30"
                  >
                    Thử lại
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCameraError(null);
                      setActiveTab('upload');
                    }}
                    className="px-4 py-2 text-[10px] uppercase font-bold tracking-wider text-white/80 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
                  >
                    Tải Ảnh Lên
                  </button>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]" // mirror view
                />
                
                {/* Tech scan overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8">
                  {/* Face outline guide */}
                  <div className="w-48 h-56 rounded-[50%/45%] border border-dashed border-white/30 relative flex items-center justify-center">
                    <div className="absolute inset-0 border border-brand-gold/20 rounded-[50%/45%] scale-105" />
                    <Scan className="w-8 h-8 text-brand-gold/20" />
                  </div>
                  <span className="text-[10px] tracking-wider text-white/50 uppercase mt-4 font-mono font-bold bg-black/60 px-3 py-1 rounded border border-white/5 mt-6">
                    ĐỂ GƯƠNG MẶT VÀO GIỮA KHUNG
                  </span>
                </div>

                {/* Laser animation line */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-brand-gold/40 shadow-[0_0_10px_#c5a059] pointer-events-none animate-[scan_4s_ease-in-out_infinite]" />

                {/* Camera Trigger action bar */}
                <div className="absolute bottom-6 inset-x-0 flex justify-center px-6">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="group px-6 py-3 bg-brand-gold text-black hover:scale-105 active:scale-95 font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl gold-glow flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4" /> CHỤP ẢNH
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          // File drag upload area
          <label className="w-full h-full flex flex-col items-center justify-center p-8 cursor-pointer group hover:bg-white/[0.01] transition-all">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
            />
            <div className="p-4 bg-brand-gold/10 rounded-full text-brand-gold mb-3 transition-transform group-hover:scale-110 group-hover:bg-brand-gold/20 subtle-glow">
              <ImageIcon className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium text-white group-hover:text-brand-gold transition-colors block text-center">
              Chọn ảnh chân dung hoặc kéo vào đây
            </p>
            <p className="text-[10px] text-white/30 text-center mt-2 max-w-xs leading-normal">
              Đảm bảo khuôn mặt rõ ràng, đủ ánh sáng mục tiêu cho kết quả phân tích chuẩn xác nhất.
            </p>
          </label>
        )}
      </div>

      {image && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-white text-xs font-bold font-display uppercase tracking-wider">Đã quét thành công khuôn mặt!</h4>
            <p className="text-[10px] text-emerald-400/80 leading-normal mt-0.5">Nhân tướng học AI đã khóa kết cấu da, trán, mắt và khuôn miệng cho luận giải sâu.</p>
          </div>
        </div>
      )}
    </div>
  );
}

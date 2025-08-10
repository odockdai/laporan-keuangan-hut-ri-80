'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TwibbonGeneratorProps {
  twibbonSrc: string;
}

const TwibbonGenerator = ({ twibbonSrc }: TwibbonGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const twibbonImageRef = useRef<HTMLImageElement | null>(null);
  const userImageRef = useRef<HTMLImageElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [lastPinchDist, setLastPinchDist] = useState(0);
  const [isUserImageReady, setIsUserImageReady] = useState(false);

  useEffect(() => {
    const drawCanvas = () => {
      const canvas = canvasRef.current;
      const twibbonImg = twibbonImageRef.current;
      const userImg = userImageRef.current;
      if (!canvas || !twibbonImg) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (userImg && isUserImageReady) {
        ctx.drawImage(userImg, position.x, position.y, userImg.width * scale, userImg.height * scale);
      }
      ctx.drawImage(twibbonImg, 0, 0, canvas.width, canvas.height);
    };
    drawCanvas();
  }, [position, scale, isUserImageReady, twibbonSrc]);

  useEffect(() => {
    const img = new Image();
    img.src = twibbonSrc;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      twibbonImageRef.current = img;
      setPosition(prev => ({...prev}));
    };
  }, [twibbonSrc]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUserImageReady(false);
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          userImageRef.current = img;
          const canvas = canvasRef.current;
          if (!canvas) return;
          const newScale = Math.min(canvas.width / img.width, canvas.height / img.height);
          setScale(newScale);
          setPosition({ x: (canvas.width - img.width * newScale) / 2, y: (canvas.height - img.height * newScale) / 2 });
          setIsUserImageReady(true);
        };
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !userImageRef.current) return;
    const link = document.createElement('a');
    link.download = 'twibbon-hut-ri-80.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // --- Mouse Handlers ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!userImageRef.current) return;
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !userImageRef.current) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!userImageRef.current) return;
    e.preventDefault();
    const scaleAmount = e.deltaY > 0 ? -0.05 : 0.05;
    setScale((prev) => Math.max(0.1, prev + scaleAmount));
  };

  // --- Touch Handlers ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!userImageRef.current) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      setLastPinchDist(dist);
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!userImageRef.current) return;
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - lastMousePos.x;
      const dy = e.touches[0].clientY - lastMousePos.y;
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const scaleAmount = (dist - lastPinchDist) / 1000; // Adjust sensitivity
      setScale((prev) => Math.max(0.1, prev + scaleAmount));
      setLastPinchDist(dist);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative w-full max-w-lg rounded-lg cursor-grab active:cursor-grabbing touch-none overflow-hidden bg-[linear-gradient(45deg,theme(colors.gray.200)_25%,transparent_25%),linear-gradient(-45deg,theme(colors.gray.200)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,theme(colors.gray.200)_75%),linear-gradient(-45deg,transparent_75%,theme(colors.gray.200)_75%)] dark:bg-[linear-gradient(45deg,theme(colors.slate.700)_25%,transparent_25%),linear-gradient(-45deg,theme(colors.slate.700)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,theme(colors.slate.700)_75%),linear-gradient(-45deg,transparent_75%,theme(colors.slate.700)_75%)] bg-[length:20px_20px]"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        <canvas ref={canvasRef} width={1080} height={1080} className="w-full h-auto" />
      </div>

      <div className="mt-6 w-full max-w-lg flex flex-col sm:flex-row gap-4">
        <label className="flex-1 w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-center rounded-lg shadow-sm cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          Pilih Foto
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
        <button
          onClick={handleDownload}
          disabled={!isUserImageReady}
          className="flex-1 w-full px-4 py-3 bg-blue-600 text-white rounded-lg shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Unduh Twibbon
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Tips: Geser untuk memposisikan, cubit untuk zoom.</p>
    </div>
  );
};

export default TwibbonGenerator;

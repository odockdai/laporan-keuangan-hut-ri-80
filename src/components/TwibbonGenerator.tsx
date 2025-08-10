'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

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

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const twibbonImg = twibbonImageRef.current;
    const userImg = userImageRef.current;
    if (!canvas || !twibbonImg) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (userImg) {
      ctx.drawImage(
        userImg,
        position.x,
        position.y,
        userImg.width * scale,
        userImg.height * scale
      );
    }

    ctx.drawImage(twibbonImg, 0, 0, canvas.width, canvas.height);
  }, [position, scale]); // Dependency array untuk useCallback

  useEffect(() => {
    const img = new Image();
    img.src = twibbonSrc;
    img.onload = () => {
      twibbonImageRef.current = img;
      drawCanvas();
    };
  }, [twibbonSrc, drawCanvas]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setPosition({
            x: (canvas.width - img.width * newScale) / 2,
            y: (canvas.height - img.height * newScale) / 2,
          });
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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!userImageRef.current) return;
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !userImageRef.current) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    setPosition({ x: position.x + dx, y: position.y + dy });
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!userImageRef.current) return;
    e.preventDefault();
    const scaleAmount = e.deltaY > 0 ? -0.05 : 0.05;
    const newScale = Math.max(0.1, scale + scaleAmount);
    setScale(newScale);
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative w-full max-w-lg rounded-lg cursor-pointer overflow-hidden bg-[linear-gradient(45deg,theme(colors.gray.200)_25%,transparent_25%),linear-gradient(-45deg,theme(colors.gray.200)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,theme(colors.gray.200)_75%),linear-gradient(-45deg,transparent_75%,theme(colors.gray.200)_75%)] dark:bg-[linear-gradient(45deg,theme(colors.slate.700)_25%,transparent_25%),linear-gradient(-45deg,theme(colors.slate.700)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,theme(colors.slate.700)_75%),linear-gradient(-45deg,transparent_75%,theme(colors.slate.700)_75%)] bg-[length:20px_20px]"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
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
          disabled={!userImageRef.current}
          className="flex-1 w-full px-4 py-3 bg-blue-600 text-white rounded-lg shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Unduh Twibbon
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Tips: Gunakan scroll mouse untuk zoom dan drag untuk menggeser foto.</p>
    </div>
  );
};

export default TwibbonGenerator;

import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  currentImage: string | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, currentImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelect(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`relative group h-80 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
        ${isDragging ? 'border-yellow-400 bg-yellow-400/5' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}
      `}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      
      {currentImage ? (
        <div className="relative h-full w-full bg-slate-950/50 flex items-center justify-center">
          <img 
            src={currentImage} 
            alt="Source" 
            className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-medium shadow-xl">Change Image</span>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-200">Upload Source Image</h3>
          <p className="text-sm text-slate-400 mt-1">Drag and drop or click to browse</p>
        </div>
      )}
    </div>
  );
};

'use client';

import { ChangeEvent } from 'react';
import Image from 'next/image';

interface PhotoUploadProps {
  photos: File[];
  onPhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove: (index: number) => void;
  label?: string;
  className?: string;
}

export function PhotoUpload({
  photos,
  onPhotoChange,
  onPhotoRemove,
  label = 'Фотографии',
  className = '',
}: PhotoUploadProps) {
  const photoPreviews = photos.map((file) => URL.createObjectURL(file));

  return (
    <div className={className}>
      <label className="block mb-2 text-sm font-medium text-[#666F8D]">
        {label}
      </label>
      <div className="flex gap-3 flex-wrap">
        {photoPreviews.map((url, index) => (
          <div
            key={index}
            className="w-24 h-24 border border-[#BAC0CC] border-dashed relative rounded-lg overflow-hidden"
          >
            <Image
              src={url}
              alt="preview"
              className="object-cover w-full h-full"
              fill
              sizes="96px"
              onLoad={() => URL.revokeObjectURL(url)}
            />
            <button
              type="button"
              onClick={() => onPhotoRemove(index)}
              className="absolute -top-2 -right-2 w-6 h-6 text-white bg-red-500 rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        ))}
        <label className="w-24 h-24 border border-[#BAC0CC] border-dashed rounded-lg flex items-center justify-center text-3xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          +
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onPhotoChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}

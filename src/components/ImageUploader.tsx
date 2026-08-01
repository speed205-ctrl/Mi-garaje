'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImageUrls: string[] = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const url = await uploadToCloudinary(file);
        newImageUrls.push(url);
      } catch (err) {
        console.error('Error al subir imagen:', err);
      }
    }

    onChange(newImageUrls);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Fotos del Producto (Cloudinary)
      </label>

      {/* Grid of uploaded images */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((url, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
            <Image src={url} alt={`Preview ${idx}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition"
              title="Eliminar imagen"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 cursor-pointer transition p-2 text-center text-slate-500">
          <Upload className="w-6 h-6 text-slate-400 mb-1" />
          <span className="text-xs font-medium text-slate-600">
            {uploading ? 'Subiendo...' : 'Agregar foto'}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}

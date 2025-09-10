import React, { useRef, useState } from 'react';

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  preview?: string;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onFileSelect,
  accept = 'image/*',
  preview,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setLoading(true);
      setTimeout(() => {
        onFileSelect(file);
        setLoading(false);
      }, 500);
    } else {
      onFileSelect(null);
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {
      setLoading(true);
      setTimeout(() => {
        onFileSelect(file);
        setLoading(false);
      }, 500);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${error ? 'border-red-500' : ''}`}
        onClick={() => !loading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="loading-spinner mr-2"></div>
            <span className="text-gray-500">Uploading...</span>
          </div>
        ) : preview ? (
          <img src={preview} alt="Preview" className="max-w-32 max-h-32 mx-auto mb-2" />
        ) : (
          <div className="text-gray-500">
            <p>Click to upload or drag and drop</p>
            <p className="text-sm">PNG, JPG up to 10MB</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
"use client";
import { useState, useEffect } from "react";

export default function ImageUpload({ onImageUpload, currentImage }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || "");

  // Update preview when currentImage changes (for form clearing)
  useEffect(() => {
    setPreview(currentImage || "");
  }, [currentImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large (max 5MB)");
      return;
    }

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("access_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Upload failed");
      }
      
      const data = await response.json();
      onImageUpload(data.image_url);
    } catch (error) {
      alert("Upload failed: " + error.message);
      setPreview(currentImage || "");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview("");
    onImageUpload("");
  };

  return (
    <div className="space-y-3">
      {preview && (
        <div className="relative">
          <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
            disabled={uploading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Uploading...</span>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        Upload an image for your event (max 5MB, JPG/PNG/GIF)
      </p>
    </div>
  );
}

import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      setIsUploading(true);
      setUploadError(null);
      const imageRef = ref(storage, `product-images/${image.name}`);
      try {
        console.log('Starting upload...');
        await uploadBytes(imageRef, image);
        console.log('Upload successful, getting download URL...');
        const imageUrl = await getDownloadURL(imageRef);
        console.log('Download URL obtained:', imageUrl);
        onImageUploaded(imageUrl);
      } catch (error) {
        console.error("Error uploading image: ", error);
        setUploadError("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-start">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="p-2 border rounded flex-grow"
        disabled={isUploading}
      />
      {isUploading && <span className="ml-2 mt-2 text-blue-500">Uploading...</span>}
      {uploadError && <span className="ml-2 mt-2 text-red-500">{uploadError}</span>}
    </div>
  );
};

export default ImageUpload;
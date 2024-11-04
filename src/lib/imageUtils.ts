import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const uploadLocalImage = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Please upload an image file.');
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    throw new Error('File size too large. Maximum size is 5MB.');
  }

  try {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const storageRef = ref(storage, `product-images/${fileName}`);
    
    console.log('Starting upload for:', fileName);
    const snapshot = await uploadBytes(storageRef, file);
    
    if (!snapshot) {
      throw new Error('Upload failed - no snapshot returned');
    }
    
    console.log('Upload completed, getting download URL');
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    if (!downloadURL) {
      throw new Error('Failed to get download URL');
    }
    
    console.log('Upload successful, URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    if (error instanceof Error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
    throw new Error('Failed to upload image. Please try again.');
  }
};
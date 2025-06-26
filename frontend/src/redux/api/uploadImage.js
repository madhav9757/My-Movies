import api from './axiosInstance.js';
import { UPLOAD_URL } from '../constants.js';

export const uploadImage = async (file) => {
  console.log('Uploading image:', file);
  const { data } = await api.post(UPLOAD_URL, file, {
    headers: {
      'Content-Type': 'multipart/form-data', // ✅ Required so browser handles it correctly
    },
    withCredentials: true, // ✅ Required to send cookies (for auth)
  });

  console.log('Image uploaded successfully:', data);
  return data;
};

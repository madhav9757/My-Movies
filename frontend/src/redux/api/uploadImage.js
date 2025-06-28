import api from './axiosInstance.js';
import { UPLOAD_URL} from '../constants.js';

export const uploadImage = async (file, oldCloudinaryId) => {
  console.log('Uploading image:', file);

  if (oldCloudinaryId) {
    try {
      await api.post(`${UPLOAD_URL}/delete`, { publicId : oldCloudinaryId });
    } catch (err) {
      console.error('Failed to delete old image:', err?.response?.data?.message || err.message);
    }
  } else {
    console.log('No old image to delete');
  }

  // Step 2: Upload new image
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post(UPLOAD_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });

  return {
    image: data.image,
    publicId: data.publicId, // make sure your backend returns this
  };
};

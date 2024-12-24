import uploadService from '@/services/modules/upload/uploadService';
import { useCallback } from 'react';

const useImageUploader = () => {
  //! State

  //!Function
  const uploadImage = useCallback((image?: File | string) => {
    const bodyUpload = new FormData();
    image && bodyUpload.append('file', image);
    return uploadService.uploadSingle(bodyUpload);
  }, []);

  const uploadImages = useCallback((images?: FileList | string[]) => {
    const bodyUpload = new FormData();
    if (images) {
      if (images instanceof FileList) {
        // Chuyển FileList thành một mảng
        Array.from(images).forEach((image) => bodyUpload.append('files', image));
      } else {
        // Duyệt qua mảng string[]
        images.forEach((image) => bodyUpload.append('files', image));
      }
    }
    return uploadService.uploadMultiple(bodyUpload);
  }, []);
  //!Render
  return { uploadImage,uploadImages };
};

export default useImageUploader;

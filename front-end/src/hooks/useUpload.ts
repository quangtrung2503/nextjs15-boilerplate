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

  //!Render
  return { uploadImage };
};

export default useImageUploader;

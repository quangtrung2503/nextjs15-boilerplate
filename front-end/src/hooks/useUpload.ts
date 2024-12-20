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

  const uploadImages = useCallback((images?: FileList | string[])=>{
    const bodyUpload = new FormData();
    images && images.map((image=> bodyUpload.append('file',image)));
    return uploadService.uploadMultiple(bodyUpload);
  },[])
  //!Render
  return { uploadImage,uploadImages };
};

export default useImageUploader;

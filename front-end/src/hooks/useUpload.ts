import uploadServices from 'modules/upload/upload.services';
import { useCallback } from 'react';

const useImageUploader = () => {
  //! State

  //!Function
  const uploadImage = useCallback((image?: File | string) => {
    const bodyUpload = new FormData();
    image && bodyUpload.append('file', image);
    return uploadServices.uploadFile(bodyUpload);
  }, []);

  //!Render
  return { uploadImage };
};

export default useImageUploader;

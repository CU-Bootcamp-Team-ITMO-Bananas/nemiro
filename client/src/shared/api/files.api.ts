import { axiosInstance } from '../instance/axios.instance';

export interface UploadResponse {
  success: boolean;
  data: {
    fileName: string;
    url: string;
  };
  message: string;
}

export const uploadFile = async (
  file: File
): Promise<UploadResponse | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axiosInstance.post<UploadResponse>(
      'files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error('File upload error:', err);
    return null;
  }
};

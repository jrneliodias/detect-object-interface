import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8080";

export const apiService = axios.create({
  baseURL: BASE_URL,
});

interface ApiData {
  video_path: string;
  message: string;
  processed_video_path: string;
}

// interface ApiResponse {
//   message: string;
//   status: number;
//   data: ApiData;
// }

export type Detection = {
  id: number;
  frame_number: number;
  box_left: number;
  box_top: number;
  box_width: number;
  box_height: number;
  class_name: string;
  confidence: number;
  user_input_id: number;
};

type onVideoProcessed = (inProcess: boolean) => void;

// type OnVideoProcessedFunction = (inProcess: boolean) => void;

export const uploadFileService = async (formData: FormData): Promise<ApiData> => {
  try {
    const uploadResponse = await apiService.post("/upload", formData);
    return uploadResponse.data;
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error);
    throw error;
  }
};

export const uploadFile = async (onVideoProcessed: onVideoProcessed, videoFile: File | null, confidence: number, iou: number) => {
  try {
    onVideoProcessed(true);
    if (!videoFile || !confidence || !iou) return;
    const formData = new FormData();
    formData.append("video", videoFile);

    const uploadResponse = await uploadFileService(formData);

    toast.success(uploadResponse.message);
    const video_path = uploadResponse.video_path;
    return video_path;
  } catch (error) {
    onVideoProcessed(false);
    if (axios.isAxiosError(error) && error.response) {
      toast.error("Error uploading file:" + error.response.data.message);
    } else {
      toast.error("Error uploading file: " + (error as Error).message);
    }
    throw error;
  }
};

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

interface ApiResponse {
  message: string;
  status: number;
  data: ApiData;
}

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

export const detectObjectsService = async (videoPath: string, iou: string, confidence: string): Promise<ApiResponse> => {
  return await apiService.post("/detect", { video_path: videoPath, iou, confidence });
};

export const getVideoService = async (videoFileName: string): Promise<ApiResponse> => {
  return await apiService.get(`/result/${videoFileName}`, {
    headers: {
      Accept: "video/mp4;charset=UTF-8",
    },
    responseType: "blob",
  });
};

export const uploadFile = async (videoFile: File | null, confidence: number, iou: number) => {
  try {
    if (!videoFile || !confidence || !iou) return;
    const formData = new FormData();
    formData.append("video", videoFile);

    const uploadResponse = await uploadFileService(formData);

    toast.success(uploadResponse.message);
    const video_path = uploadResponse.video_path;
    return video_path;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      toast.error("Error uploading file:" + error.response.data.message);
    } else {
      toast.error("Error uploading file: " + (error as Error).message);
    }
    throw error;
  }
};

export const detectObjects = async (video_path: string, confidence: number, iou: number) => {
  try {
    if (!confidence || !iou) return;

    const processVideoResponse = await detectObjectsService(video_path, iou.toString(), confidence.toString());
    const processed_video_path = processVideoResponse.data.processed_video_path;

    toast.success(processVideoResponse.data.message);
    return processed_video_path;
  } catch (error) {
    toast.error("Error processing the video:" + error);
    throw error;
  }
};

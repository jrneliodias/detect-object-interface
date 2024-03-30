import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8080";

export const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
interface DetectionApiResponse {
  message: string;
  status: number;
  data: Detection[];
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

export const uploadFileService = async (formData: FormData): Promise<ApiResponse> => {
  return await apiService.post("/upload", formData);
};

export const getDetectionsService = async (): Promise<DetectionApiResponse> => {
  return await apiService.get("/detections");
};

export const detectObjectsService = async (videoPath: string, iou: string, confidence: string): Promise<ApiResponse> => {
  return await apiService.post("/detect", { video_path: videoPath, iou, confidence });
};

export const getVideoService = async (videoPath: string): Promise<ApiResponse> => {
  return await apiService.get(`/get-video/${videoPath}`, {
    headers: {
      Accept: "video/mp4;charset=UTF-8",
    },
    responseType: "blob",
  });
};

type OnLastDetectionsFunction = (detections: Detection[] | null) => void;

type OnVideoProcessedFunction = (inProcess: boolean) => void;

export const getLastDetections = async (onLastDetections: OnLastDetectionsFunction, onVideoProcessed: OnVideoProcessedFunction) => {
  try {
    const getLastDetectionsResponse = await getDetectionsService();

    toast.success("success in get the detections");

    onVideoProcessed(false);
    if (getLastDetectionsResponse.data) {
      onLastDetections(getLastDetectionsResponse.data);
    }
  } catch (error) {
    onVideoProcessed(false);

    if (axios.isAxiosError(error) && error.response) {
      toast.error("Error in get the last detections:" + error.response.data.message);
    } else {
      toast.error("Error in get the last detections: " + (error as Error).message);
    }
    throw error;
  }
};

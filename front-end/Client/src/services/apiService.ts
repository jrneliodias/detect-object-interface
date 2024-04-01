import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8080";

export const apiService = axios.create({
  baseURL: BASE_URL,
});

interface ApiData {
  video_path: string;
  message: string;
  processed_video_name: string;
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

export const uploadFileService = async (formData: FormData): Promise<ApiData> => {
  try {
    const uploadResponse = await apiService.post("/upload", formData);
    return uploadResponse.data;
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error);
    throw error;
  }
};

export const detectObjectsService = async (iou: string, confidence: string): Promise<ApiResponse> => {
  return await apiService.post("/detect", { iou, confidence });
};

export const getVideoService = async (videoFileName: string): Promise<ApiResponse> => {
  return await apiService.get(`/result/${videoFileName}`, {
    headers: {
      Accept: "video/mp4;charset=UTF-8",
    },
    responseType: "blob",
  });
};

export const getDetectionsService = async (): Promise<DetectionApiResponse> => {
  return await apiService.get("/detections");
};

export const uploadFile = async (videoFile: File | null, confidence: number, iou: number) => {
  if (!videoFile || !confidence || !iou) return;
  const formData = new FormData();
  formData.append("video", videoFile);

  const uploadResponse = await uploadFileService(formData);

  toast.success(uploadResponse.message);
  const video_path = uploadResponse.video_path;
  return video_path;
};

export const detectObjects = async (confidence: number, iou: number) => {
  if (!confidence || !iou) return;

  const processVideoResponse = await detectObjectsService(iou.toString(), confidence.toString());
  const processed_video_path = processVideoResponse.data.processed_video_name;

  toast.success(processVideoResponse.data.message);
  return processed_video_path;
};

export const getProcessedVideo = async (processed_video_name: string) => {
  const getProcessVideoResponse = await getVideoService(processed_video_name);

  if (!(getProcessVideoResponse.data instanceof Blob)) {
    throw new Error("Response data is not of type Blob");
  }

  const videoBlobURL = URL.createObjectURL(new Blob([getProcessVideoResponse.data], { type: "video/mp4" }));

  return videoBlobURL;
};

export const getLastDetections = async (): Promise<Detection[]> => {
  const getLastDetectionsResponse = await getDetectionsService();
  const lastDetections = getLastDetectionsResponse.data;

  toast.success("success in get the detections");

  return lastDetections;
};

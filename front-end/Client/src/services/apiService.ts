import axios from "axios";

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

export const uploadFileService = async (formData: FormData): Promise<ApiData> => {
  try {
    const uploadResponse = await apiService.post("/upload", formData);
    return uploadResponse.data;
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error);
    throw error;
  }
};

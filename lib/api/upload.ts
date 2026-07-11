import api from "@/lib/axios";

interface UploadResponse {
  url: string;
  publicId: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Large media can take well past the default request timeout on slower connections.
const UPLOAD_TIMEOUT_MS = 5 * 60 * 1000;

export async function uploadImage(file: File, folder = "general"): Promise<UploadResponse> {
  try {
    const form = new FormData();
    form.append("image", file);
    const { data } = await api.post<{ success: boolean; data: UploadResponse }>(
      `/upload/image?folder=${encodeURIComponent(folder)}`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: UPLOAD_TIMEOUT_MS,
      }
    );
    return data.data;
  } catch (error) {
    const apiError = error as ApiError;
    const errorMessage = apiError?.response?.data?.message || "Failed to upload image. Please try again.";
    throw { response: { data: { message: errorMessage } } };
  }
}

export async function uploadFile(file: File, folder = "documents"): Promise<UploadResponse> {
  try {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<{ success: boolean; data: UploadResponse }>(
      `/upload/file?folder=${encodeURIComponent(folder)}`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: UPLOAD_TIMEOUT_MS,
      }
    );
    return data.data;
  } catch (error) {
    const apiError = error as ApiError;
    const errorMessage = apiError?.response?.data?.message || "Failed to upload file. Please try again.";
    throw { response: { data: { message: errorMessage } } };
  }
}

export async function deleteImage(publicId: string) {
  const { data } = await api.delete("/upload/image", { data: { publicId } });
  return data;
}

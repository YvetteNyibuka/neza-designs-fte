import api from "@/lib/axios";

export async function uploadImage(file: File, folder = "general"): Promise<{ url: string; publicId: string }> {
  const form = new FormData();
  form.append("image", file);
  const { data } = await api.post(`/upload/image?folder=${encodeURIComponent(folder)}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function deleteImage(publicId: string) {
  const { data } = await api.delete("/upload/image", { data: { publicId } });
  return data;
}

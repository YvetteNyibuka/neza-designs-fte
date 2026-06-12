import api from "@/lib/axios";
import type { Career } from "@/types";

export interface CareersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  department?: string;
}

export async function getCareers(params?: CareersQuery) {
  const { data } = await api.get("/careers", { params });
  return data;
}

export async function getAdminCareers(params?: CareersQuery) {
  const { data } = await api.get("/careers/admin/all", { params });
  return data;
}

export async function getCareer(slug: string) {
  const { data } = await api.get(`/careers/${slug}`);
  return data;
}

export async function createCareer(payload: Partial<Career>) {
  const { data } = await api.post("/careers", payload);
  return data;
}

export async function updateCareer(slug: string, payload: Partial<Career>) {
  const { data } = await api.patch(`/careers/${slug}`, payload);
  return data;
}

export async function deleteCareer(slug: string) {
  const { data } = await api.delete(`/careers/${slug}`);
  return data;
}

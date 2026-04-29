import api from "@/lib/axios";
import type { Career } from "@/types";
import { dummyCareers } from "@/lib/data";

export interface CareersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  department?: string;
}

export async function getCareers(params?: CareersQuery) {
  try {
    const { data } = await api.get("/careers", { params });
    const apiItems = data?.data?.data;
    if (Array.isArray(apiItems) && apiItems.length > 0) {
      return data;
    }
    // use local seeds when API has no records yet
    let items = dummyCareers;
    if (params?.status) items = items.filter((c) => c.status === params.status);
    if (params?.department) items = items.filter((c) => c.department === params.department);
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter((c) => c.title.toLowerCase().includes(q) || c.department.toLowerCase().includes(q));
    }
    return { data: { data: items, total: items.length } };
  } catch {
    // fallback to local seed data when backend is unreachable
    let items = dummyCareers;
    if (params?.status) items = items.filter((c) => c.status === params.status);
    if (params?.department) items = items.filter((c) => c.department === params.department);
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter((c) => c.title.toLowerCase().includes(q) || c.department.toLowerCase().includes(q));
    }
    return { data: { data: items, total: items.length } };
  }
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

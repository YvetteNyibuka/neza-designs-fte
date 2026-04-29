import api from "@/lib/axios";
import type { Publication } from "@/types";
import { dummyPublications } from "@/lib/data";

export interface PublicationsQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

export async function getPublications(params?: PublicationsQuery) {
  try {
    const { data } = await api.get("/publications", { params });
    const apiItems = data?.data?.data;
    if (Array.isArray(apiItems) && apiItems.length > 0) {
      return data;
    }
    // use local seeds when API has no records yet
    let items = dummyPublications;
    if (params?.type) items = items.filter((p) => p.type === params.type);
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter((p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q));
    }
    return { data: { data: items, total: items.length } };
  } catch {
    // fallback to local seed data when backend is unreachable
    let items = dummyPublications;
    if (params?.type) items = items.filter((p) => p.type === params.type);
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter((p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q));
    }
    return { data: { data: items, total: items.length } };
  }
}

export async function getPublication(slug: string) {
  const { data } = await api.get(`/publications/${slug}`);
  return data;
}

export async function createPublication(payload: Partial<Publication>) {
  const { data } = await api.post("/publications", payload);
  return data;
}

export async function updatePublication(slug: string, payload: Partial<Publication>) {
  const { data } = await api.patch(`/publications/${slug}`, payload);
  return data;
}

export async function deletePublication(slug: string) {
  const { data } = await api.delete(`/publications/${slug}`);
  return data;
}

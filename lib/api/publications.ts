import api from "@/lib/axios";
import type { Publication } from "@/types";

export interface PublicationsQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

export async function getPublications(params?: PublicationsQuery) {
  const { data } = await api.get("/publications", { params });
  return data;
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

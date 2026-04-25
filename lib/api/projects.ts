import api from "@/lib/axios";
import type { Project } from "@/types";

export interface ProjectsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

export async function getProjects(params?: ProjectsQuery) {
  const { data } = await api.get("/projects", { params });
  return data;
}

export async function getProject(slug: string) {
  const { data } = await api.get(`/projects/${slug}`);
  return data;
}

export async function createProject(payload: Partial<Project>) {
  const { data } = await api.post("/projects", payload);
  return data;
}

export async function updateProject(slug: string, payload: Partial<Project>) {
  const { data } = await api.patch(`/projects/${slug}`, payload);
  return data;
}

export async function deleteProject(slug: string) {
  const { data } = await api.delete(`/projects/${slug}`);
  return data;
}

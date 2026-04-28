import api from "@/lib/axios";
import type { JobApplication, ApplicationStatus } from "@/types";

export interface ApplicationsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export async function applyForCareer(
  careerSlug: string,
  payload: {
    applicantName: string;
    email: string;
    phone?: string;
    linkedIn?: string;
    resumeUrl?: string;
    coverLetter?: string;
  }
) {
  const { data } = await api.post(`/careers/${careerSlug}/apply`, payload);
  return data;
}

export async function getCareerApplications(careerSlug: string, params?: ApplicationsQuery) {
  const { data } = await api.get(`/careers/${careerSlug}/applications`, { params });
  return data;
}

export async function getAllApplications(params?: ApplicationsQuery) {
  const { data } = await api.get("/careers/applications/all", { params });
  return data;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  note?: string
) {
  const { data } = await api.patch(`/careers/applications/${id}`, { status, note });
  return data;
}

export async function deleteApplication(id: string) {
  const { data } = await api.delete(`/careers/applications/${id}`);
  return data;
}

export type { JobApplication };

import api from "@/lib/axios";

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export type InquiryStatus = "new" | "replied" | "closed";

export interface ContactReplyInput {
  subject: string;
  message: string;
}

export async function submitContact(payload: ContactInput) {
  const { data } = await api.post("/contact", payload);
  return data;
}

export async function getContacts(params?: { page?: number; limit?: number; isRead?: boolean; status?: InquiryStatus; search?: string }) {
  const { data } = await api.get("/contact", { params });
  return data;
}

export async function markContactRead(id: string, isRead = true) {
  const { data } = await api.patch(`/contact/${id}/read`, { isRead });
  return data;
}

export async function deleteContact(id: string) {
  const { data } = await api.delete(`/contact/${id}`);
  return data;
}

export async function updateContactStatus(id: string, status: InquiryStatus) {
  const { data } = await api.patch(`/contact/${id}/status`, { status });
  return data;
}

export async function replyContact(id: string, payload: ContactReplyInput) {
  const { data } = await api.post(`/contact/${id}/reply`, payload);
  return data;
}

import api from "@/lib/axios";
import type { Service } from "@/types";

export async function getServices() {
  const { data } = await api.get("/services");
  return data;
}

export async function getService(id: string) {
  const { data } = await api.get(`/services/${id}`);
  return data;
}

export async function createService(payload: Partial<Service>) {
  const { data } = await api.post("/services", payload);
  return data;
}

export async function updateService(id: string, payload: Partial<Service>) {
  const { data } = await api.patch(`/services/${id}`, payload);
  return data;
}

export async function deleteService(id: string) {
  const { data } = await api.delete(`/services/${id}`);
  return data;
}

export async function reorderServices(ids: string[]) {
  const { data } = await api.patch("/services/reorder", { ids });
  return data;
}

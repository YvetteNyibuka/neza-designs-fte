import api from "@/lib/axios";
import type { TeamMember } from "@/types";

export async function getTeam() {
  const { data } = await api.get("/team");
  return data;
}

export async function getTeamMember(id: string) {
  const { data } = await api.get(`/team/${id}`);
  return data;
}

export async function createTeamMember(payload: Partial<TeamMember>) {
  const { data } = await api.post("/team", payload);
  return data;
}

export async function updateTeamMember(id: string, payload: Partial<TeamMember>) {
  const { data } = await api.patch(`/team/${id}`, payload);
  return data;
}

export async function deleteTeamMember(id: string) {
  const { data } = await api.delete(`/team/${id}`);
  return data;
}

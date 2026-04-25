import api from "@/lib/axios";

export interface LoginInput {
  email: string;
  password: string;
}

export interface OtpInput {
  email: string;
  otp: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface SecuritySettings {
  twoFAEnabled: boolean;
  loginAlerts: boolean;
}

export interface AuthSession {
  id: string;
  device: string;
  location: string;
  userAgent: string;
  ipAddress: string;
  lastActiveAt: string;
  createdAt: string;
  current: boolean;
}

export async function login(input: LoginInput) {
  const { data } = await api.post("/auth/login", input);
  return data;
}

export async function verifyOtp(input: OtpInput) {
  const { data } = await api.post("/auth/verify-otp", input);
  return data;
}

export async function refreshToken() {
  const { data } = await api.post("/auth/refresh");
  return data;
}

export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function forgotPassword(input: ForgotPasswordInput) {
  const { data } = await api.post("/auth/forgot-password", input);
  return data;
}

export async function resetPassword(input: ResetPasswordInput) {
  const { data } = await api.post("/auth/reset-password", input);
  return data;
}

export async function changePassword(input: { currentPassword: string; newPassword: string; confirmPassword: string }) {
  const { data } = await api.post("/auth/change-password", input);
  return data;
}

export async function getSecuritySettings() {
  const { data } = await api.get("/auth/security-settings");
  return data;
}

export async function updateSecuritySettings(input: Partial<SecuritySettings>) {
  const { data } = await api.patch("/auth/security-settings", input);
  return data;
}

export async function getSessions() {
  const { data } = await api.get("/auth/sessions");
  return data;
}

export async function revokeSession(id: string) {
  const { data } = await api.delete(`/auth/sessions/${id}`);
  return data;
}

export async function revokeOtherSessions() {
  const { data } = await api.post("/auth/sessions/revoke-others");
  return data;
}

export async function deleteMyAccount() {
  const { data } = await api.delete("/auth/me");
  return data;
}

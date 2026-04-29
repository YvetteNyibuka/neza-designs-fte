import api from "@/lib/axios";

export async function subscribeNewsletter(email: string): Promise<{ message: string }> {
  const res = await api.post("/newsletter/subscribe", { email });
  return { message: res.data.message };
}

export async function getNewsletterSubscribers(): Promise<{ _id: string; email: string; subscribedAt: string }[]> {
  const res = await api.get("/newsletter");
  return res.data.data ?? [];
}

export async function broadcastNewsletter(subject: string, html: string): Promise<{ message: string; sent: number }> {
  const res = await api.post("/newsletter/broadcast", { subject, html });
  return { message: res.data.message, sent: res.data.data?.sent ?? 0 };
}

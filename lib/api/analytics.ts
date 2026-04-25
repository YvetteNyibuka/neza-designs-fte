import api from "@/lib/axios";

export interface AnalyticsOverview {
  totals: {
    projects: number;
    ongoingProjects: number;
    completedProjects: number;
    posts: number;
    services: number;
    teamMembers: number;
    inquiries: number;
    unreadInquiries: number;
    admins: number;
  };
  monthlyInquiries: Array<{ month: string; count: number }>;
  recentInquiries: Array<{ id: string; name: string; subject: string; email: string; createdAt: string }>;
  topCategories: Array<{ category: string; count: number }>;
}

export async function getAnalyticsOverview() {
  const { data } = await api.get("/analytics/overview");
  return data;
}

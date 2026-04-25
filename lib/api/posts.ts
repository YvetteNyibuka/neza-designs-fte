import api from "@/lib/axios";
import type { BlogPost } from "@/types";

export interface PostsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export async function getPosts(params?: PostsQuery) {
  const { data } = await api.get("/posts", { params });
  return data;
}

export async function getPost(slug: string) {
  const { data } = await api.get(`/posts/${slug}`);
  return data;
}

export async function createPost(payload: Partial<BlogPost>) {
  const { data } = await api.post("/posts", payload);
  return data;
}

export async function updatePost(slug: string, payload: Partial<BlogPost>) {
  const { data } = await api.patch(`/posts/${slug}`, payload);
  return data;
}

export async function deletePost(slug: string) {
  const { data } = await api.delete(`/posts/${slug}`);
  return data;
}

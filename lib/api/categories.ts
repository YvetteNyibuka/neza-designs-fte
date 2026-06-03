import api from "@/lib/axios";
import type { CategoryItem } from "@/types";

export type CategoryScope = "careers" | "blogs" | "projects";

export async function getCategories(scope: CategoryScope): Promise<{ data: { data: CategoryItem[]; total: number } }> {
  const { data } = await api.get(`/categories/${scope}`, { params: { limit: 200 } });
  const items = data?.data?.data ?? [];
  return { data: { data: items, total: data?.data?.total ?? items.length } };
}

export async function createCategory(scope: CategoryScope, payload: Partial<CategoryItem>) {
  const { data } = await api.post(`/categories/${scope}`, payload);
  return data;
}

export async function updateCategory(scope: CategoryScope, categoryId: string, payload: Partial<CategoryItem>) {
  const { data } = await api.put(`/categories/${scope}/${categoryId}`, payload);
  return data;
}

export async function deleteCategory(scope: CategoryScope, categoryId: string) {
  const { data } = await api.delete(`/categories/${scope}/${categoryId}`);
  return data;
}

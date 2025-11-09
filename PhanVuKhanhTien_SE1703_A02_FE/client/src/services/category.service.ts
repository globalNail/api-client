import axiosInstance from '../config/axios';
import type { Category, CategoryFormData, ApiResponse } from '../types';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await axiosInstance.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (category: CategoryFormData): Promise<Category> => {
    const response = await axiosInstance.post<Category>('/categories', category);
    return response.data;
  },

  update: async (id: number, category: CategoryFormData): Promise<Category> => {
    const response = await axiosInstance.put<Category>(`/categories/${id}`, category);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },

  search: async (searchTerm: string): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>('/categories/search', {
      params: { q: searchTerm },
    });
    return response.data;
  },

  canDelete: async (id: number): Promise<boolean> => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(`/categories/${id}/can-delete`);
    return response.data.data;
  },
};

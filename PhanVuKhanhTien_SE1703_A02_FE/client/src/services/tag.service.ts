import axiosInstance from '../config/axios';
import type { Tag } from '../types';

export const tagService = {
  getAll: async (): Promise<Tag[]> => {
    const response = await axiosInstance.get<Tag[]>('/tags');
    return response.data;
  },

  getById: async (id: number): Promise<Tag> => {
    const response = await axiosInstance.get<Tag>(`/tags/${id}`);
    return response.data;
  },

  create: async (tag: Partial<Tag>): Promise<Tag> => {
    const response = await axiosInstance.post<Tag>('/tags', tag);
    return response.data;
  },

  update: async (id: number, tag: Partial<Tag>): Promise<Tag> => {
    const response = await axiosInstance.put<Tag>(`/tags/${id}`, tag);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/tags/${id}`);
  },
};

import axiosInstance from '../config/axios';
import type { SystemAccount, AccountFormData, ApiResponse } from '../types';

export const accountService = {
  getAll: async (): Promise<SystemAccount[]> => {
    const response = await axiosInstance.get<SystemAccount[]>('/accounts');
    return response.data;
  },

  getById: async (id: number): Promise<SystemAccount> => {
    const response = await axiosInstance.get<SystemAccount>(`/accounts/${id}`);
    return response.data;
  },

  create: async (account: AccountFormData): Promise<SystemAccount> => {
    const response = await axiosInstance.post<SystemAccount>('/accounts', account);
    return response.data;
  },

  update: async (id: number, account: AccountFormData): Promise<SystemAccount> => {
    const response = await axiosInstance.put<SystemAccount>(`/accounts/${id}`, account);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/accounts/${id}`);
  },

  search: async (searchTerm: string): Promise<SystemAccount[]> => {
    const response = await axiosInstance.get<SystemAccount[]>('/accounts/search', {
      params: { q: searchTerm },
    });
    return response.data;
  },

  canDelete: async (id: number): Promise<boolean> => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(`/accounts/${id}/can-delete`);
    return response.data.data;
  },
};

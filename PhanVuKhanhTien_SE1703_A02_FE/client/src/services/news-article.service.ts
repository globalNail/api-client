import axiosInstance from '../config/axios';
import type { NewsArticle, NewsArticleFormData } from '../types';

export const newsArticleService = {
  getAll: async (): Promise<NewsArticle[]> => {
    const response = await axiosInstance.get<NewsArticle[]>('/news-articles');
    return response.data;
  },

  getById: async (id: number): Promise<NewsArticle> => {
    const response = await axiosInstance.get<NewsArticle>(`/news-articles/${id}`);
    return response.data;
  },

  getByCreator: async (creatorId: number): Promise<NewsArticle[]> => {
    const response = await axiosInstance.get<NewsArticle[]>(`/news-articles/creator/${creatorId}`);
    return response.data;
  },

  create: async (article: NewsArticleFormData): Promise<NewsArticle> => {
    const response = await axiosInstance.post<NewsArticle>('/news-articles', article);
    return response.data;
  },

  update: async (id: number, article: NewsArticleFormData): Promise<NewsArticle> => {
    const response = await axiosInstance.put<NewsArticle>(`/news-articles/${id}`, article);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/news-articles/${id}`);
  },

  search: async (searchTerm: string): Promise<NewsArticle[]> => {
    const response = await axiosInstance.get<NewsArticle[]>('/news-articles/search', {
      params: { q: searchTerm },
    });
    return response.data;
  },

  getReport: async (startDate: string, endDate: string): Promise<any> => {
    const response = await axiosInstance.get('/news-articles/report', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

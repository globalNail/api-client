import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// User/Account types
export interface SystemAccount {
  accountId: number;
  accountname: string;
  accountEmail: string;
  accountRole: number;
  accountPassword?: string;
  newsArticles?: NewsArticle[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  accountId: number;
  accountname: string;
  accountEmail: string;
  accountRole: number;
}

// Category types
export interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  parentCategoryId: number;
  isActive: number;
  newsArticles?: NewsArticle[];
}

// Tag types
export interface Tag {
  tagId: number;
  tagName: string;
  note?: string;
  newsTags?: NewsTag[];
}

// NewsTag types
export interface NewsTag {
  newsArticleId: number;
  tagId: number;
  newsArticle?: NewsArticle;
  tag?: Tag;
}

// NewsArticle types
export interface NewsArticle {
  newsArticleId: number;
  newsTitle: string;
  headline: string;
  newsContent: string;
  newsSource: string;
  newsStatus: number;
  categoryId: number;
  category?: Category;
  createdDate: string | Date;
  createdById: number;
  creator?: SystemAccount;
  modifiedDate: string | Date;
  updatedById: number;
  modifier?: SystemAccount;
  newsTags?: NewsTag[];
  tags?: Tag[];
}

// Form types
export interface AccountFormData {
  accountId?: number;
  accountname: string;
  accountEmail: string;
  accountRole: number;
  accountPassword?: string;
}

export interface CategoryFormData {
  categoryId?: number;
  categoryName: string;
  categoryDescription: string;
  parentCategoryId: number;
  isActive: number;
}

export interface NewsArticleFormData {
  newsArticleId?: number;
  newsTitle: string;
  headline: string;
  newsContent: string;
  newsSource: string;
  newsStatus: number;
  categoryId: number;
  tagIds?: number[];
}

// Report types
export interface ReportFilter {
  startDate: string;
  endDate: string;
}

export interface ReportStatistic {
  date: string;
  totalArticles: number;
  totalByCategory: { categoryName: string; count: number }[];
  totalByStaff: { staffName: string; count: number }[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

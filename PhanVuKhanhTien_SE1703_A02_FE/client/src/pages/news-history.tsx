import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@heroui/table';
import { newsArticleService } from '../services/news-article.service';
import { authService } from '../services/auth.service';
import type { NewsArticle } from '../types';

export default function NewsHistory() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMyArticles();
  }, []);

  const loadMyArticles = async () => {
    setIsLoading(true);
    try {
      const user = authService.getCurrentUser();
      if (user) {
        const data = await newsArticleService.getByCreator(user.accountId);
        setArticles(data);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My News History</h1>

      <Table aria-label="My news articles">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Created Date</TableColumn>
          <TableColumn>Modified Date</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody emptyContent="You haven't created any articles yet" isLoading={isLoading}>
          {articles.map((article) => (
            <TableRow key={article.newsArticleId}>
              <TableCell>{article.newsArticleId}</TableCell>
              <TableCell>{article.newsTitle}</TableCell>
              <TableCell>{article.category?.categoryName || '-'}</TableCell>
              <TableCell>{formatDate(article.createdDate)}</TableCell>
              <TableCell>{formatDate(article.modifiedDate)}</TableCell>
              <TableCell>{article.newsStatus ? 'Active' : 'Inactive'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

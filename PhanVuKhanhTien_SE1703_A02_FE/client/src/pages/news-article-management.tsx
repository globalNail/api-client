import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@heroui/table';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { newsArticleService } from '../services/news-article.service';
import { categoryService } from '../services/category.service';
import { tagService } from '../services/tag.service';
import type { NewsArticle, NewsArticleFormData, Category, Tag } from '../types';

export default function NewsArticleManagement() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [formData, setFormData] = useState<NewsArticleFormData>({
    newsTitle: '',
    headline: '',
    newsContent: '',
    newsSource: '',
    newsStatus: 1,
    categoryId: 0,
    tagIds: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [articlesData, categoriesData, tagsData] = await Promise.all([
        newsArticleService.getAll(),
        categoryService.getAll(),
        tagService.getAll(),
      ]);
      setArticles(articlesData);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadData();
      return;
    }
    setIsLoading(true);
    try {
      const data = await newsArticleService.search(searchTerm);
      setArticles(data);
    } catch (error) {
      console.error('Error searching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedArticle(null);
    setFormData({
      newsTitle: '',
      headline: '',
      newsContent: '',
      newsSource: '',
      newsStatus: 1,
      categoryId: categories[0]?.categoryId || 0,
      tagIds: [],
    });
    setIsFormOpen(true);
  };

  const handleEdit = (article: NewsArticle) => {
    setSelectedArticle(article);
    setFormData({
      newsArticleId: article.newsArticleId,
      newsTitle: article.newsTitle,
      headline: article.headline,
      newsContent: article.newsContent,
      newsSource: article.newsSource,
      newsStatus: article.newsStatus,
      categoryId: article.categoryId,
      tagIds: article.newsTags?.map(nt => nt.tagId) || [],
    });
    setIsFormOpen(true);
  };

  const handleDelete = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedArticle) return;

    setIsLoading(true);
    try {
      await newsArticleService.delete(selectedArticle.newsArticleId);
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      console.error('Error deleting article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedArticle) {
        await newsArticleService.update(selectedArticle.newsArticleId, formData);
      } else {
        await newsArticleService.create(formData);
      }
      setIsFormOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tagId: number) => {
    const currentTags = formData.tagIds || [];
    if (currentTags.includes(tagId)) {
      setFormData({
        ...formData,
        tagIds: currentTags.filter(id => id !== tagId),
      });
    } else {
      setFormData({
        ...formData,
        tagIds: [...currentTags, tagId],
      });
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">News Article Management</h1>
        <Button color="primary" onPress={handleCreate}>
          Create Article
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="max-w-md"
        />
        <Button onPress={handleSearch}>Search</Button>
        <Button onPress={loadData} variant="flat">
          Clear
        </Button>
      </div>

      {/* Table */}
      <Table aria-label="News articles table">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Created Date</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No articles found" isLoading={isLoading}>
          {articles.map((article) => (
            <TableRow key={article.newsArticleId}>
              <TableCell>{article.newsArticleId}</TableCell>
              <TableCell>{article.newsTitle}</TableCell>
              <TableCell>{article.category?.categoryName || '-'}</TableCell>
              <TableCell>{formatDate(article.createdDate)}</TableCell>
              <TableCell>{article.newsStatus ? 'Active' : 'Inactive'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" onPress={() => handleEdit(article)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => handleDelete(article)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} size="2xl">
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {selectedArticle ? 'Edit Article' : 'Create Article'}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Title"
                  value={formData.newsTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, newsTitle: e.target.value })
                  }
                  required
                />
                <Input
                  label="Headline"
                  value={formData.headline}
                  onChange={(e) =>
                    setFormData({ ...formData, headline: e.target.value })
                  }
                  required
                />
                <div>
                  <label className="block mb-2 text-sm">Content</label>
                  <textarea
                    value={formData.newsContent}
                    onChange={(e) =>
                      setFormData({ ...formData, newsContent: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    rows={6}
                    required
                    aria-label="Article Content"
                  />
                </div>
                <Input
                  label="Source"
                  value={formData.newsSource}
                  onChange={(e) =>
                    setFormData({ ...formData, newsSource: e.target.value })
                  }
                  required
                />
                <div>
                  <label className="block mb-2 text-sm">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: Number(e.target.value) })
                    }
                    className="px-3 py-2 border rounded w-full"
                    required
                    aria-label="Article Category"
                  >
                    <option value={0}>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm">Status</label>
                  <select
                    value={formData.newsStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, newsStatus: Number(e.target.value) })
                    }
                    className="px-3 py-2 border rounded w-full"
                    required
                    aria-label="Article Status"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <label key={tag.tagId} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(formData.tagIds || []).includes(tag.tagId)}
                          onChange={() => handleTagToggle(tag.tagId)}
                        />
                        <span>{tag.tagName}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                {selectedArticle ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete article "{selectedArticle?.newsTitle}"?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={confirmDelete}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

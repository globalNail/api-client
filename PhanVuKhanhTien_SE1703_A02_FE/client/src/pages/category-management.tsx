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
import { categoryService } from '../services/category.service';
import type { Category, CategoryFormData } from '../types';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: '',
    categoryDescription: '',
    parentCategoryId: 0,
    isActive: 1,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadCategories();
      return;
    }
    setIsLoading(true);
    try {
      const data = await categoryService.search(searchTerm);
      setCategories(data);
    } catch (error) {
      console.error('Error searching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setFormData({
      categoryName: '',
      categoryDescription: '',
      parentCategoryId: 0,
      isActive: 1,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription,
      parentCategoryId: category.parentCategoryId,
      isActive: category.isActive,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteError('');
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    setIsLoading(true);
    try {
      const canDelete = await categoryService.canDelete(selectedCategory.categoryId);
      
      if (!canDelete) {
        setDeleteError(
          'Cannot delete this category. It is being used by news articles and must remain in the system.'
        );
        setIsLoading(false);
        return;
      }

      await categoryService.delete(selectedCategory.categoryId);
      setIsDeleteOpen(false);
      loadCategories();
    } catch (error: any) {
      setDeleteError(error.response?.data?.message || 'Error deleting category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedCategory) {
        await categoryService.update(selectedCategory.categoryId, formData);
      } else {
        await categoryService.create(formData);
      }
      setIsFormOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Button color="primary" onPress={handleCreate}>
          Create Category
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="max-w-md"
        />
        <Button onPress={handleSearch}>Search</Button>
        <Button onPress={loadCategories} variant="flat">
          Clear
        </Button>
      </div>

      {/* Table */}
      <Table aria-label="Categories table">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No categories found" isLoading={isLoading}>
          {categories.map((category) => (
            <TableRow key={category.categoryId}>
              <TableCell>{category.categoryId}</TableCell>
              <TableCell>{category.categoryName}</TableCell>
              <TableCell>{category.categoryDescription}</TableCell>
              <TableCell>{category.isActive ? 'Active' : 'Inactive'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" onPress={() => handleEdit(category)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => handleDelete(category)}
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
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} size="lg">
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {selectedCategory ? 'Edit Category' : 'Create Category'}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Category Name"
                  value={formData.categoryName}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryName: e.target.value })
                  }
                  required
                />
                <div>
                  <label className="block mb-2 text-sm">Description</label>
                  <textarea
                    value={formData.categoryDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    rows={4}
                    required
                    aria-label="Category Description"
                    placeholder="Enter category description"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Status</label>
                  <select
                    value={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: Number(e.target.value) })
                    }
                    className="px-3 py-2 border rounded w-full"
                    required
                    aria-label="Category Status"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
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
                {selectedCategory ? 'Update' : 'Create'}
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
            {deleteError ? (
              <p className="text-danger">{deleteError}</p>
            ) : (
              <p>
                Are you sure you want to delete category "{selectedCategory?.categoryName}"?
                <span className="block mt-2 text-sm text-warning">
                  Note: Categories used by news articles cannot be deleted.
                </span>
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            {!deleteError && (
              <Button
                color="danger"
                onPress={confirmDelete}
                isLoading={isLoading}
              >
                Delete
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

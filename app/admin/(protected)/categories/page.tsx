'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { productService } from '@/services/products';
import { adminApi } from '@/services/admin';
import { Category } from '@/types';
import { Button, Modal, Input, Spinner, Table, TableHead, TableBody, TableHeader, TableCell } from '@/components/ui';
import { useToast } from '@/context/ToastContext';

interface CategoryFormData {
  name_en: string;
  name_yo: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!editingCategory;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>();

  const nameEn = watch('name_en');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!isEditMode && nameEn) {
      const slug = nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [nameEn, isEditMode, setValue]);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    reset({ name_en: '', name_yo: '', slug: '' });
    setError('');
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    reset({
      name_en: category.name_en,
      name_yo: category.name_yo,
      slug: category.slug,
    });
    setError('');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? Products in this category may be affected.')) return;

    try {
      await adminApi.deleteCategory(id);
      loadCategories();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to delete category');
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    setSubmitting(true);
    setError('');
    try {
      if (isEditMode) {
        await adminApi.updateCategory(editingCategory!.id, data);
      } else {
        await adminApi.createCategory(data);
      }
      loadCategories();
      handleModalClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner size="lg" className="text-brand mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-brand-dark">Categories</h1>
        <Button onClick={handleAdd}>Add Category</Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-border">
          <p className="text-gray-400">No categories yet. Add one to get started.</p>
        </div>
      ) : (
        <>
        {/* Desktop table */}
        <div className="hidden md:block">
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Name (English)</TableHeader>
                <TableHeader>Name (Yoruba)</TableHeader>
                <TableHeader>Slug</TableHeader>
                <TableHeader>Products</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <TableCell className="font-semibold text-brand-dark">{category.name_en}</TableCell>
                  <TableCell className="text-gray-500">{category.name_yo}</TableCell>
                  <TableCell className="text-gray-400 text-xs font-mono">{category.slug}</TableCell>
                  <TableCell className="text-gray-500">
                    {(category as any)._count?.products ?? '-'}
                  </TableCell>
                  <TableCell className="space-x-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-brand hover:text-brand-light font-medium text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-danger hover:text-red-700 font-medium text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </TableCell>
                </tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-dark">{category.name_en}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-brand hover:text-brand-light font-medium text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-danger hover:text-red-700 font-medium text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{category.name_yo}</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                <span className="text-xs text-gray-400 font-mono">{category.slug}</span>
                <span className="text-xs text-gray-500">
                  {(category as any)._count?.products ?? '-'} products
                </span>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={isEditMode ? 'Edit Category' : 'Add Category'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={handleModalClose}>Cancel</Button>
            <Button type="submit" form="category-form" loading={submitting}>
              {isEditMode ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        }
      >
        <form id="category-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Category Name (English)"
            error={errors.name_en?.message}
            {...register('name_en', { required: 'English name is required' })}
          />
          <Input
            label="Oruko Eka (Yoruba)"
            error={errors.name_yo?.message}
            {...register('name_yo', { required: 'Yoruba name is required' })}
          />
          <Input
            label="Slug"
            error={errors.slug?.message}
            placeholder="auto-generated-from-name"
            {...register('slug', { required: 'Slug is required' })}
          />
        </form>
      </Modal>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Product, Category, ProductFormData } from '@/types';
import { productService } from '@/services/products';
import { adminApi } from '@/services/admin';
import { Modal, Input, Textarea, Select, Button } from '@/components/ui';

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSaved: () => void;
}

const AddEditProductModal: React.FC<AddEditProductModalProps> = ({ isOpen, onClose, product, onSaved }) => {
  const isEditMode = !!product;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>();

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          name_en: product.name_en,
          name_yo: product.name_yo,
          description_en: product.description_en,
          description_yo: product.description_yo,
          price: product.price,
          price_usd: product.price_usd || undefined,
          price_gbp: product.price_gbp || undefined,
          price_eur: product.price_eur || undefined,
          weight_kg: product.weight_kg || undefined,
          category_id: product.category_id,
          stock_quantity: product.stock_quantity,
          is_active: product.is_active,
        });
        setImagePreviews(product.image_urls || []);
      } else {
        reset({
          name_en: '',
          name_yo: '',
          description_en: '',
          description_yo: '',
          price: 0,
          category_id: '',
          stock_quantity: 0,
          is_active: true,
        });
        setImagePreviews([]);
      }
      setImageFiles([]);
      setError('');
    }
  }, [isOpen, product, reset]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await productService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    const existingCount = product?.image_urls?.length || 0;
    if (index >= existingCount) {
      setImageFiles((prev) => prev.filter((_, i) => i !== (index - existingCount)));
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    setError('');
    try {
      let savedProductId: string;

      if (isEditMode) {
        const response = await adminApi.updateProduct(product!.id, data);
        savedProductId = response.data.id || product!.id;
      } else {
        const response = await adminApi.createProduct(data);
        savedProductId = response.data.id;
      }

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append('images', file));
        await adminApi.uploadProductImages(savedProductId, formData);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Product' : 'Add Product'}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="product-form" loading={submitting}>
            {isEditMode ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      }
    >
      <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name (English)"
            error={errors.name_en?.message}
            {...register('name_en', { required: 'English name is required' })}
          />
          <Input
            label="Oruko Oja (Yoruba)"
            error={errors.name_yo?.message}
            {...register('name_yo', { required: 'Yoruba name is required' })}
          />
        </div>

        <Textarea
          label="Description (English)"
          rows={3}
          error={errors.description_en?.message}
          {...register('description_en', { required: 'English description is required' })}
        />
        <Textarea
          label="Apejuwe (Yoruba)"
          rows={3}
          error={errors.description_yo?.message}
          {...register('description_yo', { required: 'Yoruba description is required' })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Price (NGN) *"
            type="number"
            step="0.01"
            error={errors.price?.message}
            {...register('price', {
              required: 'Naira price is required',
              valueAsNumber: true,
              min: { value: 0.01, message: 'Price must be positive' },
            })}
          />
          <Input
            label="Price (USD)"
            type="number"
            step="0.01"
            {...register('price_usd', { valueAsNumber: true })}
          />
          <Input
            label="Price (GBP)"
            type="number"
            step="0.01"
            {...register('price_gbp', { valueAsNumber: true })}
          />
          <Input
            label="Price (EUR)"
            type="number"
            step="0.01"
            {...register('price_eur', { valueAsNumber: true })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Stock Quantity *"
            type="number"
            error={errors.stock_quantity?.message}
            {...register('stock_quantity', {
              required: 'Stock is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Cannot be negative' },
            })}
          />
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            {...register('weight_kg', { valueAsNumber: true })}
          />
          <Select
            label="Category *"
            placeholder={loadingCategories ? 'Loading...' : 'Select category...'}
            error={errors.category_id?.message}
            options={categories.map((c) => ({ value: c.id, label: c.name_en }))}
            {...register('category_id', { required: 'Category is required' })}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            {...register('is_active')}
            className="h-4 w-4 text-brand rounded border-border focus:ring-brand-light"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-brand-dark">
            Active (visible to customers)
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-dark uppercase tracking-label mb-2">Product Images</label>
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {imagePreviews.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="h-20 w-20 object-cover rounded-lg border border-border" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-danger text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand file:font-medium hover:file:bg-brand-100 file:transition-colors file:cursor-pointer"
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddEditProductModal;

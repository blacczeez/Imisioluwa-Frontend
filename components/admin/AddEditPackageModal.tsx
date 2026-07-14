'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Package, PackageFormData, Product } from '@/types';
import { productService } from '@/services/products';
import { adminApi } from '@/services/admin';
import { Modal, Input, Textarea, Button, Select } from '@/components/ui';
import { getProductName } from '@/utils/helpers';

interface AddEditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: Package | null;
  onSaved: () => void;
}

interface VariantOption {
  id: string;
  label: string;
}

const AddEditPackageModal: React.FC<AddEditPackageModalProps> = ({ isOpen, onClose, pkg, onSaved }) => {
  const isEditMode = !!pkg;
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState<Array<{ variant_id: string; quantity: number }>>([
    { variant_id: '', quantity: 1 },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PackageFormData>();

  const variantOptions: VariantOption[] = useMemo(() => {
    return products.flatMap((product) =>
      (product.variants || []).map((variant) => ({
        id: variant.id,
        label: `${getProductName(product, 'en')} — ${variant.weight_ml}ml (stock: ${variant.stock_quantity})`,
      }))
    );
  }, [products]);

  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (pkg) {
      reset({
        name_en: pkg.name_en,
        name_yo: pkg.name_yo,
        problem_statement_en: pkg.problem_statement_en,
        description_en: pkg.description_en,
        description_yo: pkg.description_yo,
        price: pkg.price,
        slug: pkg.slug,
        is_active: pkg.is_active,
        is_promoted: pkg.is_promoted,
      });
      setItems(
        pkg.items.length > 0
          ? pkg.items.map((item) => ({ variant_id: item.variant_id, quantity: item.quantity }))
          : [{ variant_id: '', quantity: 1 }]
      );
      setImagePreview(pkg.image_url || '');
    } else {
      reset({
        name_en: '',
        name_yo: '',
        problem_statement_en: '',
        description_en: '',
        description_yo: '',
        price: 0,
        slug: '',
        is_active: true,
        is_promoted: false,
      });
      setItems([{ variant_id: '', quantity: 1 }]);
      setImagePreview('');
    }
    setImageFile(null);
    setError('');
  }, [isOpen, pkg, reset]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await productService.getAll({
        limit: 200,
        include_out_of_stock: true,
        include_inactive: true,
      });
      setProducts(response.products);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const updateItem = (index: number, field: 'variant_id' | 'quantity', value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, { variant_id: '', quantity: 1 }]);
  };

  const removeItemRow = (index: number) => {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const onSubmit = async (data: PackageFormData) => {
    const validItems = items.filter((item) => item.variant_id && item.quantity > 0);
    if (validItems.length === 0) {
      setError('Add at least one product variant to the package');
      return;
    }

    const duplicate = validItems.some(
      (item, index) => validItems.findIndex((entry) => entry.variant_id === item.variant_id) !== index
    );
    if (duplicate) {
      setError('Each variant can only appear once in a package');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        ...data,
        price: Number(data.price),
        items: validItems,
      };

      let saved: Package;
      if (isEditMode && pkg) {
        const response = await adminApi.updatePackage(pkg.id, payload);
        saved = response.data;
      } else {
        const response = await adminApi.createPackage(payload);
        saved = response.data;
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await adminApi.uploadPackageImage(saved.id, formData);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save package');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Package' : 'Add Package'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && <div className="p-3 bg-red-50 text-danger text-sm rounded-lg">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Name (English)" {...register('name_en', { required: 'Required' })} error={errors.name_en?.message} />
          <Input label="Name (Yoruba)" {...register('name_yo', { required: 'Required' })} error={errors.name_yo?.message} />
        </div>

        <Textarea
          label="Problem Statement (English)"
          rows={3}
          {...register('problem_statement_en', { required: 'Required' })}
          error={errors.problem_statement_en?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea label="Description (English)" rows={4} {...register('description_en', { required: 'Required' })} error={errors.description_en?.message} />
          <Textarea label="Description (Yoruba)" rows={4} {...register('description_yo', { required: 'Required' })} error={errors.description_yo?.message} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Fixed Price (NGN)"
            type="number"
            step="0.01"
            {...register('price', { required: 'Required', min: { value: 1, message: 'Must be greater than 0' } })}
            error={errors.price?.message}
          />
          <Input label="Slug (optional)" {...register('slug')} placeholder="auto-generated-from-name" />
          <div className="space-y-3 pt-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('is_active')} className="rounded" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('is_promoted')} className="rounded" />
              Promoted on homepage
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-dark uppercase tracking-label mb-2">Package Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm" />
          {imagePreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="Preview" className="mt-3 h-32 w-32 object-cover rounded-lg border border-border" />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-label">Included Variants</h3>
            <Button type="button" variant="secondary" onClick={addItemRow}>Add Item</Button>
          </div>

          {loadingProducts ? (
            <p className="text-sm text-gray-500">Loading products...</p>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <Select
                    label="Variant"
                    value={item.variant_id}
                    onChange={(event) => updateItem(index, 'variant_id', event.target.value)}
                    options={[
                      { value: '', label: 'Select variant' },
                      ...variantOptions.map((option) => ({ value: option.id, label: option.label })),
                    ]}
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateItem(index, 'quantity', Number(event.target.value))}
                  />
                  <Button type="button" variant="secondary" onClick={() => removeItemRow(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : isEditMode ? 'Update Package' : 'Create Package'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditPackageModal;

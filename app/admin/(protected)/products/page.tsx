'use client';

import React, { useEffect, useState } from 'react';
import { productService } from '@/services/products';
import { adminApi } from '@/services/admin';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/helpers';
import { Button, Badge, Spinner, ConfirmModal, Table, TableHead, TableBody, TableHeader, TableCell } from '@/components/ui';
import AddEditProductModal from '@/components/admin/AddEditProductModal';
import { useToast } from '@/context/ToastContext';

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaved = () => {
    loadProducts();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await adminApi.deleteProduct(deletingId);
      setDeletingId(null);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      await adminApi.updateProduct(product.id, { is_active: !product.is_active });
      loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('Failed to update product');
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
        <h1 className="font-serif text-3xl text-brand-dark">Products</h1>
        <Button onClick={handleAdd}>Add Product</Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Product</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Stock</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <tr key={product.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0 bg-brand-50 rounded-lg overflow-hidden">
                      {product.image_urls[0] ? (
                        <img
                          src={product.image_urls[0]}
                          alt={product.name_en}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 flex items-center justify-center text-gray-300 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-brand-dark">{product.name_en}</div>
                      <div className="text-xs text-gray-400">{product.name_yo}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-brand-dark">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell>
                  <span
                    className={`font-medium text-sm ${
                      product.stock_quantity === 0
                        ? 'text-danger'
                        : product.stock_quantity <= 10
                        ? 'text-warning'
                        : 'text-success'
                    }`}
                  >
                    {product.stock_quantity}
                  </span>
                </TableCell>
                <TableCell>
                  <button onClick={() => toggleActive(product)}>
                    <Badge color={product.is_active ? 'green' : 'gray'}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell className="space-x-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-brand hover:text-brand-light font-medium text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingId(product.id)}
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
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 flex-shrink-0 bg-brand-50 rounded-lg overflow-hidden">
                {product.image_urls[0] ? (
                  <img
                    src={product.image_urls[0]}
                    alt={product.name_en}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 flex items-center justify-center text-gray-300 text-xs">
                    No img
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-brand-dark">{product.name_en}</div>
                <div className="text-xs text-gray-400">{product.name_yo}</div>
                <div className="text-sm font-medium text-brand-dark mt-1">
                  {formatCurrency(product.price)}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-3">
                <span
                  className={`font-medium text-sm ${
                    product.stock_quantity === 0
                      ? 'text-danger'
                      : product.stock_quantity <= 10
                      ? 'text-warning'
                      : 'text-success'
                  }`}
                >
                  Stock: {product.stock_quantity}
                </span>
                <button onClick={() => toggleActive(product)}>
                  <Badge color={product.is_active ? 'green' : 'gray'}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-brand hover:text-brand-light font-medium text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeletingId(product.id)}
                  className="text-danger hover:text-red-700 font-medium text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddEditProductModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        product={editingProduct}
        onSaved={handleSaved}
      />

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { packageService } from '@/services/packages';
import { adminApi } from '@/services/admin';
import { Package } from '@/types';
import { formatCurrency } from '@/utils/helpers';
import { Button, Badge, Spinner, ConfirmModal, Table, TableHead, TableBody, TableHeader, TableCell } from '@/components/ui';
import AddEditPackageModal from '@/components/admin/AddEditPackageModal';
import { useToast } from '@/context/ToastContext';

export default function AdminPackagesPage() {
  const { showToast } = useToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await packageService.getAll({ include_inactive: true });
      setPackages(data);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPackage(null);
    setModalOpen(true);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await adminApi.deletePackage(deletingId);
      setDeletingId(null);
      loadPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      showToast('Failed to delete package');
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (pkg: Package) => {
    try {
      await adminApi.updatePackage(pkg.id, { is_active: !pkg.is_active });
      loadPackages();
    } catch (error) {
      console.error('Error updating package:', error);
      showToast('Failed to update package');
    }
  };

  const togglePromoted = async (pkg: Package) => {
    try {
      await adminApi.updatePackage(pkg.id, { is_promoted: !pkg.is_promoted });
      loadPackages();
    } catch (error) {
      console.error('Error updating package:', error);
      showToast('Failed to update package');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl text-brand-dark">Packages</h1>
          <p className="text-sm text-gray-500 mt-1">Curated problem-solution bundles with fixed pricing</p>
        </div>
        <Button onClick={handleAdd}>Add Package</Button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Spinner size="lg" className="text-brand mx-auto" />
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border">
          <p className="text-gray-500">No packages yet. Create your first package bundle.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHead>
              <TableHeader>Name</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Items</TableHeader>
              <TableHeader>Stock</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableHead>
            <TableBody>
              {packages.map((pkg) => (
                <tr key={pkg.id} className="border-t border-border">
                  <TableCell>
                    <div>
                      <p className="font-medium text-brand-dark">{pkg.name_en}</p>
                      <p className="text-xs text-gray-400">/{pkg.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(pkg.price, 'NGN')}</TableCell>
                  <TableCell>{pkg.items.length}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge color={pkg.in_stock ? 'green' : 'red'}>
                        {pkg.in_stock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                      {!pkg.in_stock && pkg.stock_blockers && pkg.stock_blockers.length > 0 && (
                        <p className="text-xs text-danger max-w-[220px]">
                          {pkg.stock_blockers[0]}
                          {pkg.stock_blockers.length > 1 ? ` (+${pkg.stock_blockers.length - 1} more)` : ''}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Badge color={pkg.is_active ? 'green' : 'gray'}>
                        {pkg.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {pkg.is_promoted && <Badge color="blue">Promoted</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/package/${pkg.slug}`} className="text-xs text-brand hover:underline" target="_blank">
                        View
                      </Link>
                      <button onClick={() => handleEdit(pkg)} className="text-xs text-brand hover:underline">Edit</button>
                      <button onClick={() => toggleActive(pkg)} className="text-xs text-gray-500 hover:underline">
                        {pkg.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => togglePromoted(pkg)} className="text-xs text-gray-500 hover:underline">
                        {pkg.is_promoted ? 'Unpromote' : 'Promote'}
                      </button>
                      <button onClick={() => setDeletingId(pkg.id)} className="text-xs text-danger hover:underline">Delete</button>
                    </div>
                  </TableCell>
                </tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddEditPackageModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingPackage(null);
        }}
        pkg={editingPackage}
        onSaved={loadPackages}
      />

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Package"
        message="Are you sure you want to delete this package? This cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/admin';
import { Spinner, Button, CustomSelect, ConfirmModal } from '@/components/ui';

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  currency: string;
  flat_rate: number;
  free_shipping_above: number | null;
  is_active: boolean;
}

const emptyZone = {
  name: '',
  countries: '',
  currency: 'USD',
  flat_rate: '',
  free_shipping_above: '',
};

export default function AdminShippingPage() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyZone);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const response = await adminApi.getShippingZones();
      setZones(response.data);
    } catch (error) {
      console.error('Error loading shipping zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (zone: ShippingZone) => {
    setEditingId(zone.id);
    setForm({
      name: zone.name,
      countries: zone.countries.join(', '),
      currency: zone.currency,
      flat_rate: zone.flat_rate?.toString() || '',
      free_shipping_above: zone.free_shipping_above?.toString() || '',
    });
    setShowAdd(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        name: form.name,
        countries: form.countries.split(',').map((c) => c.trim().toUpperCase()),
        currency: form.currency,
        flat_rate: Number(form.flat_rate),
        free_shipping_above: form.free_shipping_above ? Number(form.free_shipping_above) : null,
      };

      if (editingId) {
        await adminApi.updateShippingZone(editingId, data);
      } else {
        await adminApi.createShippingZone(data);
      }

      setEditingId(null);
      setShowAdd(false);
      setForm(emptyZone);
      loadZones();
    } catch (error) {
      console.error('Error saving zone:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await adminApi.deleteShippingZone(deletingId);
      setDeletingId(null);
      loadZones();
    } catch (error) {
      console.error('Error deleting zone:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (zone: ShippingZone) => {
    try {
      await adminApi.updateShippingZone(zone.id, { is_active: !zone.is_active });
      loadZones();
    } catch (error) {
      console.error('Error toggling zone:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAdd(false);
    setForm(emptyZone);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner size="lg" className="text-brand mx-auto" />
      </div>
    );
  }

  const inputClassName = "w-full px-3 py-2 border border-border rounded-lg text-base focus:ring-2 focus:ring-brand-light focus:border-transparent bg-white";
  const labelClassName = "block text-xs font-semibold text-brand-dark uppercase tracking-label mb-1";

  const renderForm = () => (
    <div className="bg-brand-50 p-4 rounded-lg border border-border space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label className={labelClassName}>Zone Name</label>
          <input
            className={inputClassName}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. United Kingdom"
          />
        </div>
        <div>
          <label className={labelClassName}>Countries (codes)</label>
          <input
            className={inputClassName}
            value={form.countries}
            onChange={(e) => setForm({ ...form, countries: e.target.value })}
            placeholder="e.g. GB or US, CA"
          />
        </div>
        <div>
          <label className={labelClassName}>Currency</label>
          <CustomSelect
            value={form.currency}
            onChange={(val) => setForm({ ...form, currency: val })}
            options={[
              { value: 'NGN', label: 'NGN' },
              { value: 'USD', label: 'USD' },
              { value: 'GBP', label: 'GBP' },
              { value: 'EUR', label: 'EUR' },
            ]}
            variant="form"
          />
        </div>
        <div>
          <label className={labelClassName}>Flat Rate</label>
          <input
            className={inputClassName}
            type="number"
            step="0.01"
            value={form.flat_rate}
            onChange={(e) => setForm({ ...form, flat_rate: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClassName}>Free Above</label>
          <input
            className={inputClassName}
            type="number"
            step="0.01"
            value={form.free_shipping_above}
            onChange={(e) => setForm({ ...form, free_shipping_above: e.target.value })}
            placeholder="Optional"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} loading={saving}>
          {editingId ? 'Update' : 'Create'}
        </Button>
        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-brand-dark">Shipping Zones</h1>
        {!showAdd && !editingId && (
          <Button onClick={() => setShowAdd(true)}>Add Zone</Button>
        )}
      </div>

      {(showAdd || editingId) && renderForm()}

      {/* Desktop table */}
      <div className="hidden md:block mt-6 bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-brand-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-brand-dark uppercase tracking-label">Zone</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-brand-dark uppercase tracking-label">Countries</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-brand-dark uppercase tracking-label">Currency</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-brand-dark uppercase tracking-label">Rate</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-brand-dark uppercase tracking-label">Free Above</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-brand-dark uppercase tracking-label">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-brand-dark uppercase tracking-label">Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr key={zone.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-sm font-medium text-brand-dark">{zone.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    {zone.countries.map((c) => (
                      <span key={c} className="bg-brand-50 text-brand-dark text-xs px-1.5 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{zone.currency}</td>
                <td className="px-4 py-3 text-sm font-medium text-brand-dark">{zone.flat_rate}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{zone.free_shipping_above || '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(zone)}
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      zone.is_active ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {zone.is_active ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(zone)}
                      className="text-xs font-medium text-brand hover:text-brand-light uppercase tracking-label"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingId(zone.id)}
                      className="text-xs font-medium text-danger hover:text-red-700 uppercase tracking-label"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden mt-6 space-y-3">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-brand-dark">{zone.name}</span>
              <button
                onClick={() => handleToggleActive(zone)}
                className={`text-xs font-medium px-2 py-1 rounded ${
                  zone.is_active ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {zone.is_active ? 'Active' : 'Disabled'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {zone.countries.map((c) => (
                <span key={c} className="bg-brand-50 text-brand-dark text-xs px-1.5 py-0.5 rounded">
                  {c}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
              <div>
                <span className="block text-xs text-gray-400 uppercase tracking-label">Currency</span>
                <span className="text-sm text-gray-500">{zone.currency}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 uppercase tracking-label">Rate</span>
                <span className="text-sm font-medium text-brand-dark">{zone.flat_rate}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 uppercase tracking-label">Free Above</span>
                <span className="text-sm text-gray-500">{zone.free_shipping_above || '—'}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-border">
              <button
                onClick={() => handleEdit(zone)}
                className="text-xs font-medium text-brand hover:text-brand-light uppercase tracking-label"
              >
                Edit
              </button>
              <button
                onClick={() => setDeletingId(zone.id)}
                className="text-xs font-medium text-danger hover:text-red-700 uppercase tracking-label"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Shipping Zone"
        message="Are you sure you want to delete this shipping zone?"
        loading={deleting}
      />
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/admin';
import { Spinner } from '@/components/ui';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await adminApi.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key] === 'true' ? 'false' : 'true',
    }));
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      await adminApi.updateSettings(settings);
      setMessage('Settings saved successfully');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
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
      <h1 className="font-serif text-3xl text-brand-dark mb-8">Settings</h1>

      <div className="bg-white rounded-xl border border-border p-6 md:p-8 max-w-2xl">
        <h2 className="font-semibold text-lg text-brand-dark mb-6">Payment Methods</h2>

        <div className="space-y-4 mb-8">
          <label className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-brand-dark">Online Payment (Paystack)</p>
              <p className="text-sm text-gray-400">Customers can pay online via card/bank transfer</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('payment_online_enabled')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.payment_online_enabled === 'true' ? 'bg-brand' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.payment_online_enabled === 'true' ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-brand-dark">Stripe (International Payments)</p>
              <p className="text-sm text-gray-400">Accept USD, GBP, EUR payments via Stripe</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('stripe_enabled')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.stripe_enabled === 'true' ? 'bg-brand' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.stripe_enabled === 'true' ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-brand-dark">Pay on Delivery</p>
              <p className="text-sm text-gray-400">Customers pay when the order is delivered (Nigeria only)</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('payment_cod_enabled')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.payment_cod_enabled === 'true' ? 'bg-brand' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.payment_cod_enabled === 'true' ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </label>
        </div>

        <h2 className="font-semibold text-lg text-brand-dark mb-6">Notifications</h2>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-brand-dark uppercase tracking-label mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={settings.whatsapp_number || ''}
              onChange={(e) => handleChange('whatsapp_number', e.target.value)}
              placeholder="e.g. 2348012345678"
              className="w-full px-4 py-3 text-base border border-border rounded-lg focus:ring-2 focus:ring-brand-light focus:border-transparent transition-colors bg-white text-brand-dark"
            />
            <p className="mt-1 text-sm text-gray-400">Include country code. Leave empty to disable WhatsApp alerts.</p>
          </div>
        </div>

        <h2 className="font-semibold text-lg text-brand-dark mb-6">Order Settings</h2>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-brand-dark uppercase tracking-label mb-2">
              Payment Expiry (minutes)
            </label>
            <input
              type="number"
              value={settings.payment_expiry_minutes || ''}
              onChange={(e) => handleChange('payment_expiry_minutes', e.target.value)}
              placeholder="30"
              min="5"
              max="1440"
              className="w-full px-4 py-3 text-base border border-border rounded-lg focus:ring-2 focus:ring-brand-light focus:border-transparent transition-colors bg-white text-brand-dark"
            />
            <p className="mt-1 text-sm text-gray-400">Unpaid online orders will be auto-cancelled after this time.</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-4 text-sm ${
            message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-brand hover:bg-brand-light disabled:opacity-50 text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Spinner } from '@/components/ui';

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adminUser, isAdminLoading } = useAdminAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAdminLoading) {
      if (!adminUser) {
        router.push('/admin/login');
      } else {
        setChecked(true);
      }
    }
  }, [adminUser, isAdminLoading, router]);

  if (isAdminLoading || !checked) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Spinner size="lg" className="text-brand" />
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}

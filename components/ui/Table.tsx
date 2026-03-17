'use client';

import React from 'react';

interface TableComponentProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableComponentProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-border overflow-hidden ${className}`}>
    <table className="w-full">{children}</table>
  </div>
);

export const TableHead: React.FC<TableComponentProps> = ({ children, className = '' }) => (
  <thead className={`bg-brand-50 ${className}`}>{children}</thead>
);

export const TableBody: React.FC<TableComponentProps> = ({ children, className = '' }) => (
  <tbody className={`divide-y divide-border ${className}`}>{children}</tbody>
);

export const TableHeader: React.FC<TableComponentProps> = ({ children, className = '' }) => (
  <th className={`px-6 py-3 text-left text-xs font-semibold text-brand uppercase tracking-label ${className}`}>{children}</th>
);

export const TableCell: React.FC<TableComponentProps> = ({ children, className = '' }) => (
  <td className={`px-6 py-4 text-sm ${className}`}>{children}</td>
);

export const TableRow: React.FC<TableComponentProps> = ({ children, className = '' }) => (
  <tr className={`hover:bg-brand-50/50 transition-colors ${className}`}>{children}</tr>
);

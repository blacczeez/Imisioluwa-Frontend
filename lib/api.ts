const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function serverFetch<T>(path: string, options?: { revalidate?: number }): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: options?.revalidate ?? 60 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

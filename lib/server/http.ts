import { NextResponse } from 'next/server';

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/** Express-parity error body: `{ error: string }` */
export function apiError(errorMessage: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: errorMessage, ...extra }, { status });
}

export function validationError(errors: unknown) {
  return NextResponse.json({ errors }, { status: 400 });
}

import { NextResponse } from 'next/server';
import { AppError } from './errors';

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; message: string; code: string; details?: unknown };

export class ResponseBuilder {
  public ok<T>(data: T, status = 200, headers?: Record<string, string>) {
    return NextResponse.json({ success: true, ...data } as any, {
      status,
      headers
    });
  }

  public fail(err: unknown, headers?: Record<string, string>) {
    const e = err instanceof AppError ? err : new AppError('Internal server error');
    const body: ApiError = {
      success: false,
      message: e.message,
      code: e.code,
      ...(e.details ? { details: e.details } : {})
    };
    return NextResponse.json(body, { status: e.status, headers });
  }
}

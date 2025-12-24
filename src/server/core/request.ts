import type { NextRequest } from 'next/server';

export class RequestContext {
  constructor(private readonly req: NextRequest) {}

  public ip(): string {
    const xff = this.req.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    return this.req.headers.get('x-real-ip') ?? 'unknown';
  }

  public async json<T>(): Promise<T> {
    return (await this.req.json()) as T;
  }

  public query(name: string): string | null {
    return this.req.nextUrl.searchParams.get(name);
  }

  public paramFromPath(pathname: string, indexFromEnd: number): string {
    const parts = pathname.split('/').filter(Boolean);
    return parts[parts.length - indexFromEnd];
  }
}

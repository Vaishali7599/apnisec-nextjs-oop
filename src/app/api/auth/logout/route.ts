import type { NextRequest } from 'next/server';
import { LogoutHandler } from '@/server/auth/LogoutHandler';

export async function POST(req: NextRequest) {
  return new LogoutHandler().handle(req);
}

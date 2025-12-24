import type { NextRequest } from 'next/server';
import { LoginHandler } from '@/server/auth/LoginHandler';

export async function POST(req: NextRequest) {
  return new LoginHandler().handle(req);
}

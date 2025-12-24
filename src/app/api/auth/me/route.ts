import type { NextRequest } from 'next/server';
import { MeHandler } from '@/server/auth/MeHandler';

export async function GET(req: NextRequest) {
  return new MeHandler().handle(req);
}

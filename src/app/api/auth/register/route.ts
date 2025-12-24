import type { NextRequest } from 'next/server';
import { RegisterHandler } from '@/server/auth/RegisterHandler';

export async function POST(req: NextRequest) {
  return new RegisterHandler().handle(req);
}

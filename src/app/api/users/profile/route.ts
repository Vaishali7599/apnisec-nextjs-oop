import type { NextRequest } from 'next/server';
import { ProfileHandler } from '@/server/users/ProfileHandler';

export async function GET(req: NextRequest) {
  return new ProfileHandler().get(req);
}

export async function PUT(req: NextRequest) {
  return new ProfileHandler().put(req);
}

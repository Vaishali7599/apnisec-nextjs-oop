import type { NextRequest } from 'next/server';
import { IssuesHandler } from '@/server/issues/IssuesHandler';

export async function GET(req: NextRequest) {
  return new IssuesHandler().get(req);
}

export async function POST(req: NextRequest) {
  return new IssuesHandler().post(req);
}

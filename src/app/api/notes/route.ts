import type { NextRequest } from 'next/server';
import { NotesHandler } from '@/server/notes/NotesHandler';

export async function GET(req: NextRequest) {
  return new NotesHandler().get(req);
}

export async function POST(req: NextRequest) {
  return new NotesHandler().post(req);
}

import type { NextRequest } from 'next/server';
import { IssueByIdHandler } from '@/server/issues/IssueByIdHandler';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  return new IssueByIdHandler().get(req, params.id);
}

export async function PUT(req: NextRequest, { params }: Params) {
  return new IssueByIdHandler().put(req, params.id);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  return new IssueByIdHandler().delete(req, params.id);
}

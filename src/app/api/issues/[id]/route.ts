import type { NextRequest } from "next/server";
import { IssueByIdHandler } from "@/server/issues/IssueByIdHandler";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return new IssueByIdHandler().get(req, params.id);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return new IssueByIdHandler().put(req, params.id);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return new IssueByIdHandler().delete(req, params.id);
}

import type { NextRequest } from "next/server";
import { IssueByIdHandler } from "@/server/issues/IssueByIdHandler";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return new IssueByIdHandler().get(req, id);
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return new IssueByIdHandler().put(req, id);
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return new IssueByIdHandler().delete(req, id);
}

// import type { NextRequest } from 'next/server';
// import { IssueByIdHandler } from '@/server/issues/IssueByIdHandler';

// type Params = { params: { id: string } };

// export async function GET(req: NextRequest, { params }: Params) {
//   return new IssueByIdHandler().get(req, params.id);
// }

// export async function PUT(req: NextRequest, { params }: Params) {
//   return new IssueByIdHandler().put(req, params.id);
// }

// export async function DELETE(req: NextRequest, { params }: Params) {
//   return new IssueByIdHandler().delete(req, params.id);
// // }
// import type { NextRequest } from "next/server";
// import { IssuesHandler } from "@/server/issues/IssuesHandler";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   return new IssuesHandler().getById(req, params.id);
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   return new IssuesHandler().putById(req, params.id);
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   return new IssuesHandler().deleteById(req, params.id);
// }
// import type { NextRequest } from "next/server";
// import { IssuesHandler } from "@/server/issues/IssuesHandler";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   return new IssuesHandler().getById(req, params.id);
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   return new IssuesHandler().putById(req, params.id);
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   return new IssuesHandler().deleteById(req, params.id);
// }


import type { NextRequest } from "next/server";
import { IssuesHandler } from "@/server/issues/IssuesHandler";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  return new IssuesHandler().getById(req, id);
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  return new IssuesHandler().putById(req, id);
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  return new IssuesHandler().deleteById(req, id);
}

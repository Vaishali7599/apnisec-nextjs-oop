import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Container } from "@/server/core/Container";

export async function GET(req: NextRequest) {
  try {
    const c = Container.get();

    // requireUser should throw AuthError if not logged in
    const user = await c.authGuard.requireUser(req);

    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name ?? null } },
      { status: 200 }
    );
  } catch (e: any) {
    // Important: never return empty response, always JSON
    const status = e?.statusCode || e?.status || 401;
    const message = e?.message || "Unauthorized";
    return NextResponse.json({ message }, { status });
  }
}

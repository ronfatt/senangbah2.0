import { NextResponse } from "next/server";
import { resolveAccessSnapshot } from "../../../lib/access";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const snapshot = await resolveAccessSnapshot({
    authUserId: body?.authUserId,
    email: body?.email
  });

  return NextResponse.json(snapshot);
}

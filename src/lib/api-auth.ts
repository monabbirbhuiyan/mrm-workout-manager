import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function getSessionFromRequest(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    return session;
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session?.user) {
    return null;
  }
  return session;
}

export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

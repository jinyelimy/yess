import { NextResponse } from "next/server";

import { currentUser } from "@/features/yess/mock-data";

export function GET() {
  return NextResponse.json({
    success: true,
    data: {
      user: currentUser,
      permissions: currentUser.permissions,
    },
  });
}


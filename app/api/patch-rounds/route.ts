import { NextResponse } from "next/server";

import { patchRounds } from "@/features/yess/mock-data";

export function GET() {
  return NextResponse.json({
    success: true,
    data: patchRounds,
  });
}


import { NextResponse } from "next/server";

import { getPatchTargetRows } from "@/features/yess/mock-data";

export function GET() {
  return NextResponse.json({
    success: true,
    data: getPatchTargetRows(),
  });
}


import { NextResponse } from "next/server";

import { workLogs } from "@/features/yess/mock-data";

export function GET() {
  return NextResponse.json({
    success: true,
    data: workLogs,
  });
}


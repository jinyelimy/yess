import { NextResponse } from "next/server";

import { workItems } from "@/features/yess/mock-data";

export function GET() {
  return NextResponse.json({
    success: true,
    data: workItems,
  });
}


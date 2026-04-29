import { NextResponse } from "next/server";

import { personalEvents } from "@/features/yess/mock-data";

export function GET() {
  return NextResponse.json({
    success: true,
    data: personalEvents,
  });
}


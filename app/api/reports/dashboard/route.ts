import { NextResponse } from "next/server";

import {
  getAssigneeProgress,
  getDashboardMetrics,
  getTodayAbsences,
  getTodayTasks,
} from "@/features/yess/mock-data";

export function GET() {
  return NextResponse.json({
    success: true,
    data: {
      metrics: getDashboardMetrics(),
      assigneeProgress: getAssigneeProgress(),
      todayTasks: getTodayTasks(),
      absences: getTodayAbsences(),
    },
  });
}

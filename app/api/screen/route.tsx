import { db } from "@/config/db";
import { ScreenConfigTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const screenId = req.nextUrl.searchParams.get("screenId");

    if (!screenId) {
      return NextResponse.json(
        { message: "Screen ID is required" },
        { status: 400 }
      );
    }

    await db
      .delete(ScreenConfigTable)
      .where(eq(ScreenConfigTable.screenId, screenId));

    return NextResponse.json({ message: "Screen deleted successfully" });
  } catch (error) {
    console.error("Delete screen error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

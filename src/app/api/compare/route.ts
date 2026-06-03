import { NextResponse } from "next/server";
import { CollegeRepository } from "@/lib/db/collegeRepository";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsString = searchParams.get("ids");

    if (!idsString) {
      return NextResponse.json(
        { error: "College IDs are required (comma separated)" },
        { status: 400 }
      );
    }

    const ids = idsString.split(",").map(id => id.trim()).filter(Boolean);
    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Valid college IDs are required" },
        { status: 400 }
      );
    }

    if (ids.length > 3) {
      return NextResponse.json(
        { error: "You can compare a maximum of 3 colleges at once" },
        { status: 400 }
      );
    }

    const colleges = await CollegeRepository.getCollegesForComparison(ids);
    return NextResponse.json(colleges);
  } catch (error) {
    console.error("Comparison API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

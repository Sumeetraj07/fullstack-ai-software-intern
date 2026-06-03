import { NextResponse } from "next/server";
import { CollegeRepository } from "@/lib/db/collegeRepository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Resolve dynamic params safely for all Next.js versions (Next.js 15+ has async params)
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const college = await CollegeRepository.getCollegeById(id);
    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error("Fetch college detail API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

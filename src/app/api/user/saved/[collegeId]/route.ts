import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { CollegeRepository } from "@/lib/db/collegeRepository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collegeId: string }> | { collegeId: string } }
) {
  try {
    const resolvedParams = await params;
    const collegeId = resolvedParams.collegeId;

    // Check auth
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to save colleges." },
        { status: 401 }
      );
    }

    // Verify college exists
    const college = await CollegeRepository.getCollegeById(collegeId);
    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    const result = await CollegeRepository.toggleSavedCollege(
      userPayload.userId,
      collegeId
    );

    return NextResponse.json({
      message: result.saved ? "College saved successfully" : "College removed from saved items",
      saved: result.saved
    });
  } catch (error) {
    console.error("Toggle save college API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

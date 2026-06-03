import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { CollegeRepository } from "@/lib/db/collegeRepository";

export async function GET(request: Request) {
  try {
    // Check auth
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to retrieve saved colleges." },
        { status: 401 }
      );
    }

    const savedColleges = await CollegeRepository.getSavedColleges(userPayload.userId);
    return NextResponse.json(savedColleges);
  } catch (error) {
    console.error("Get saved colleges API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { CollegeRepository } from "@/lib/db/collegeRepository";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const location = searchParams.get("location") || undefined;
    
    const minFeesStr = searchParams.get("minFees");
    const maxFeesStr = searchParams.get("maxFees");
    const minRatingStr = searchParams.get("minRating");
    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");

    const minFees = minFeesStr ? parseFloat(minFeesStr) : undefined;
    const maxFees = maxFeesStr ? parseFloat(maxFeesStr) : undefined;
    const minRating = minRatingStr ? parseFloat(minRatingStr) : undefined;
    const page = pageStr ? parseInt(pageStr, 10) : undefined;
    const limit = limitStr ? parseInt(limitStr, 10) : undefined;

    const data = await CollegeRepository.getColleges({
      search,
      location,
      minFees,
      maxFees,
      minRating,
      page,
      limit
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch colleges API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

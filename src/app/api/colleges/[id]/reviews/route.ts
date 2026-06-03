import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { CollegeRepository } from "@/lib/db/collegeRepository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const collegeId = resolvedParams.id;

    // Check auth
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to submit a review." },
        { status: 401 }
      );
    }

    const { rating, content } = await request.json();

    // Validation
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { error: "Rating must be a number between 1 and 5" },
        { status: 400 }
      );
    }

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Review content must be at least 10 characters long" },
        { status: 400 }
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

    const review = await CollegeRepository.addReview(
      collegeId,
      userPayload.userId,
      userPayload.name,
      parsedRating,
      content.trim()
    );

    return NextResponse.json(
      { message: "Review added successfully", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add review API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

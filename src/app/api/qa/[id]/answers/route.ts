import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { CollegeRepository } from "@/lib/db/collegeRepository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const questionId = resolvedParams.id;

    // Check auth
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to submit an answer." },
        { status: 401 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Answer content must be at least 10 characters long" },
        { status: 400 }
      );
    }

    const answer = await CollegeRepository.addAnswer(
      questionId,
      userPayload.userId,
      userPayload.name,
      content.trim()
    );

    return NextResponse.json(
      { message: "Answer submitted successfully", answer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Post answer API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

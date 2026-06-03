import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { CollegeRepository } from "@/lib/db/collegeRepository";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId") || undefined;

    const questions = await CollegeRepository.getQuestions(collegeId);
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Get questions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check auth
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to ask a question." },
        { status: 401 }
      );
    }

    const { title, content, collegeId } = await request.json();

    if (!title || title.trim().length < 5) {
      return NextResponse.json(
        { error: "Title must be at least 5 characters long" },
        { status: 400 }
      );
    }

    if (!content || content.trim().length < 15) {
      return NextResponse.json(
        { error: "Question details must be at least 15 characters long" },
        { status: 400 }
      );
    }

    const question = await CollegeRepository.addQuestion(
      userPayload.userId,
      userPayload.name,
      title.trim(),
      content.trim(),
      collegeId || undefined
    );

    return NextResponse.json(
      { message: "Question posted successfully", question },
      { status: 201 }
    );
  } catch (error) {
    console.error("Post question API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

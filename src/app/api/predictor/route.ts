import { NextResponse } from "next/server";
import { CollegeRepository } from "@/lib/db/collegeRepository";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const exam = searchParams.get("exam");
    const rankStr = searchParams.get("rank");
    const category = searchParams.get("category") || "General";

    if (!exam || !rankStr) {
      return NextResponse.json(
        { error: "Exam and rank parameters are required" },
        { status: 400 }
      );
    }

    const rank = parseInt(rankStr, 10);
    if (isNaN(rank) || rank <= 0) {
      return NextResponse.json(
        { error: "Rank must be a positive integer" },
        { status: 400 }
      );
    }

    const recommendations = await CollegeRepository.getPredictorColleges(
      exam,
      rank,
      category
    );

    return NextResponse.json({
      exam,
      rank,
      category,
      recommendations
    });
  } catch (error) {
    console.error("Predictor API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

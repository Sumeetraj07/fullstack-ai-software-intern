import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { CollegeRepository } from "@/lib/db/collegeRepository";

export async function GET(request: Request) {
  try {
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const comparisons = await CollegeRepository.getSavedComparisons(userPayload.userId);
    return NextResponse.json(comparisons);
  } catch (error) {
    console.error("Get saved comparisons error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { collegeIds, name } = await request.json();

    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length === 0) {
      return NextResponse.json(
        { error: "A list of college IDs is required" },
        { status: 400 }
      );
    }

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "A comparison name is required" },
        { status: 400 }
      );
    }

    const comparison = await CollegeRepository.saveComparison(
      userPayload.userId,
      collegeIds,
      name.trim()
    );

    return NextResponse.json(
      { message: "Comparison saved successfully", comparison },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save comparison error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Comparison ID is required" },
        { status: 400 }
      );
    }

    const success = await CollegeRepository.deleteSavedComparison(
      userPayload.userId,
      id
    );

    if (!success) {
      return NextResponse.json(
        { error: "Comparison not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Comparison deleted successfully" });
  } catch (error) {
    console.error("Delete comparison error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

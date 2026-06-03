import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { CollegeRepository } from "@/lib/db/collegeRepository";

export async function GET(request: Request) {
  try {
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const user = await CollegeRepository.getUserById(userPayload.userId);
    if (!user) {
      // Clear invalid cookie
      const response = NextResponse.json({ authenticated: false, user: null }, { status: 200 });
      response.headers.set(
        "Set-Cookie",
        "token=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
      return response;
    }

    // Retrieve user's saved colleges and comparisons
    const savedColleges = await CollegeRepository.getSavedColleges(user.id);
    const savedComparisons = await CollegeRepository.getSavedComparisons(user.id);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        savedColleges: savedColleges.map(c => c.id),
        savedComparisons
      }
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

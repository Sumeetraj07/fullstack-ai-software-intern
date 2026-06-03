import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });
  
  // Set expired cookie to delete it
  response.headers.set(
    "Set-Cookie",
    "token=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );
  
  return response;
}

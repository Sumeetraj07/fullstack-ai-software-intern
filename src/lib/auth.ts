import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "college_platform_super_secret_key_12345";

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getUserFromRequest(request: Request): JWTPayload | null {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const parts = cookie.split("=");
      const key = parts[0]?.trim();
      const val = parts.slice(1).join("=").trim();
      if (key) acc[key] = decodeURIComponent(val);
      return acc;
    }, {} as Record<string, string>);

    const token = cookies["token"];
    if (!token) return null;

    return verifyToken(token);
  } catch {
    return null;
  }
}

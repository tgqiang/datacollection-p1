import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasCorrectApiKey } from "@/services/auth";
import { createResponseObject, logApiRequest } from "@/utils/backend";

// This function can be marked `async` if using `await` inside;
// This main middleware file should sit within the root of `/src`.
export function middleware(req: NextRequest) {
  logApiRequest(
    req.method ?? "UNKNOWN_METHOD",
    req.url,
    JSON.stringify(req.body)
  );

  try {
    if (hasCorrectApiKey(req)) {
      return NextResponse.next();
    } else {
      return NextResponse.json(createResponseObject(null, "Not authorized"), {
        status: 401,
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      createResponseObject(null, "Internal server error"),
      {
        status: 500,
      }
    );
  }
}

// Optional: Define paths where middleware should apply
export const config = {
  matcher: ["/api/:path*"], // Apply middleware to all API routes
};

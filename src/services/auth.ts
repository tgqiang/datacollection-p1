import { NextRequest } from "next/server";

export function hasCorrectApiKey(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.split(" ")[1];
  if (token !== process.env.API_KEY) {
    return false;
  }

  return true;
}

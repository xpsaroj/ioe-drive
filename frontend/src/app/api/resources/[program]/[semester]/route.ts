// used to call the backend API to get the list of resources for a specific program and semester
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ message: "Hello from API!" });
}

// Optionally POST or other methods
// export async function POST(request: Request) { ... }

// import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

// export const GET = handleAuth();

import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { kindeAuth: string } }
): Promise<Response> {
  console.log(`Kinde Auth Route: ${params.kindeAuth}`);
  console.log(`Request URL: ${request.url}`);

  try {
    const authHandler = handleAuth();
    const response = await authHandler(request, params);
    
    if (response instanceof Response) {
      return response;
    } else if (typeof response === 'function') {
      // If it's a function, we need to call it and return the result
      return NextResponse.json({ message: "Authentication in progress" });
    } else {
      // If it's neither a Response nor a function, return a generic success response
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Kinde Auth Error:", error);
    return NextResponse.json(
      {
        error: "Authentication error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

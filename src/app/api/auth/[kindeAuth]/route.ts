// import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

// export const GET = handleAuth();

import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { kindeAuth: string } }
) {
  console.log(`Kinde Auth Route: ${params.kindeAuth}`);
  console.log(`Request URL: ${request.url}`);
  try {
    const response = await handleAuth(request, params.kindeAuth);
    // handleAuth returns a function, not a response object
    // So we need to call it with the request and response
    const result = await response(request, {});
    console.log(`Auth result received`);
    return result;
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

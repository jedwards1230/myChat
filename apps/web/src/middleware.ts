import type { NextRequest } from "next/server";

//import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(_: NextRequest) {
	//return NextResponse.redirect(new URL("/home", request.url));
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

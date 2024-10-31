import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public routes including the webhook route
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/', '/api/(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth(); // Get the user ID from Clerk
  
  // If the route is public (like sign-in or sign-up)
  if (isPublicRoute(request)) {
    if (userId) {
      const homeUrl = new URL('/home', request.url);
      return NextResponse.redirect(homeUrl); // Redirect to home if signed in
    }
    return NextResponse.next(); // Allow access to public routes
  }

  // If the user is not signed in and trying to access a protected route
  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl); // Redirect to sign-in if not signed in
  }

  // Proceed to the protected route if the user is authenticated
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // Always run for API routes
  ],
};

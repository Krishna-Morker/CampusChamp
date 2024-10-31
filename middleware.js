import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)','/'])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth(); // Get the user ID from auth
  // If the route is public (sign-in or sign-up)
  if (isPublicRoute(request)) {
    // If the user is signed in, redirect to the home page
    if (userId) {
      const homeUrl = new URL('/home', request.url);
      return NextResponse.redirect(homeUrl); // Redirect to home if signed in
    }
    // Allow access to public routes if the user is not signed in
    return NextResponse.next();
  }

  // If the user is not signed in and trying to access a protected route
  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl); // Redirect to sign-in
  }

  // Proceed to the protected route if the user is authenticated
  return NextResponse.next();
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
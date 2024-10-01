import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'

const isProtectedRoute = createRouteMatcher([
    '/user/(.*)', '/api/user/(.*)', '/api/stripe/(.*)'
  ]);
  
  export const onRequest = clerkMiddleware((auth, context) => {
    if (!auth().userId && isProtectedRoute(context.request)) {
      return auth().redirectToSignIn();
    }
  });
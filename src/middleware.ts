import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'

const isProtectedRoute = createRouteMatcher([
    '/user', '/user/(.*)', '/api/user/(.*)', '/api/stripe/(.*)'
  ]);
  
export const onRequest = clerkMiddleware((auth, context) => {
  console.log('auth----', !auth().userId, isProtectedRoute(context.request), auth().userId)
  if (!auth().userId && isProtectedRoute(context.request)) {
    return auth().redirectToSignIn();
  }
});

// export const onRequest = clerkMiddleware()
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

// Specify which routes should be protected
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/goals/:path*',
    '/schedule/:path*',
    '/ai-coach/:path*',
    '/api/ai-generated-schedule/:path*',
    '/api/save-plan/:path*',
    '/api/study-plans/:path*',
    // Add other protected routes here
  ]
};

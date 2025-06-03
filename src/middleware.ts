import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on all routes
export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next();

  // Add CORS headers to all responses
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}

// Only run middleware on API routes and for OPTIONS requests
export const config = {
  matcher: [
    '/api/:path*',
    {
      source: '/(.*)',
      has: [{ type: 'header', key: 'Access-Control-Request-Method' }],
    },
  ],
};

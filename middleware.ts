import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple middleware - the actual check happens client-side
// This just ensures the route exists
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: '/profile',
}


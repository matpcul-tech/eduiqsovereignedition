import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(_request: NextRequest) {
  // Auth gating temporarily disabled — open access for development.
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

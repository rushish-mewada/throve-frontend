import { NextResponse } from 'next/server';

export function proxy(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://checkout.razorpay.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://placehold.co https://images.unsplash.com https://*.razorpay.com;
    font-src 'self';
    connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com wss://api.decart.ai https://api.decart.ai;
    frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('x-nonce', nonce);

  // First-party attribution capture (no browser JS required)
  const sp = request.nextUrl?.searchParams;
  const utmSource = sp?.get('utm_source');
  const utmMedium = sp?.get('utm_medium');
  const utmCampaign = sp?.get('utm_campaign');
  const fbclid = sp?.get('fbclid');
  const fbp = request.cookies.get('_fbp')?.value;
  const fbc = request.cookies.get('_fbc')?.value || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

  if (utmSource || utmMedium || utmCampaign || fbclid || fbp || fbc) {
    const existingRaw = request.cookies.get('throve_attr')?.value;
    let existing = {};
    try {
      if (existingRaw) existing = JSON.parse(existingRaw);
    } catch {
      existing = {};
    }
    const merged = {
      ...existing,
      ...(utmSource ? { utmSource } : {}),
      ...(utmMedium ? { utmMedium } : {}),
      ...(utmCampaign ? { utmCampaign } : {}),
      ...(fbclid ? { fbclid } : {}),
      ...(fbp ? { fbp } : {}),
      ...(fbc ? { fbc } : {}),
    };
    response.cookies.set('throve_attr', JSON.stringify(merged), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

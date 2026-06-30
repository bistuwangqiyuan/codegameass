import { SignJWT, jwtVerify } from 'jose';

function getSecret(): Uint8Array {
  const secret =
    import.meta.env.AUTH_SECRET ||
    'bistu-dev-auth-secret-change-in-production-32chars';
  return new TextEncoder().encode(secret);
}

export async function signToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return verifyToken(auth.slice(7));
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function parseJsonBody<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}

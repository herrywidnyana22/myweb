import { jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
);

export async function createToken(username: string): Promise<string> {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  return token;
}

export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as { username: string };
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
}

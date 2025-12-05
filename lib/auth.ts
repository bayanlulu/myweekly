import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('❌ Please add JWT_SECRET to your .env.local file');
}

// What we store in the JWT token
interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Hash a password (encrypt it)
 * We NEVER store plain passwords in the database
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Check if a password matches the hashed version
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Create a JWT token 
 * This proves the user is logged in
 */
export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',  // Token is valid for 7 days
  });
}

/**
 * Verify a JWT token
 * Returns the user info if valid, null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Get the currently logged-in user
 */
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Log in a user (set authentication cookie)
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,     // Cannot be accessed by JavaScript (security)
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,  // 7 days
    path: '/',
  });
}

/**
 * Log out a user (remove authentication cookie)
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}
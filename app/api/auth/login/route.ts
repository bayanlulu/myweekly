import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';

/**
 * POST /api/auth/login
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Get email and password from the login form
    const { email, password } = await request.json();

    // Step 2: Make sure both are provided
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Step 3: Connect to database
    await connectDB();

    // Step 4: Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Step 5: If user doesn't exist, return error
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Step 6: Check if password is correct
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Step 7: Create a login token
    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Step 8: Set the token in a cookie (logs them in)
    await setAuthCookie(token);

    // Step 9: Send success response
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';

/**
 * POST /api/auth/register
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Get the data sent from the registration form
    const { name, email, password, department } = await request.json();

    // Step 2: Validate - make sure all required fields are filled
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Step 3: Check if email is valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Step 4: Check password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Step 5: Connect to database
    await connectDB();

    // Step 6: Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      );
    }

    // Step 7: Encrypt the password (NEVER store plain passwords!)
    const hashedPassword = await hashPassword(password);

    // Step 8: Create the new user in database
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      department: department || '',
    });

    // Step 9: Create a login token for the user
    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Step 10: Set the token in a cookie (this logs them in)
    await setAuthCookie(token);

    // Step 11: Send success response
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
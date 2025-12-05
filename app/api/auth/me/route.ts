import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

/**
 * GET /api/auth/me
 */
export async function GET() {
  try {
    // Step 1: Check if someone is logged in
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not logged in' },
        { status: 401 }
      );
    }

    // Step 2: Connect to database
    await connectDB();

    // Step 3: Get full user details from the database
    const user = await User.findById(currentUser.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Step 4: Return user information
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500 }
    );
  }
}
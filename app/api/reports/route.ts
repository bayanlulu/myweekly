import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Report from '@/lib/models/Report';
import { getCurrentUser } from '@/lib/auth';

/**
 * GET /api/reports
 */
export async function GET(request: NextRequest) {
  console.log('📥 GET /api/reports - Starting...');
  
  try {
    // Step 1: Check if user is logged in
    const currentUser = await getCurrentUser();
    console.log('👤 Current user:', currentUser ? currentUser.userId : 'Not logged in');
    
    if (!currentUser) {
      console.log('❌ No user logged in');
      return NextResponse.json(
        { error: 'Please login to view reports' },
        { status: 401 }
      );
    }

    // Step 2: Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Step 3: Get optional filters from URL
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status'); // 'draft' or 'submitted'

    // Step 4: Build the query
    let query: any = { userId: currentUser.userId };
    
    // If status filter is provided, add it to query
    if (status) {
      query.status = status;
    }

    // Step 5: Get reports from database, sorted by newest first
    console.log('🔍 Fetching reports with query:', query);
    const reports = await Report.find(query).sort({ weekStartDate: -1 });

    // Step 6: Return the reports
    console.log(`✅ Found ${reports.length} reports`);
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('❌ GET reports error:', error);
    return NextResponse.json(
      { error: 'Failed to get reports' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reports
 */
export async function POST(request: NextRequest) {
  console.log('📥 POST /api/reports - Starting...');
  
  try {
    // Step 1: Check if user is logged in
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.log('❌ No user logged in');
      return NextResponse.json(
        { error: 'Please login to create reports' },
        { status: 401 }
      );
    }

    // Step 2: Get the report data from the request
    const reportData = await request.json();
    console.log('📋 Report data received:', {
      weekStartDate: reportData.weekStartDate,
      weekEndDate: reportData.weekEndDate,
      tasksCount: reportData.tasksCompleted?.length || 0,
      status: reportData.status
    });

    const {
      weekStartDate,
      weekEndDate,
      tasksCompleted,
      workInProgress,
      challenges,
      improvements,
      nextWeekPlan,
      summary,
      status,
    } = reportData;

    // Step 3: Validate required fields
    if (!weekStartDate || !weekEndDate) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Week start and end dates are required' },
        { status: 400 }
      );
    }

    // Step 4: Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Step 5: Create the report
    const report = await Report.create({
      userId: currentUser.userId,
      weekStartDate: new Date(weekStartDate),
      weekEndDate: new Date(weekEndDate),
      tasksCompleted: tasksCompleted || [],
      workInProgress: workInProgress || [],
      challenges: challenges || [],
      improvements: improvements || '',
      nextWeekPlan: nextWeekPlan || '',
      summary: summary || '',
      status: status || 'draft',
      submittedAt: status === 'submitted' ? new Date() : undefined,
    });

    // Step 6: Return the created report
    console.log('✅ Report created successfully with ID:', report._id);
    return NextResponse.json(
      { report },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ POST report error:', error);
    console.error('Error details:', error.message);
    return NextResponse.json(
      { error: 'Failed to create report: ' + error.message },
      { status: 500 }
    );
  }
}
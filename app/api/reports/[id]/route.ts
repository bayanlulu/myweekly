import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Report from '@/lib/models/Report';
import { getCurrentUser } from '@/lib/auth';

/**
 * GET /api/reports/[id]
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  
  console.log('📥 GET /api/reports/[id] - Starting...');
  console.log('🆔 Report ID:', params.id);
  
  try {
    // Check if user is logged in
    const currentUser = await getCurrentUser();
    console.log('👤 Current user:', currentUser ? currentUser.userId : 'Not logged in');
    
    if (!currentUser) {
      console.log('❌ No user logged in');
      return NextResponse.json(
        { error: 'Please login to view reports' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Find the report
    console.log('🔍 Searching for report...');
    const report = await Report.findById(params.id);

    // Check if report exists
    if (!report) {
      console.log('❌ Report not found in database');
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    console.log('✅ Report found!');
    console.log('📋 Report belongs to user:', report.userId);

    // Check if user owns this report
    if (report.userId !== currentUser.userId) {
      console.log('❌ User does not own this report');
      return NextResponse.json(
        { error: 'Not authorized to view this report' },
        { status: 403 }
      );
    }

    console.log('✅ Returning report data');
    return NextResponse.json({ report });
  } catch (error) {
    console.error('❌ GET report error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      { error: 'Failed to get report' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/reports/[id]
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  
  console.log('📥 PUT /api/reports/[id] - Starting...');
  console.log('🆔 Report ID:', params.id);
  
  try {
    // Check if user is logged in
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Please login to update reports' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the report
    const report = await Report.findById(params.id);

    // Check if report exists
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Check if user owns this report
    if (report.userId !== currentUser.userId) {
      return NextResponse.json(
        { error: 'Not authorized to update this report' },
        { status: 403 }
      );
    }

    // Get the update data
    const updateData = await request.json();

    // If status is being changed to 'submitted', set submittedAt
    if (updateData.status === 'submitted' && report.status !== 'submitted') {
      updateData.submittedAt = new Date();
    }

    // Update the report
    const updatedReport = await Report.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log('✅ Report updated successfully');
    return NextResponse.json({ report: updatedReport });
  } catch (error) {
    console.error('❌ PUT report error:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reports/[id]
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  
  console.log('📥 DELETE /api/reports/[id] - Starting...');
  console.log('🆔 Report ID:', params.id);
  
  try {
    // Check if user is logged in
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Please login to delete reports' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the report
    const report = await Report.findById(params.id);

    // Check if report exists
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Check if user owns this report
    if (report.userId !== currentUser.userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this report' },
        { status: 403 }
      );
    }

    // Delete the report
    await Report.findByIdAndDelete(params.id);

    console.log('✅ Report deleted successfully');
    return NextResponse.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('❌ DELETE report error:', error);
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}
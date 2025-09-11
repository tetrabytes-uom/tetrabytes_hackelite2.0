import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import ManualStudyPlan from '@/models/ManualStudyPlan';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Await params before using
    const { id } = await params;

    // Find the specific study plan
    const studyPlan = await ManualStudyPlan.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: user._id
    });

    if (!studyPlan) {
      return NextResponse.json(
        { error: 'Study plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      studyPlan: {
        _id: studyPlan._id,
        subject: studyPlan.subject,
        modules: studyPlan.modules,
        totalTime: studyPlan.totalTime,
        createdAt: studyPlan.createdAt,
        updatedAt: studyPlan.updatedAt,
      }
    });

  } catch (error) {
    console.error('Error fetching study plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { subject, modules, totalTime } = body;

    // Validate required fields
    if (!subject || !modules || modules.length === 0 || !totalTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Await params before using
    const { id } = await params;

    // Convert string ID to ObjectId for proper MongoDB query
    const objectId = new mongoose.Types.ObjectId(id);

    // Update the study plan
    const updatedPlan = await ManualStudyPlan.findOneAndUpdate(
      {
        _id: objectId,
        userId: user._id
      },
      {
        subject,
        modules,
        totalTime,
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!updatedPlan) {
      return NextResponse.json(
        { error: 'Study plan not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Study plan updated successfully',
        studyPlan: {
          _id: updatedPlan._id,
          subject: updatedPlan.subject,
          modules: updatedPlan.modules,
          totalTime: updatedPlan.totalTime,
          createdAt: updatedPlan.createdAt,
          updatedAt: updatedPlan.updatedAt,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating study plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Await params before using
    const { id } = await params;

    // Delete the study plan
    const deletedPlan = await ManualStudyPlan.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      userId: user._id
    });

    if (!deletedPlan) {
      return NextResponse.json(
        { error: 'Study plan not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Study plan deleted successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting study plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
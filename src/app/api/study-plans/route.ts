import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import ManualStudyPlan from '@/models/ManualStudyPlan';
import User from '@/models/User';

export async function POST(request: NextRequest) {
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

    // Create new manual study plan
    const studyPlan = new ManualStudyPlan({
      userId: user._id,
      subject,
      modules,
      totalTime,
    });

    await studyPlan.save();

    return NextResponse.json(
      {
        message: 'Study plan created successfully',
        studyPlan: {
          id: studyPlan._id,
          subject: studyPlan.subject,
          modules: studyPlan.modules,
          totalTime: studyPlan.totalTime,
          createdAt: studyPlan.createdAt,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating study plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
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

    // Get all study plans for the user
    const studyPlans = await ManualStudyPlan.find({ userId: user._id })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      studyPlans: studyPlans.map(plan => ({
        id: plan._id,
        subject: plan.subject,
        modules: plan.modules,
        totalTime: plan.totalTime,
        createdAt: plan.createdAt,
      }))
    });

  } catch (error) {
    console.error('Error fetching study plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

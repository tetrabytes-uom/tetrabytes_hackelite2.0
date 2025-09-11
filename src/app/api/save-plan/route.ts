import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
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
    const { aiPlan } = body;

    // Validate AI plan data
    if (!aiPlan || !aiPlan.mainGoal || !aiPlan.subGoals) {
      return NextResponse.json(
        { error: 'Invalid AI plan data' },
        { status: 400 }
      );
    }

    // Convert AI plan to ManualStudyPlan format
    const modules = aiPlan.subGoals.map((subGoal: any) => {
      // Extract hours from duration string (e.g., "2 hours" -> 2)
      const durationMatch = subGoal.duration?.match(/(\d+(?:\.\d+)?)/);
      const timeAllocation = durationMatch ? parseFloat(durationMatch[1]) : 1;

      return {
        name: subGoal.title || subGoal.description?.substring(0, 50) || 'Study Module',
        timeAllocation: timeAllocation
      };
    });

    // Calculate total time
    const totalTime = modules.reduce((sum: number, module: any) => sum + module.timeAllocation, 0);

    // Create new study plan from AI data
    const studyPlan = new ManualStudyPlan({
      userId: user._id,
      subject: aiPlan.mainGoal,
      modules: modules,
      totalTime: totalTime,
    });

    await studyPlan.save();

    return NextResponse.json(
      {
        success: true,
        message: 'AI study plan saved successfully!',
        studyPlan: {
          id: studyPlan._id,
          subject: studyPlan.subject,
          modules: studyPlan.modules,
          totalTime: studyPlan.totalTime,
          createdAt: studyPlan.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error saving AI study plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

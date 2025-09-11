import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ManualStudyPlan from '@/models/ManualStudyPlan';
import StudyPlan from '@/models/StudyPlan';
import StudySession from '@/models/StudySession';
import User from '@/models/User';

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

    // Get all manual study plans
    const manualPlans = await ManualStudyPlan.find({ userId: user._id });

    // Get all AI-generated study plans
    const aiPlans = await StudyPlan.find({ userId: user._id });

    // Get all study sessions
    const studySessions = await StudySession.find({
      planId: { $in: [...manualPlans.map(p => p._id), ...aiPlans.map(p => p._id)] }
    }).sort({ date: 1 });

    // Calculate total study hours
    const manualHours = manualPlans.reduce((total, plan) => total + plan.totalTime, 0);
    const aiHours = aiPlans.reduce((total, plan) => total + (plan.dailyTime * plan.durationWeeks), 0);
    const totalStudyHours = manualHours + aiHours;

    // Calculate average daily hours (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSessions = studySessions.filter(session =>
      session.date >= thirtyDaysAgo && session.status === 'completed'
    );

    const totalRecentHours = recentSessions.reduce((total, session) =>
      total + session.tasks.reduce((taskTotal, task) => taskTotal + task.estimatedTime, 0), 0
    );

    const averageDailyHours = totalRecentHours / 30;

    // Calculate goals completed
    const completedManualPlans = manualPlans.length; // Assuming all manual plans are completed when created
    const completedAiPlans = aiPlans.filter(plan => plan.status === 'completed').length;
    const goalsCompleted = completedManualPlans + completedAiPlans;

    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    const checkDate = new Date(today);

    while (true) {
      const daySessions = studySessions.filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkDate.getTime() && session.status === 'completed';
      });

      if (daySessions.length > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Progress over time data (last 30 days)
    const progressData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const daySessions = studySessions.filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === date.getTime();
      });

      const completedTasks = daySessions.reduce((total, session) => {
        if (session.status === 'completed') {
          return total + session.tasks.length;
        }
        return total;
      }, 0);

      const totalTasks = daySessions.reduce((total, session) => total + session.tasks.length, 0);

      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      progressData.push({
        date: date.toISOString().split('T')[0],
        progress: Math.round(progress),
        completedTasks,
        totalTasks
      });
    }

    // Study hours by subject
    const subjectHoursMap = new Map<string, number>();

    // From manual plans
    manualPlans.forEach(plan => {
      const existing = subjectHoursMap.get(plan.subject) || 0;
      subjectHoursMap.set(plan.subject, existing + plan.totalTime);
    });

    // From AI plans (approximate by topic)
    aiPlans.forEach(plan => {
      const existing = subjectHoursMap.get(plan.topic) || 0;
      subjectHoursMap.set(plan.topic, existing + (plan.dailyTime * plan.durationWeeks));
    });

    const subjectHoursData = Array.from(subjectHoursMap.entries())
      .map(([subject, hours]) => ({ subject, hours }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5); // Top 5 subjects

    // Goal completion status
    const completed = goalsCompleted;
    const inProgress = aiPlans.filter(plan => plan.status === 'active').length;
    const notStarted = aiPlans.filter(plan => plan.status === 'paused').length;

    const completionData = [
      { name: 'Completed', value: completed, color: '#70A961' },
      { name: 'In Progress', value: inProgress, color: '#FFA500' },
      { name: 'Not Started', value: notStarted, color: '#FF6B6B' },
    ];

    return NextResponse.json({
      stats: {
        totalStudyHours,
        averageDailyHours: Math.round(averageDailyHours * 10) / 10,
        goalsCompleted,
        currentStreak,
      },
      progressData,
      subjectHoursData,
      completionData,
    });

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Get the user's prompt and optional current schedule from the request
    const { prompt, currentSchedule } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get the Gemini free tier model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create different prompts based on whether we're editing or creating
    let studyPrompt;
    
    if (currentSchedule) {
      // This is an edit request
      studyPrompt = `
      You are a friendly AI study coach. The user has this current study schedule:
      ${JSON.stringify(currentSchedule, null, 2)}
      
      The user wants to make this change: "${prompt}"
      
      Please modify the schedule according to their request and return the updated schedule.
      
      Return ONLY a valid JSON object with this format:
      {
        "type": "schedule",
        "mainGoal": "The main learning objective",
        "totalDuration": "Total time needed",
        "dailyHours": "Hours per day",
        "subGoals": [
          {
            "id": 1,
            "title": "Sub-goal title",
            "description": "Detailed description",
            "duration": "Time needed for this sub-goal",
            "day": "Which day(s) to cover this"
          }
        ]
      }
      
      IMPORTANT: Return ONLY the JSON object. No markdown, no code blocks, no additional text.
      `;
    } else {
      // This is a new schedule request
      studyPrompt = `
      You are a friendly AI study coach. Analyze this user request: "${prompt}"
      
      MINIMUM REQUIREMENTS to create a schedule:
      - Topic/subject to learn (e.g., Python, JavaScript, etc.)
      - Skill level (beginner, intermediate, advanced) OR context clues about experience
      - Time commitment (hours per day OR total duration)
      
      If ANY of these 3 core requirements are missing, ask for the missing information only.
      If you have these basics, create a schedule using reasonable defaults for any optional details.
      
      Return ONLY a valid JSON object in one of these formats:
      
      FORMAT 1 - For follow-up questions (only when core info is missing):
      {
        "type": "question",
        "message": "Ask specifically for the missing core requirement(s)"
      }
      
      FORMAT 2 - For complete study schedule (when you have topic + level + time):
      {
        "type": "schedule",
        "mainGoal": "The main learning objective",
        "totalDuration": "Total time needed (assume 2-4 weeks if not specified)",
        "dailyHours": "Hours per day",
        "subGoals": [
          {
            "id": 1,
            "title": "Sub-goal title",
            "description": "Detailed description",
            "duration": "Time needed for this sub-goal",
            "day": "Which day(s) to cover this"
          }
        ]
      }
      
      IMPORTANT: Return ONLY the JSON object. No markdown, no code blocks, no additional text.
      `;
    }

    // Generate content using Gemini
    const result = await model.generateContent(studyPrompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    // Try to parse the response as JSON
    let studySchedule;
    try {
      studySchedule = JSON.parse(text);
    } catch (parseError) {
      // If parsing fails, return the actual response for debugging
      console.error('Failed to parse JSON:', text);
      console.error('Parse error:', parseError);
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response as JSON',
          rawResponse: text,
          parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(studySchedule);

  } catch (error) {
    console.error('Error generating study schedule:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate study schedule',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
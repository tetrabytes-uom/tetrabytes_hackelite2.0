# PlanBee 🐝

<div align="center">
  <img src="public/Bee.png" alt="PlanBee Logo" width="100" height="100">
  <h3>AI-Powered Study Assistant for Smart Learning</h3>
  <p>Build consistent study habits with an assistant that adapts to your schedule and goals</p>
</div>

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

## 🎯 About

PlanBee is an intelligent study planning application developed at the University of Moratuwa to revolutionize self-directed learning. Despite the boom in e-learning, course completion rates remain under 30% due to poor planning, static schedules, and lack of motivation.

PlanBee addresses these challenges by generating **personalized, adaptive study plans** that match your goals, time, and learning style — while keeping you engaged with AI-powered coaching, gamification, and curated resources.

### Key Highlights

- 🤖 **AI Study Coach**: Conversational AI that creates personalized study plans
- 📅 **Dynamic Scheduling**: Plans automatically adjust when you fall behind
- 🎯 **Goal-Oriented Paths**: Certification-aligned learning with milestones
- 🏆 **Gamified Learning**: Streaks, badges, and leaderboards for motivation
- 📊 **Progress Analytics**: Track your learning journey with detailed insights

## ✨ Features

### Core Features

- **AI-Powered Study Plans**: Automatically generates and updates personalized study plans based on your goals and schedule
- **Goal-Oriented Learning Paths**: Create paths aligned to certifications (AWS, PMP, etc.) or personal learning objectives
- **Smart Calendar Integration**: Sync tasks to your calendar and get reminders
- **Certification Mode**: Focused mode with practice tests and readiness checks for official exams
- **Gamified Learning**: Earn streaks, badges and climb leaderboards to stay consistent
- **Smart Notifications**: Timely alerts to help you stay on track

### User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Dashboard**: Clean, modern interface with progress tracking
- **Real-time Updates**: Live progress updates and adaptive scheduling
- **Privacy-First**: Secure authentication with data protection

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth interactions

### Backend & Database

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database for user data and study plans
- **Mongoose** - MongoDB object modeling
- **NextAuth.js** - Authentication and session management

### AI & Analytics

- **Google Generative AI** - Powered AI study coach
- **Recharts** - Data visualization for analytics

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Tailwind CSS** - Styling

## � Dependencies

### Core Dependencies

```json
{
  "@google/generative-ai": "^0.24.1",
  "bcryptjs": "^3.0.2",
  "framer-motion": "^12.23.12",
  "lucide-react": "^0.542.0",
  "mongoose": "^8.18.0",
  "next": "15.5.0",
  "next-auth": "^4.24.11",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "recharts": "^3.2.0",
  "zod": "^4.1.5"
}
```

### Development Dependencies

```json
{
  "@eslint/eslintrc": "^3",
  "@tailwindcss/postcss": "^4",
  "@types/node": "20.19.13",
  "@types/react": "19.1.12",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "15.5.0",
  "tailwindcss": "^4",
  "typescript": "5.9.2"
}
```

### Key Dependencies Overview

- **@google/generative-ai**: Powers the AI study coach functionality
- **bcryptjs**: Password hashing for secure authentication
- **framer-motion**: Smooth animations and transitions
- **lucide-react**: Beautiful icons throughout the application
- **mongoose**: MongoDB object modeling for database operations
- **next-auth**: Authentication and session management
- **recharts**: Data visualization for analytics and progress tracking
- **zod**: TypeScript-first schema validation

## �📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **MongoDB** database (local or cloud instance)
- **Google AI API Key** (for AI features)

## 🚀 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/tetrabytes-uom/tetrabytes_hackelite2.0.git
   cd tetrabytes_hackelite2.0
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/planbee

   # Authentication
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000

   # Google AI
   GOOGLE_AI_API_KEY=your-google-ai-api-key

   # Optional: For production
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

4. **Database Setup:**
   Ensure MongoDB is running locally or update `MONGODB_URI` to point to your cloud database.

## 🏃 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The application will automatically reload as you make changes to the code.

## 📖 Usage

### For New Users

1. **Sign Up**: Create an account or sign in with your preferred method
2. **Set Your Goal**: Tell the AI coach what you want to learn (e.g., "AWS certification in 8 weeks")
3. **Get Your Plan**: AI generates a personalized study schedule
4. **Track Progress**: Use the dashboard to monitor your learning journey
5. **Stay Motivated**: Earn streaks and badges as you complete tasks

### Key Workflows

- **AI Study Coach**: Chat with the AI to create or modify study plans
- **Manual Goal Creation**: Set up custom study goals with specific timelines
- **Progress Analytics**: View detailed insights about your learning patterns
- **Schedule Management**: Adjust your study schedule as life happens

## 📁 Project Structure

```
tetrabytes_hackelite2.0/
├── public/                    # Static assets
│   ├── Bee.png               # App logo
│   └── [other assets]
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── ai-generated-schedule/
│   │   │   ├── analytics/
│   │   │   ├── auth/
│   │   │   ├── availability/
│   │   │   └── study-plans/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ai-coach/     # AI chat components
│   │   │   ├── layouts/      # Layout components
│   │   │   └── UI/           # Basic UI components
│   │   ├── lib/              # Utility libraries
│   │   │   ├── auth.ts       # Authentication config
│   │   │   └── mongodb.ts    # Database connection
│   │   └── models/           # Database models
│   │       ├── Availability.ts
│   │       ├── StudyPlan.ts
│   │       └── User.ts
│   └── types/                # TypeScript type definitions
├── package.json
├── tailwind.config.js
├── next.config.ts
└── tsconfig.json
```

## 🔌 API Routes

### Authentication

- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Study Plans

- `GET /api/study-plans` - Get user's study plans
- `POST /api/study-plans` - Create new study plan
- `GET /api/study-plans/[id]` - Get specific study plan
- `PUT /api/study-plans/[id]` - Update study plan
- `DELETE /api/study-plans/[id]` - Delete study plan

### AI Features

- `POST /api/ai-generated-schedule` - Generate AI study plan

### Analytics

- `GET /api/analytics` - Get user analytics data

### User Management

- `GET /api/availability` - Get user availability
- `POST /api/register` - User registration

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes and commit:**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and TypeScript conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 👥 Team

PlanBee is developed by **TetraBytes** for **Hackelite 2.0**:

- **Ishan Hansaka Silva**
- **T. M. Heshan Maduwantha Yatigammana**
- **U. Chami Praveesha De Silva**
- **Maleesha Nuwanthi Kolombage**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com)
- AI powered by [Google Generative AI](https://ai.google.dev)
- Icons from [Lucide React](https://lucide.dev)
- Animations with [Framer Motion](https://www.framer.com/motion)

---

<div align="center">
  <p>Made by TetraBytes</p>
  <p>Transforming self-directed learning, one study plan at a time 🐝</p>
</div>

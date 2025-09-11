import {
  Sparkles,
  BookOpen,
  Code,
  Briefcase,
  Languages,
  Palette,
  Zap,
} from "lucide-react";

interface QuickPromptsProps {
  onPromptSelect: (prompt: string) => void;
}

const quickPrompts = [
  {
    category: "Programming",
    icon: Code,
    color: "from-blue-500 to-blue-600",
    prompts: [
      "Create a beginner Python course for 3 weeks, 1 hour daily",
      "I want to learn React in 2 weeks with 2 hours daily",
      "Help me master JavaScript fundamentals in 10 days",
      "Prepare me for a coding interview in Python in 1 week",
    ],
  },
  {
    category: "Languages",
    icon: Languages,
    color: "from-green-500 to-green-600",
    prompts: [
      "Learn conversational Spanish in 1 month, 30 minutes daily",
      "IELTS preparation plan for 6 weeks",
      "French basics for beginners in 3 weeks",
      "Business English improvement in 2 weeks",
    ],
  },
  {
    category: "Academics",
    icon: BookOpen,
    color: "from-purple-500 to-purple-600",
    prompts: [
      "Mathematics calculus review for exam in 2 weeks",
      "Biology exam preparation in 10 days",
      "History revision plan for finals in 3 weeks",
      "Chemistry concepts review in 1 week",
    ],
  },
  {
    category: "Professional",
    icon: Briefcase,
    color: "from-orange-500 to-orange-600",
    prompts: [
      "Digital marketing certification prep in 4 weeks",
      "Project management fundamentals in 2 weeks",
      "Data analysis skills in 3 weeks, 1.5 hours daily",
      "Public speaking improvement in 10 days",
    ],
  },
  {
    category: "Creative",
    icon: Palette,
    color: "from-pink-500 to-pink-600",
    prompts: [
      "Graphic design basics in 2 weeks",
      "Photography fundamentals in 3 weeks",
      "Creative writing course in 1 month",
      "Music theory basics in 2 weeks",
    ],
  },
];

export default function QuickPrompts({ onPromptSelect }: QuickPromptsProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-[#70A961]" />
          <h2 className="text-lg font-semibold text-gray-900">Quick Start</h2>
        </div>
        <p className="text-sm text-gray-600">
          Choose a template or ask your own question
        </p>
      </div>

      <div className="p-4 space-y-6">
        {quickPrompts.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-6 h-6 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}
              >
                <category.icon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                {category.category}
              </h3>
            </div>

            <div className="space-y-2">
              {category.prompts.map((prompt, promptIndex) => (
                <button
                  key={promptIndex}
                  onClick={() => onPromptSelect(prompt)}
                  className="w-full text-left p-3 text-sm text-gray-700 bg-gray-50 hover:bg-[#70A961]/10 hover:text-gray-900 rounded-lg transition-all duration-200 hover:border-[#70A961]/20 border border-transparent"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Custom Prompt Section */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <h3 className="text-sm font-semibold text-gray-900">
              Popular Ideas
            </h3>
          </div>
          <div className="space-y-2">
            {[
              "Create a study plan for my exam next week",
              "I have 30 minutes daily, what can I learn?",
              "Help me break down a complex topic",
              "Modify my existing study schedule",
            ].map((idea, index) => (
              <button
                key={index}
                onClick={() => onPromptSelect(idea)}
                className="w-full text-left p-3 text-sm text-gray-700 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors border border-yellow-200"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

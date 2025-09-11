import { Brain, User, Save, Clock, Target, BookOpen } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  isGeneratedPlan?: boolean;
}

interface ChatMessageProps {
  message: Message;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentPlan?: any;
  onSavePlan?: () => void;
}

export default function ChatMessage({
  message,
  currentPlan,
  onSavePlan,
}: ChatMessageProps) {
  const isUser = message.type === "user";
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start space-x-3 max-w-[80%]`}
      >
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser
              ? "bg-black text-white"
              : "bg-gradient-to-br from-[#70A961] to-[#5f8c4b] text-white"
          }`}
        >
          {isUser ? (
            <User className="h-5 w-5" />
          ) : (
            <Brain className="h-5 w-5" />
          )}
        </div>

        {/* Message Content */}
        <div className={`${isUser ? "mr-3" : "ml-3"}`}>
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? "bg-black text-white"
                : "bg-white text-gray-900 shadow-sm border"
            }`}
          >
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>

          {/* Generated Plan Display */}
          {message.isGeneratedPlan && currentPlan && (
            <div className="mt-4 bg-gradient-to-br from-[#70A961]/5 to-[#5f8c4b]/5 border border-[#70A961]/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#70A961]" />
                  {currentPlan.mainGoal}
                </h3>
                <button
                  onClick={onSavePlan}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#70A961] text-white text-sm font-medium rounded-lg hover:bg-[#5f8c4b] transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save Plan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Duration
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {currentPlan.totalDuration}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Daily Time
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {currentPlan.dailyHours}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Sub-goals
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {currentPlan.subGoals?.length || 0}
                  </span>
                </div>
              </div>

              {currentPlan.subGoals && (
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Study Plan Breakdown:
                  </h4>
                  
                  {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    currentPlan.subGoals.map((goal: any, index: number) => (
                      <div
                        key={goal.id || index}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="text-sm font-semibold text-gray-900">
                            {goal.title}
                          </h5>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {goal.day}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {goal.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {goal.duration}
                          </span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`text-xs text-gray-500 mt-1 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}

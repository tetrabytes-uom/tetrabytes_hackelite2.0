import { Brain } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-3 max-w-[80%]">
        {/* AI Avatar */}
        <div className="w-10 h-10 bg-gradient-to-br from-[#70A961] to-[#5f8c4b] rounded-full flex items-center justify-center flex-shrink-0">
          <Brain className="h-5 w-5 text-white" />
        </div>

        {/* Typing Animation */}
        <div className="ml-3">
          <div className="bg-white text-gray-900 shadow-sm border rounded-2xl px-4 py-3">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600">
                AI Coach is thinking
              </span>
              <div className="flex space-x-1 ml-2">
                <div
                  className="w-2 h-2 bg-[#70A961] rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#70A961] rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#70A961] rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Timestamp placeholder */}
          <div className="text-xs text-gray-500 mt-1 text-left">Just now</div>
        </div>
      </div>
    </div>
  );
}

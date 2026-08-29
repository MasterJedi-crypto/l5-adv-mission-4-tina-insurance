export default function QuestionCard({ role, text }) {
  const isUser = role === "user";
  const isFeedback = role === "feedback";

  if (isFeedback) {
    return (
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-700/40 bg-blue-900/20">
          <span className="text-sm font-bold text-blue-400">
            F
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-2 font-mono text-[11px] font-semibold tracking-wide text-blue-400">
            Interview Feedback
          </p>

          <div className="max-w-[90%] rounded-2xl rounded-bl-none border border-blue-700/40 bg-blue-900/20 px-4 py-3">
            <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-blue-200">
              {text}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-3">
        <div className="flex min-w-0 flex-1 flex-col items-end">
          <p className="mb-2 font-mono text-[11px] font-semibold tracking-wide text-[#9898a8]">
            You
          </p>

          <div className="max-w-[90%] rounded-2xl rounded-br-none border border-[#27272f] bg-[#16161a] px-4 py-3">
            <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-[#e8e8f0]">
              {text}
            </p>
          </div>
        </div>

        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#27272f] bg-[#1a1a20]">
          <span className="font-mono text-xs font-semibold text-[#9898a8]">
            U
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#39ff6e44] bg-[#39ff6e0d]">
        <span className="font-mono text-xs font-bold text-[#39ff6e]">
          AI
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-2 font-mono text-[11px] font-semibold tracking-wide text-[#39ff6e]">
          Interview Coach
        </p>

        <div className="max-w-[90%] rounded-2xl rounded-bl-none border border-[#1e1e24] border-l-2 border-l-[#39ff6e] bg-[#111114] px-4 py-3">
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-[#c8c8d4]">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
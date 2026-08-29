export default function QuestionCard({ role, text }) {
  const isUser = role === "user";
  const isFeedback = role === "feedback";

  if (isFeedback) {
    return (
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f58220]">
          <span className="text-sm font-extrabold text-white">T</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#082f4f]">
            Tina’s recommendation
          </p>
          <div className="max-w-[92%] rounded-xl rounded-tl-sm border border-[#f2c49d] bg-[#fff7ef] px-4 py-4 shadow-sm">
            <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-[#29465b]">
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
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#536675]">
            You
          </p>
          <div className="max-w-[92%] rounded-xl rounded-tr-sm bg-[#082f4f] px-4 py-3 shadow-sm">
            <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-white">
              {text}
            </p>
          </div>
        </div>

        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dfe7ec]">
          <span className="text-xs font-extrabold text-[#536675]">YOU</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0073b9]">
        <span className="text-sm font-extrabold text-white">T</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#0073b9]">
          Tina
        </p>
        <div className="max-w-[92%] rounded-xl rounded-tl-sm border border-[#cddce5] bg-white px-4 py-3 shadow-sm">
          <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-[#29465b]">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

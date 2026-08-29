"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AnswerForm({
  onSubmitAnswer,
  loading = false,
}) {
  const [answer, setAnswer] = useState("");

  async function submitAnswer() {
    const cleanAnswer = answer.trim();

    if (!cleanAnswer || loading) {
      return;
    }

    try {
      const ok = await onSubmitAnswer(cleanAnswer);

      if (ok) {
        setAnswer("");
      }
    } catch {
      // Preserve the answer if submitting fails.
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitAnswer();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitAnswer();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="overflow-hidden rounded-lg border border-[#cdd8df] bg-white transition focus-within:border-[#0073b9] focus-within:ring-2 focus-within:ring-[#0073b91f]">
        <Textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your response..."
          disabled={loading}
          aria-label="Message to Tina"
          className="min-h-24 resize-y border-0 bg-transparent px-4 py-3 text-[15px] text-[#142536] shadow-none placeholder:text-[#8a99a3] focus-visible:ring-0 disabled:opacity-50"
        />

        <div className="flex items-center justify-between gap-3 border-t border-[#edf1f3] px-3 py-3">
          <span className="text-[11px] text-[#6b7c88]">
            {answer.length > 0
              ? `${answer.length} characters`
              : "Enter to send · Shift + Enter for a new line"}
          </span>

          <Button
            type="submit"
            disabled={loading || !answer.trim()}
            className="h-9 rounded-md bg-[#f58220] px-4 text-sm font-bold text-white hover:bg-[#d9680f]"
          >
            {loading ? "Thinking..." : "Send"}
            {!loading && <Send className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </form>
  );
}

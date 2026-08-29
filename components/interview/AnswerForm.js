"use client";

import { useState } from "react";

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
      <div className="overflow-hidden rounded-xl border border-[#1e1e24] bg-[#111114] transition-colors focus-within:border-[#39ff6e66] focus-within:ring-2 focus-within:ring-[#39ff6e14]">
        <Textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          disabled={loading}
          aria-label="Interview answer"
          className="min-h-24 resize-y border-0 bg-transparent px-4 py-3 text-[15px] text-[#e8e8f0] shadow-none placeholder:text-[#4b4b58] focus-visible:ring-0 disabled:opacity-50"
        />

        <div className="flex items-center justify-between gap-3 px-3 pb-3">
          <span className="font-mono text-[10px] text-[#6b6b7a]">
            {answer.length > 0
              ? `${answer.length} characters`
              : "Enter to send · Shift + Enter for a new line"}
          </span>

          <Button
            type="submit"
            disabled={loading || !answer.trim()}
            className="h-9 rounded-lg bg-[#39ff6e] px-4 text-sm font-semibold text-[#0a0a0b] hover:bg-[#61ff89]"
          >
            {loading ? "Thinking..." : "Send"}
          </Button>
        </div>
      </div>
    </form>
  );
}
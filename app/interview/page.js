"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import QuestionCard from "@/components/interview/QuestionCard";
import AnswerForm from "@/components/interview/AnswerForm";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const TOTAL_QUESTIONS = 6;

export default function InterviewPage() {
  const router = useRouter();
  const conversationEndRef = useRef(null);

  const [jobTitle, setJobTitle] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "interviewer",
      text: "Tell me about yourself",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  const answeredQuestions = messages.filter(
    (message) => message.role === "user"
  ).length;

  const currentQuestion = Math.min(
    answeredQuestions + 1,
    TOTAL_QUESTIONS
  );

  const progress = Math.min(
    Math.round((answeredQuestions / TOTAL_QUESTIONS) * 100),
    100
  );

  useEffect(() => {
    const savedJobTitle = sessionStorage.getItem(
      "interviewJobTitle"
    );

    if (!savedJobTitle) {
      router.replace("/");
      return;
    }

    setJobTitle(savedJobTitle);
  }, [router]);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  function handleReset() {
    sessionStorage.removeItem("interviewJobTitle");
    router.push("/");
  }

  async function handleAnswer(answer) {
  if (loading || complete) {
    return;
  }

  setError("");
  setLoading(true);

  const userMessage = {
    role: "user",
    text: answer,
  };

  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);

  try {
    const history = updatedMessages;
    const response = await fetch("/api/interview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobTitle,
        history,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to get an interview response."
      );
    }

    setMessages((current) => [
      ...current,
      {
        role: data.isComplete ? "feedback" : "interviewer",
        text: data.reply,
      },
    ]);

    if (data.isComplete) {
      setComplete(true);
    }

    return true;
  } catch (error) {
  console.error(error);

  setMessages((current) => current.slice(0, -1));

    setError(
      error.message ||
        "Something went wrong. Please try your answer again."
    );

    return false;
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-[#0a0a0b] px-4 py-4 text-[#e8e8f0] sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-4xl flex-col sm:min-h-[calc(100vh-4rem)]">
        <header className="mb-5 flex items-center justify-between border-b border-[#1a1a20] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#39ff6e44] bg-[#39ff6e0d]">
              <span className="font-mono text-sm font-bold text-[#39ff6e]">
                AI
              </span>
            </div>

            <div>
              <h1 className="text-base font-bold tracking-tight sm:text-lg">
                Interview Coach
              </h1>

              <p className="font-mono text-[10px] uppercase tracking-wide text-[#6b6b7a]">
                AI-powered practice
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[#1e1e24] bg-[#111114] px-3 py-2 sm:flex">
              <div className="h-1 w-20 overflow-hidden rounded-full bg-[#27272f]">
                <div
                  className="h-full rounded-full bg-[#39ff6e] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="font-mono text-[11px] text-[#9898a8]">
                {currentQuestion}/{TOTAL_QUESTIONS}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="border-[#27272f] bg-[#111114] text-[#e8e8f0] hover:border-[#39ff6e55] hover:bg-[#16161a] hover:text-[#39ff6e]"
            >
              Reset
            </Button>
          </div>
        </header>

        <Card className="mb-5 rounded-xl border-[#1e1e24] bg-[#111114] text-[#e8e8f0] shadow-[0_0_24px_rgba(57,255,110,0.04)]">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-9 w-1 rounded-full bg-[#39ff6e]" />

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6b6b7a]">
                Target role
              </p>

              <p className="mt-1 text-sm font-semibold text-[#e8e8f0]">
                {jobTitle || "Loading interview..."}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4 flex items-center gap-2 sm:hidden">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#27272f]">
            <div
              className="h-full rounded-full bg-[#39ff6e] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="font-mono text-[10px] text-[#9898a8]">
            Q{currentQuestion}/{TOTAL_QUESTIONS}
          </span>
        </div>

        <Card className="flex flex-1 flex-col overflow-hidden rounded-2xl border-[#1e1e24] bg-[#0d0d10] text-[#e8e8f0]">
          <CardContent className="flex flex-1 flex-col p-0">
            <ScrollArea className="h-[440px] flex-1 px-4 py-5 sm:px-6">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <QuestionCard
                    key={`${message.role}-${index}`}
                    role={message.role}
                    text={message.text}
                  />
                ))}

                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#39ff6e44] bg-[#39ff6e0d]">
                      <span className="font-mono text-xs font-bold text-[#39ff6e]">
                        AI
                      </span>
                    </div>

                    <div>
                      <p className="mb-2 font-mono text-[11px] text-[#39ff6e]">
                        Interview Coach is thinking...
                      </p>

                      <div className="flex gap-1.5 rounded-2xl rounded-bl-none border border-[#1e1e24] bg-[#111114] px-4 py-3">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#39ff6e]" />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-[#39ff6e]"
                          style={{ animationDelay: "150ms" }}
                        />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-[#39ff6e]"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={conversationEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-[#1a1a20] bg-[#0d0d10] p-4 sm:p-5">
              {error && (
                <p className="mb-3 text-sm text-red-400">
                  {error}
                </p>
              )}

             {complete ? (
  <p className="text-center text-sm font-medium text-blue-400">
    Interview complete — your feedback is above.
  </p>
) : (
  <AnswerForm
    onSubmitAnswer={handleAnswer}
    loading={loading}
  />
)}

              <p className="mt-3 text-center font-mono text-[10px] text-[#6b6b7a]">
                Interview Coach · Practice tailored to your target role
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
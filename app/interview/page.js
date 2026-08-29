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
      text: "I’m Tina. I help you choose the right insurance policy. May I ask you a few personal questions to make sure I recommend the best policy for you?",
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
    <main className="min-h-screen bg-[#f3f6f8] px-4 py-4 text-[#142536] sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-4xl flex-col sm:min-h-[calc(100vh-4rem)]">
        <header className="mb-5 flex items-center justify-between border-b-4 border-[#f58220] bg-[#082f4f] px-4 py-4 shadow-sm sm:rounded-lg sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f58220]">
              <span className="text-sm font-extrabold text-white">
                T
              </span>
            </div>

            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                Tina Insurance Assistant
              </h1>

              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#b9d7e8]">
                Turners Car Insurance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-2 sm:flex">
              <div className="h-1 w-20 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-[#f58220] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="font-mono text-[11px] text-[#d8e7f0]">
                {currentQuestion}/{TOTAL_QUESTIONS}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
            >
              Reset
            </Button>
          </div>
        </header>

        <Card className="mb-5 rounded-lg border border-[#d7e0e6] bg-white text-[#142536] shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-9 w-1 rounded-full bg-[#f58220]" />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0073b9]">
                Your conversation
              </p>

              <p className="mt-1 text-sm font-semibold text-[#29465b]">
                Personalised insurance guidance with Tina
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4 flex items-center gap-2 sm:hidden">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-[#f58220] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="font-mono text-[10px] text-[#d8e7f0]">
            Q{currentQuestion}/{TOTAL_QUESTIONS}
          </span>
        </div>

        <Card className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[#d7e0e6] bg-white text-[#142536] shadow-[0_14px_40px_rgba(8,47,79,0.08)]">
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
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0073b9]">
                      <span className="text-xs font-extrabold text-white">
                        AI
                      </span>
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] font-bold text-[#0073b9]">
                        Tina is thinking...
                      </p>

                      <div className="flex gap-1.5 rounded-xl rounded-tl-sm border border-[#cddce5] bg-[#f7fafb] px-4 py-3">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#f58220]" />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-[#f58220]"
                          style={{ animationDelay: "150ms" }}
                        />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-[#f58220]"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={conversationEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-[#d7e0e6] bg-[#f7fafb] p-4 sm:p-5">
              {error && (
                <p className="mb-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

             {complete ? (
  <p className="text-center text-sm font-semibold text-[#0073b9]">
    Your insurance recommendation is ready above.
  </p>
) : (
  <AnswerForm
    onSubmitAnswer={handleAnswer}
    loading={loading}
  />
)}

              <p className="mt-3 text-center text-[10px] font-medium text-[#6b7c88]">
                Tina · Turners Car Insurance guidance
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  function handleStartInterview(event) {
    event.preventDefault();

    const cleanJobTitle = jobTitle.trim();

    if (!cleanJobTitle) {
      setError("Please enter a job title.");
      return;
    }

    sessionStorage.setItem("interviewJobTitle", cleanJobTitle);

    router.push("/interview");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0b] px-4 text-[#e8e8f0]">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#39ff6e44] bg-[#39ff6e0d]">
            <span className="text-lg font-bold text-[#39ff6e]">
              AI
            </span>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#6b6b7a]">
              Turners career development
            </p>

            <p className="text-sm text-[#9898a8]">
              Interview preparation powered by AI
            </p>
          </div>
        </div>

        <Card className="overflow-hidden rounded-2xl border-[#1e1e24] bg-[#111114] text-[#e8e8f0] shadow-[0_0_40px_rgba(57,255,110,0.06)]">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#39ff6e] to-transparent" />

          <CardHeader className="space-y-3 px-6 pb-4 pt-8 sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#39ff6e]">
              Start a practice session
            </p>

            <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
              Interview Coach
            </CardTitle>

            <CardDescription className="text-sm leading-6 text-[#9898a8]">
              Practice answering interview questions tailored to your
              next role and receive feedback on your responses.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 pt-2 sm:px-8">
            <form onSubmit={handleStartInterview} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="jobTitle"
                  className="font-mono text-xs uppercase tracking-[0.16em] text-[#9898a8]"
                >
                  Target role
                </label>

                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="e.g. Insurance Claims Assessor"
                  value={jobTitle}
                  onChange={(event) => {
                    setJobTitle(event.target.value);
                    setError("");
                  }}
                  className={`h-12 rounded-xl bg-[#0a0a0b] px-4 text-[#e8e8f0] placeholder:text-[#4b4b58] focus-visible:ring-[#39ff6e55] ${
                    error
                      ? "border-red-500/70"
                      : "border-[#1e1e24] focus-visible:border-[#39ff6e]"
                  }`}
                />

                {error && (
                  <p className="text-sm text-red-400">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-[#39ff6e] font-semibold text-[#0a0a0b] transition-colors hover:bg-[#61ff89]"
              >
                Start Interview
              </Button>

              <p className="text-center font-mono text-[11px] text-[#6b6b7a]">
                Your interview begins with six role-focused questions.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
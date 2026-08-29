"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  function handleStartChat() {
    // Temporary compatibility value while the Mission 3 chat page is converted.
    sessionStorage.setItem("interviewJobTitle", "Insurance consultation");
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
              Turners Car Insurance
            </p>

            <p className="text-sm text-[#9898a8]">
              Insurance guidance powered by AI
            </p>
          </div>
        </div>

        <Card className="overflow-hidden rounded-2xl border-[#1e1e24] bg-[#111114] text-[#e8e8f0] shadow-[0_0_40px_rgba(57,255,110,0.06)]">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#39ff6e] to-transparent" />

          <CardHeader className="space-y-3 px-6 pb-4 pt-8 sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#39ff6e]">
              Find suitable cover
            </p>

            <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
              Meet Tina
            </CardTitle>

            <CardDescription className="text-sm leading-6 text-[#9898a8]">
              Chat with Tina about your vehicle and coverage needs to
              receive a personalised insurance recommendation.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 pt-2 sm:px-8">
            <Button
              type="button"
              onClick={handleStartChat}
              className="h-12 w-full rounded-xl bg-[#39ff6e] font-semibold text-[#0a0a0b] transition-colors hover:bg-[#61ff89]"
            >
              Chat with Tina
            </Button>

            <p className="mt-4 text-center font-mono text-[11px] text-[#6b6b7a]">
              Tina will ask permission before collecting any information.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

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
    sessionStorage.setItem("interviewJobTitle", "Insurance consultation");
    router.push("/interview");
  }

  return (
    <main className="min-h-screen bg-[#f3f6f8] text-[#142536]">
      <header className="border-b-4 border-[#f58220] bg-[#082f4f]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f58220] text-lg font-black text-white">
              T
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight text-white">
                Turners
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b9d7e8]">
                Car Insurance
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-sm font-medium text-white sm:flex">
            <ShieldCheck className="h-5 w-5 text-[#f58220]" />
            AI-assisted insurance guidance
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-[#0073b9]">
            Find cover that fits
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-[#082f4f] sm:text-5xl">
            Meet Tina, your digital insurance consultant.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#536675]">
            Answer a few simple questions about your vehicle and the cover
            you need. Tina will then explain which Turners insurance options
            may suit you and why.
          </p>

          <div className="mt-7 space-y-3 text-sm font-semibold text-[#29465b]">
            <p className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#0073b9]" />
              Personalised guidance based on your answers
            </p>
            <p className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#0073b9]" />
              Clear reasons behind every recommendation
            </p>
            <p className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#0073b9]" />
              You choose whether to continue before questions begin
            </p>
          </div>
        </div>

        <Card className="overflow-hidden rounded-xl border border-[#d7e0e6] bg-white text-[#142536] shadow-[0_18px_50px_rgba(8,47,79,0.12)]">
          <div className="h-2 bg-[#0073b9]" />
          <CardHeader className="space-y-4 px-6 pb-4 pt-8 sm:px-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f3f9] text-xl font-extrabold text-[#0073b9]">
              T
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-[#082f4f]">
              Hi, I’m Tina
            </CardTitle>
            <CardDescription className="text-base leading-7 text-[#536675]">
              I can help you compare Mechanical Breakdown, Comprehensive,
              and Third Party Car Insurance.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 pt-2 sm:px-8">
            <Button
              type="button"
              onClick={handleStartChat}
              className="h-12 w-full rounded-md bg-[#f58220] text-base font-bold text-white shadow-sm transition-colors hover:bg-[#d9680f]"
            >
              Chat with Tina
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="mt-4 text-center text-xs leading-5 text-[#6b7c88]">
              Tina will ask permission before collecting any information.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

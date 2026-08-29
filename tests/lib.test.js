import { describe, it, expect } from "vitest";
import {
  interviewerInstruction,
  evaluatorInstruction,
  FIRST_QUESTION,
} from "@/lib/prompts";
import { askGemini } from "@/lib/gemini";
import { validateInterviewRequest, countQuestionsAsked } from "@/lib/validators";
import { cleanReply, buildResponse } from "@/lib/formatters";

describe("Tina insurance prompts", () => {
  it("opens with the required opt-in question", () => {
    expect(FIRST_QUESTION).toContain("I’m Tina");
    expect(FIRST_QUESTION).toContain("May I ask you");
  });

  it("creates adaptive consultant instructions with the product rules", () => {
    const text = interviewerInstruction();

    expect(text).toContain("Ask exactly one short question");
    expect(text).toContain("do not follow a hardcoded script");
    expect(text).toContain("Never recommend MBI for a truck or racing car");
    expect(text).toContain("10 years old or older");
    expect(text).toContain("Third Party Car Insurance");
  });

  it("creates a final recommendation instruction", () => {
    const text = evaluatorInstruction();

    expect(text).toContain("RECOMMENDATION EVALUATOR");
    expect(text).toContain("Do not ask another question");
    expect(text).toContain("confirm policy wording and eligibility with Turners");
  });
});

describe("askGemini", () => {
  it("throws when GEMINI_API_KEY is missing", async () => {
    const previous = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    try {
      await expect(
        askGemini({
          jobTitle: "Insurance consultation",
          history: [],
          systemInstruction: "test",
        })
      ).rejects.toThrow("GEMINI_API_KEY is not set");
    } finally {
      if (previous === undefined) {
        delete process.env.GEMINI_API_KEY;
      } else {
        process.env.GEMINI_API_KEY = previous;
      }
    }
  });
});

describe("validateInterviewRequest", () => {
  it("accepts an insurance conversation and maps Tina to model", () => {
    const result = validateInterviewRequest({
      jobTitle: "Insurance consultation",
      history: [
        { role: "interviewer", text: FIRST_QUESTION },
        { role: "user", text: "Yes, that is okay." },
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.value.history[0].role).toBe("model");
  });

  it("rejects an empty consultation identifier", () => {
    const result = validateInterviewRequest({ jobTitle: "", history: [] });

    expect(result.ok).toBe(false);
  });
});

describe("cleanReply", () => {
  it("removes markdown noise", () => {
    expect(cleanReply("**Hello**")).toBe("Hello");
  });
});

describe("buildResponse", () => {
  it("builds a clean response object", () => {
    const result = buildResponse({
      reply: "**Hi**",
      questionNumber: 2,
      isComplete: 0,
    });

    expect(result.reply).toBe("Hi");
    expect(result.questionNumber).toBe(2);
    expect(result.isComplete).toBe(false);
  });
});

describe("countQuestionsAsked", () => {
  it("counts only model messages", () => {
    const history = [
      { role: "model", text: "Q1" },
      { role: "user", text: "A1" },
      { role: "model", text: "Q2" },
      { role: "user", text: "A2" },
    ];

    expect(countQuestionsAsked(history)).toBe(2);
  });
});

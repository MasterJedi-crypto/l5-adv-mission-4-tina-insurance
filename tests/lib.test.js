import { describe, it, expect } from "vitest";
import {
  interviewerInstruction,
  evaluatorInstruction,
  FIRST_QUESTION,
  TOTAL_QUESTIONS,
} from "@/lib/prompts";
import { askGemini } from "@/lib/gemini";
import { validateInterviewRequest, countQuestionsAsked } from "@/lib/validators";
import { cleanReply, buildResponse } from "@/lib/formatters";

describe("interview prompts", () => {
  it("opens with a fixed first question and a six-question interview", () => {
    expect(FIRST_QUESTION).toContain("Tell me about yourself");
    expect(TOTAL_QUESTIONS).toBe(6);
  });

  it("builds interviewer instructions for the role and question number", () => {
    const text = interviewerInstruction("Frontend Developer", 2);

    expect(text).toContain("Frontend Developer");
    expect(text).toContain("question 2 of 6");
    expect(text).toContain("Ask exactly one question");
    expect(text).not.toContain("EVALUATOR");
  });

  it("builds evaluator instructions after the interview is over", () => {
    const text = evaluatorInstruction("Frontend Developer");

    expect(text).toContain("EVALUATOR");
    expect(text).toContain("Frontend Developer");
    expect(text).toContain("answered all 6 questions");
    expect(text).toContain("Do NOT ask another question");
  });
});

describe("askGemini", () => {
  it("throws when GEMINI_API_KEY is missing", async () => {
    const previous = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    try {
      await expect(
        askGemini({
          jobTitle: "Frontend Developer",
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
  it("accepts a job title and history, and maps interviewer to model", () => {
    const result = validateInterviewRequest({
      jobTitle: "Frontend Developer",
      history: [
        { role: "interviewer", text: "Tell me about yourself." },
        { role: "user", text: "I switched into software this year." },
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.value.history[0].role).toBe("model");
  });

  it("rejects empty job titles", () => {
    const result = validateInterviewRequest({ jobTitle: "", history: [] });

    expect(result.ok).toBe(false);
    expect(result.error).toBe(
      "Please enter a job title before starting the interview."
    );
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
    expect(result.isComplete).toBe(false); // Boolean(0)
  });
});

describe("countQuestionsAsked", () => {
  it("counts only model questions", () => {
    const history = [
      { role: "model", text: "Q1" },
      { role: "user", text: "A1" },
      { role: "model", text: "Q2" },
      { role: "user", text: "A2" },
    ];

    expect(countQuestionsAsked(history)).toBe(2);
  });
});



import { describe, it, expect } from "vitest";

import {
  interviewerInstruction,
  FIRST_QUESTION,
} from "@/lib/prompts";

import { askGemini } from "@/lib/gemini";

import {
  validateInterviewRequest,
  countQuestionsAsked,
} from "@/lib/validators";

import {
  cleanReply,
  buildResponse,
  parseInsuranceReply,
  RESPONSE_STATES,
} from "@/lib/formatters";

describe("Tina insurance prompts", () => {
  it("opens with the required opt-in question", () => {
    expect(FIRST_QUESTION).toContain("I’m Tina");
    expect(FIRST_QUESTION).toContain("May I ask you");
  });

  it("creates adaptive consultant instructions with product rules", () => {
    const text = interviewerInstruction();

    expect(text).toContain("Ask exactly one short question");
    expect(text).toContain("Do not follow a fixed or hardcoded");
    expect(text).toContain(
      "Never recommend MBI for a truck or racing car"
    );
    expect(text).toContain("10 years old or older");
    expect(text).toContain("Third Party Car Insurance");
  });

  it("defines the three response states", () => {
    const text = interviewerInstruction();

    expect(text).toContain("QUESTION|");
    expect(text).toContain("RECOMMENDATION|");
    expect(text).toContain("DECLINED|");
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
        {
          role: "interviewer",
          text: FIRST_QUESTION,
        },
        {
          role: "user",
          text: "Yes, that is okay.",
        },
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.value.history[0].role).toBe("model");
  });

  it("rejects an empty consultation identifier", () => {
    const result = validateInterviewRequest({
      jobTitle: "",
      history: [],
    });

    expect(result.ok).toBe(false);
  });
});

describe("cleanReply", () => {
  it("removes markdown noise", () => {
    expect(cleanReply("**Hello**")).toBe("Hello");
  });
});

describe("parseInsuranceReply", () => {
  it("parses a question response", () => {
    const result = parseInsuranceReply(
      "QUESTION|What type of vehicle do you drive?"
    );

    expect(result.state).toBe(RESPONSE_STATES.QUESTION);
    expect(result.reply).toBe(
      "What type of vehicle do you drive?"
    );
  });

  it("parses a final recommendation", () => {
    const result = parseInsuranceReply(
      "RECOMMENDATION|Third Party Car Insurance may suit you."
    );

    expect(result.state).toBe(
      RESPONSE_STATES.RECOMMENDATION
    );

    expect(result.reply).toContain(
      "Third Party Car Insurance"
    );
  });

  it("parses declined consent", () => {
    const result = parseInsuranceReply(
      "DECLINED|No problem. I will not collect further information."
    );

    expect(result.state).toBe(RESPONSE_STATES.DECLINED);
  });

  it("defaults to question when Gemini omits the marker", () => {
    const result = parseInsuranceReply(
      "What age is your vehicle?"
    );

    expect(result.state).toBe(RESPONSE_STATES.QUESTION);
  });
});

describe("buildResponse", () => {
  it("builds an active question response", () => {
    const result = buildResponse({
      reply: "**What vehicle do you drive?**",
      state: RESPONSE_STATES.QUESTION,
      questionNumber: 2,
    });

    expect(result.reply).toBe(
      "What vehicle do you drive?"
    );

    expect(result.state).toBe("question");
    expect(result.questionNumber).toBe(2);
    expect(result.isComplete).toBe(false);
  });

  it("marks a recommendation as complete", () => {
    const result = buildResponse({
      reply: "Third Party Car Insurance may suit you.",
      state: RESPONSE_STATES.RECOMMENDATION,
      questionNumber: 4,
    });

    expect(result.state).toBe("recommendation");
    expect(result.isComplete).toBe(true);
  });

  it("marks declined consent as complete", () => {
    const result = buildResponse({
      reply: "No problem.",
      state: RESPONSE_STATES.DECLINED,
      questionNumber: 1,
    });

    expect(result.state).toBe("declined");
    expect(result.isComplete).toBe(true);
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
/**
 * POST /api/interview
 *
 * Request:
 * {
 *   jobTitle: string,
 *   history: [{ role: "user" | "model", text: string }]
 * }
 *
 * Response:
 * {
 *   reply: string,
 *   state: "question" | "recommendation" | "declined",
 *   questionNumber: number,
 *   isComplete: boolean
 * }
 */

import { askGemini } from "@/lib/gemini";
import {
  FIRST_QUESTION,
  interviewerInstruction,
} from "@/lib/prompts";
import {
  validateInterviewRequest,
  countQuestionsAsked,
} from "@/lib/validators";
import {
  buildResponse,
  buildError,
  parseInsuranceReply,
  RESPONSE_STATES,
} from "@/lib/formatters";

export const runtime = "nodejs";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return buildError("Request body must be valid JSON.", 400);
  }

  const check = validateInterviewRequest(body);

  if (!check.ok) {
    return buildError(check.error, 400);
  }

  const { jobTitle, history } = check.value;
  const questionsAsked = countQuestionsAsked(history);

  if (history.length === 0) {
    return Response.json(
      buildResponse({
        reply: FIRST_QUESTION,
        state: RESPONSE_STATES.QUESTION,
        questionNumber: 1,
      })
    );
  }

  try {
    const rawReply = await askGemini({
      jobTitle,
      history,
      systemInstruction: interviewerInstruction(),
    });

    const { reply, state } = parseInsuranceReply(rawReply);

    return Response.json(
      buildResponse({
        reply,
        state,
        questionNumber:
          state === RESPONSE_STATES.QUESTION
            ? questionsAsked + 1
            : questionsAsked,
      })
    );
  } catch (error) {
    console.error("[/api/interview]", error);

    const message = String(error?.message ?? "");

    if (/api[_ ]?key/i.test(message)) {
      return buildError(
        "The server is missing its AI credentials. Tell the team.",
        500
      );
    }

    if (/quota|rate|429|RESOURCE_EXHAUSTED/i.test(message)) {
      return buildError(
        "The AI service is busy right now. Wait a moment and try again.",
        429
      );
    }

    return buildError(
      "The AI service did not respond. Please try again.",
      502
    );
  }
}
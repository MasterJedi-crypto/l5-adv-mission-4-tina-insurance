/**
 * Response formatting helpers.
 */

export const RESPONSE_STATES = {
  QUESTION: "question",
  RECOMMENDATION: "recommendation",
  DECLINED: "declined",
};

export function cleanReply(raw) {
  let out = String(raw ?? "").trim();

  out = out
    .replace(/^```[a-z]*\s*\n?/i, "")
    .replace(/\n?```\s*$/, "");

  out = out.replace(
    /^\s*(interviewer|question|q)\s*\d*\s*[:.—-]\s*/i,
    ""
  );

  out = out.replace(/^["'“‘]([\s\S]+)["'”’]$/, "$1");

  out = out
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(?<!\*)\*(?!\s)(.+?)(?<!\s)\*/g, "$1");

  out = out.replace(/^[\s]*[-*•]\s+/gm, "");
  out = out.replace(/\n{3,}/g, "\n\n");

  return out.trim();
}

/**
 * Gemini replies with:
 * QUESTION|message
 * RECOMMENDATION|message
 * DECLINED|message
 */
export function parseInsuranceReply(raw) {
  const text = String(raw ?? "").trim();

  const match = text.match(
    /^(QUESTION|RECOMMENDATION|DECLINED)\s*\|\s*/i
  );

  const state = match
    ? match[1].toLowerCase()
    : RESPONSE_STATES.QUESTION;

  const reply = match
    ? text.slice(match[0].length)
    : text;

  return {
    reply: cleanReply(reply),
    state,
  };
}

/**
 * questionNumber remains temporarily so the existing frontend still works.
 */
export function buildResponse({
  reply,
  state = RESPONSE_STATES.QUESTION,
  questionNumber,
}) {
  const validState = Object.values(RESPONSE_STATES).includes(state)
    ? state
    : RESPONSE_STATES.QUESTION;

  return {
    reply: cleanReply(reply),
    state: validState,
    questionNumber,
    isComplete: validState !== RESPONSE_STATES.QUESTION,
  };
}

export function buildError(message, status = 400) {
  return Response.json({ error: message }, { status });
}
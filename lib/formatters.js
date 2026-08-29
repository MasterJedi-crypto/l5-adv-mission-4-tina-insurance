/**
 * Response formatting. 
 */

/**
 * @param {string} raw the model's text
 * @returns {string} clean plain text ready to display
 */
export function cleanReply(raw) {
  let out = String(raw ?? '').trim()

  // ```  or ```text fences
  out = out.replace(/^```[a-z]*\s*\n?/i, '').replace(/\n?```\s*$/, '')

  // "Interviewer:", "Question 3:", "Q4." at the start
  out = out.replace(/^\s*(interviewer|question|q)\s*\d*\s*[:.—-]\s*/i, '')

  // Surrounding quotes the model sometimes adds
  out = out.replace(/^["'“‘]([\s\S]+)["'”’]$/, '$1')

  // **bold** and *italics* wrappers — keep the words, drop the markers
  out = out.replace(/\*\*(.+?)\*\*/g, '$1').replace(/(?<!\*)\*(?!\s)(.+?)(?<!\s)\*/g, '$1')

  // Bullet characters at the start of a line
  out = out.replace(/^[\s]*[-*•]\s+/gm, '')

  // Collapse runs of blank lines
  out = out.replace(/\n{3,}/g, '\n\n')

  return out.trim()
}

/**
 * The one response shape the interface consumes. Keep every return path in the route going through this so the contract cannot drift.
 *
 * @param {object}  args
 * @param {string}  args.reply
 * @param {number}  args.questionNumber
 * @param {boolean} args.isComplete
 */
export function buildResponse({ reply, questionNumber, isComplete }) {
  return {
    reply: cleanReply(reply),
    questionNumber,
    isComplete: Boolean(isComplete),
  }
}

/** Error responses share one shape too, so the interface has one thing to read. */
export function buildError(message, status = 400) {
  return Response.json({ error: message }, { status })
}


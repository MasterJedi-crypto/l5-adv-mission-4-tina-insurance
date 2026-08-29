/**
 * Request validation.
 * this file checks if the request is a real interview
 */

// caps for fixed settings
export const MAX_JOB_TITLE = 100
export const MAX_ANSWER = 2000
export const MAX_HISTORY = 40 // 6 questions + 6 answers is 12; 40 is a good ceiling


/**
 * the frontend interface uses role: "interviewer", while Gemini's API needs "model"
 * instead of renaming, we accept either and normalise here.
 * The response we send back is unchanged, so nothing on the frontend side has to move.
 */
const ROLE_ALIASES = {
  model: 'model',
  interviewer: 'model',
  feedback: 'model',
  assistant: 'model',
  ai: 'model',
  user: 'user',
  candidate: 'user',
}

//checking for text and trimming both ends same for lower,upper cases
function normaliseRole(role) {
  return typeof role === 'string' ? ROLE_ALIASES[role.trim().toLowerCase()] : undefined
}

/**
 * @param {unknown} body parsed JSON from the request
 * @returns {{ ok: true, value: { jobTitle: string, history: Array } }
 *          | { ok: false, error: string }}
 */

// checking the body is an object
export function validateInterviewRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return fail('Request body must be a JSON object.')
  }

  // jobtitle text and lenght
  const jobTitle = typeof body.jobTitle === 'string' ? body.jobTitle.trim() : ''
  if (!jobTitle) {
    return fail('Please enter a job title before starting the interview.')
  }
  if (jobTitle.length > MAX_JOB_TITLE) {
    return fail(`Job title must be ${MAX_JOB_TITLE} characters or fewer.`)
  }

  // history
  const history = body.history
  if (!Array.isArray(history)) {
    return fail('History must be an array.')
  }
  if (history.length > MAX_HISTORY) {
    return fail('This interview has run too long. Please start a new one.')
  }

  // checking entry inside the loop
  const clean = []

  for (let i = 0; i < history.length; i++) {
    const entry = history[i]
    if (!entry || typeof entry !== 'object') {
      return fail(`History entry ${i} must be an object.`)
    }
    const role = normaliseRole(entry.role)
    if (!role) {
      return fail(`History entry ${i} has an invalid role. Use "user" or "interviewer".`)
    }
    if (typeof entry.text !== 'string' || !entry.text.trim()) {
      return fail(`History entry ${i} is missing text.`)
    }
    if (role === 'user' && entry.text.length > MAX_ANSWER) {
      return fail(`Answers must be ${MAX_ANSWER} characters or fewer.`)
    }
    clean.push({ role, text: entry.text.trim() })
  }

  // shape of the conversation, the interview goes interviewer-candidate-interviewer-candidate..

  if (clean.length > 0) {
    if (clean[0].role !== 'model') {
      return fail('History must start with the interviewer.')
    }
    if (clean[clean.length - 1].role !== 'user') {
      return fail('History must end with the candidate’s answer.')
    }
  }

  return { ok: true, value: { jobTitle, history: clean } }
}

// how many questions the interviewer has asked so far, the six question rule
export function countQuestionsAsked(history) {
  return history.filter((m) => m.role === 'model').length
}

function fail(error) {
  return { ok: false, error }
}

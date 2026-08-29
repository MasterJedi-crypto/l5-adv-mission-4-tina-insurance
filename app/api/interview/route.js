/**
 * POST /api/interview   
 *
 * this file receives the job title and the conversation. then checks the request is sane and workout what should happen next, ask google and send the answer back.
 * Request   { jobTitle: string, history: [{ role: 'user'|'model', text: string }] }
 * Response  { reply: string, questionNumber: number, isComplete: boolean }
 * Error     { error: string }  with status 400, 429 or 502
 */

import { askGemini } from '@/lib/gemini'
import { interviewerInstruction, evaluatorInstruction, FIRST_QUESTION, TOTAL_QUESTIONS } from '@/lib/prompts'
import { validateInterviewRequest, countQuestionsAsked } from '@/lib/validators'
import { buildResponse, buildError } from '@/lib/formatters'

// Gemini SDK needs Node
export const runtime = 'nodejs'

// as it takes time, using async to pause the function without freezing the server for the user.
// the raw text is turned into a javascript object
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return buildError('Request body must be valid JSON.', 400)
  }

  // checking the request (validator.js)
  const check = validateInterviewRequest(body)
  if (!check.ok) return buildError(check.error, 400)

  //pulling the values out, destructuring
  const { jobTitle, history } = check.value
  const asked = countQuestionsAsked(history)

  // question 1, zero questions as the interview hasnt started, return firt at prompts.js. 
  if (asked === 0) {
    return Response.json(
      buildResponse({ reply: FIRST_QUESTION, questionNumber: 1, isComplete: false })
    )
  }

  
  // Six questions asked and six answered means the interview is over, imported from prompts.js
  // The model never decides when to stop.
  const isComplete = asked >= TOTAL_QUESTIONS

  const systemInstruction = isComplete
    ? evaluatorInstruction(jobTitle, TOTAL_QUESTIONS)
    : interviewerInstruction(jobTitle, asked + 1, TOTAL_QUESTIONS)

   // calling google and replying wrapping the SDK 
  try {
    const reply = await askGemini({ jobTitle, history, systemInstruction })

    return Response.json(
      buildResponse({
        reply,
        questionNumber: isComplete ? TOTAL_QUESTIONS : asked + 1,
        isComplete,
      })
    )
  } catch (err) {
    // Log the real error, show the user something they can act on
    console.error('[/api/interview]', err)

    const message = String(err?.message ?? '')

    if (/api[_ ]?key/i.test(message)) {
      return buildError('The server is missing its AI credentials. Tell the team.', 500)
    }
    if (/quota|rate|429|RESOURCE_EXHAUSTED/i.test(message)) {
      return buildError('The AI service is busy right now. Wait a moment and try again.', 429)
    }
    return buildError('The AI service did not respond. Please try again.', 502)
  }
}

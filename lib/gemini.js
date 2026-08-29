/**
 * all gemini things lives here
 */

import { GoogleGenAI } from '@google/genai'

// using gemini-3.5-flash-lite 
// follow-up questions. Start on lite, switch if the questions feel shallow?
export const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'

let client

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to .env.local locally, and to the ' +
        'Vercel project settings for deployments.'
    )
  }
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  return client
}

/**
 * Gemini expects the conversation to start with a user turn, so the roles alternate: user, model, user, model, ...
 */
export function buildContents(jobTitle, history) {
  return [
    {
      role: 'user',
      parts: [{ text: `I am interviewing for the role of "${jobTitle}". Please interview me.` }],
    },
    ...history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
  ]
}

/**
 * One call to Gemini.
 *
 * @param {object}   args
 * @param {string}   args.jobTitle          free-text role the candidate typed
 * @param {Array}    args.history           [{ role: 'user'|'model', text: string }]
 * @param {string}   args.systemInstruction interviewer or evaluator instruction
 * @returns {Promise<string>} the model's raw text
 */
export async function askGemini({ jobTitle, history, systemInstruction }) {
  
  //mock test, to dont burn tokens
  if (process.env.MOCK_AI === 'true') {
    return mockReply(jobTitle, history, systemInstruction)
  }

  const ai = getClient()

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: buildContents(jobTitle, history),
    config: {
      systemInstruction,
      temperature: 0.9, // higher = more varied follow-ups between runs
      maxOutputTokens: 500,
    },
  })

  const text = response.text?.trim()
  if (!text) throw new Error('Gemini returned an empty response.')
  return text
}

function mockReply(jobTitle, history, systemInstruction) {
  const asked = history.filter((m) => m.role === 'model').length
  if (systemInstruction.includes('EVALUATOR')) {
    return (
      `Thanks for your time. Overall you answered clearly and stayed relevant to the ` +
      `${jobTitle} role. Your strongest answer was the one about handling pressure. ` +
      `To improve: use the STAR structure, describe the Situation, the Task, the ` +
      `Action you took and the Result, and include a specific number or outcome ` +
      `wherever you can. Your answers would also land better if you tied each one ` +
      `back to what a ${jobTitle} actually does day to day.`
    )
  }
  return `[MOCK question ${asked + 1}] What part of working as a ${jobTitle} do you expect to find most difficult, and why?`
}

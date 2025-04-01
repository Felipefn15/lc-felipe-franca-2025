'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const generatePostDraft = async (keywords: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: `Generate a post draft for the following keywords: ${keywords}` }],
  })
  console.log({response})
  return response.choices[0].message.content
}
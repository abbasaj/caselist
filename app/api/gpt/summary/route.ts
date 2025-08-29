// app/api/gpt/summary/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, brief, specialization } = await req.json();

    if (!brief) {
      return NextResponse.json({ error: 'Brief description is required' }, { status: 400 });
    }

    const prompt = `
      Based on the following information, generate a concise and formal case summary suitable for a lawyer to review.
      
      - Case Title: ${title || 'Unnamed Case'}
      - Specialization: ${specialization || 'General'}
      - Client's Description: ${brief}

      Please format the output as a formal summary, including a "Case Summary" header.
      `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or 'gpt-4' if you have access
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 500,
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

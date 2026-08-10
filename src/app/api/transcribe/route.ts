import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured on the server.' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided in request.' },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey });

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: 'whisper-large-v3',
      response_format: 'json',
    });

    return NextResponse.json({ text: transcription.text || '' });
  } catch (err: any) {
    const isRateLimit = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('rate limit');
    return NextResponse.json(
      {
        error: isRateLimit ? 'Groq Whisper rate limit exceeded. Please try again shortly.' : err?.message || 'Server error proxying Groq Whisper transcription.',
        rateLimited: isRateLimit,
      },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}

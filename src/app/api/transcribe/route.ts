import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: NextRequest) {
  console.log('[API/Transcribe] Request received. GROQ_API_KEY present:', Boolean(process.env.GROQ_API_KEY));

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn('[API/Transcribe] GROQ_API_KEY is not configured in process.env');
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured on the server.' },
        { status: 400 }
      );
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (formErr: any) {
      console.error('[API/Transcribe] Failed to parse FormData:', formErr?.stack || formErr?.message || formErr);
      return NextResponse.json(
        { error: 'Invalid or empty FormData payload in request.' },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File | null;

    if (!file) {
      console.error('[API/Transcribe] No audio file attached in request form data.');
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
    console.error('[API/Transcribe Route Error]:', err?.stack || err?.message || err);
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

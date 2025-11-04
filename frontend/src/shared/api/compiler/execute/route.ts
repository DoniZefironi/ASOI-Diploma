// frontend/src/app/api/compiler/execute/route.ts
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch('http://localhost:2904/compiler/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response;
}
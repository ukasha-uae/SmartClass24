'use client';

import type { User } from 'firebase/auth';

function getCallableBaseUrl(): string {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not configured.');
  }
  return `https://us-central1-${projectId}.cloudfunctions.net`;
}

export async function callCallableFunction<TReq extends Record<string, unknown>, TRes>(
  functionName: string,
  payload: TReq,
  user: User
): Promise<TRes> {
  const token = await user.getIdToken(true);
  const res = await fetch(`${getCallableBaseUrl()}/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: payload }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    result?: TRes | { data: TRes };
    error?: { message?: string };
  };

  if (!res.ok || body.error) {
    throw new Error(body.error?.message || `Callable ${functionName} failed`);
  }

  if (body.result == null) {
    throw new Error(`Callable ${functionName} returned no result`);
  }

  const maybeNested = body.result as { data?: TRes };
  return (maybeNested.data ?? body.result) as TRes;
}

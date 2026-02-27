'use client';

import type { User } from 'firebase/auth';

function getCallableBaseUrl(): string {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not configured.');
  }
  const emulatorOrigin = process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_ORIGIN?.trim();
  if (emulatorOrigin) {
    return `${emulatorOrigin.replace(/\/$/, '')}/${projectId}/us-central1`;
  }
  return `https://us-central1-${projectId}.cloudfunctions.net`;
}

export async function callCallableFunction<TReq extends Record<string, unknown>, TRes>(
  functionName: string,
  payload: TReq,
  user: User
): Promise<TRes> {
  const token = await user.getIdToken(true);
  const endpoint = `${getCallableBaseUrl()}/${functionName}`;
  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: payload }),
    });
  } catch {
    throw new Error(
      `Network error calling ${functionName}. If you are on localhost, deploy functions or run emulator and set NEXT_PUBLIC_FUNCTIONS_EMULATOR_ORIGIN=http://127.0.0.1:5001`
    );
  }

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

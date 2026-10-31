import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

interface Opponent {
  userId: string;
  userName: string;
  status: string;
}

interface Result {
  userId: string;
  userName?: string;
}

interface ChallengeDoc {
  type?: string;
  subject: string;
  difficulty?: string;
  status: string;
  creatorId: string;
  creatorName: string;
  winner?: string;
  opponents?: Opponent[];
  results?: Result[];
}

// Bots and AI opponents are driven by the web client and have no device to notify.
const isHuman = (userId: string) => !/^(bot|ai|boss)-/.test(userId);

async function sendPush(userId: string, title: string, body: string, challengeId: string): Promise<void> {
  if (!isHuman(userId)) return;
  const tokenDoc = await admin.firestore().doc(`arenaPlayers/${userId}/private/push`).get();
  const token = tokenDoc.data()?.expoPushToken as string | undefined;
  if (!token) return;

  const res = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ to: token, title, body, sound: 'default', channelId: 'default', data: { challengeId } }),
  });
  if (!res.ok) console.error(`Expo push failed for ${userId}: ${res.status} ${await res.text()}`);
}

// Challenges are created by the web app and the mobile app alike, so one trigger covers both.
export const notifyChallengeCreated = functions.firestore
  .document('challenges/{challengeId}')
  .onCreate(async (snap, context) => {
    const c = snap.data() as ChallengeDoc;
    const invited = (c.opponents ?? []).filter((o) => o.status === 'invited');
    await Promise.all(
      invited.map((o) =>
        sendPush(
          o.userId,
          'New challenge! ⚔️',
          `${c.creatorName} challenged you in ${c.subject}${c.difficulty ? ` (${c.difficulty})` : ''}. Tap to play.`,
          context.params.challengeId,
        ),
      ),
    );
  });

export const notifyChallengeUpdated = functions.firestore
  .document('challenges/{challengeId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data() as ChallengeDoc;
    const after = change.after.data() as ChallengeDoc;
    const id = context.params.challengeId;
    const beforeOpponents = new Map((before.opponents ?? []).map((o) => [o.userId, o.status]));

    for (const o of after.opponents ?? []) {
      const was = beforeOpponents.get(o.userId);
      if (was === 'invited' && o.status === 'accepted') {
        await sendPush(after.creatorId, 'Challenge accepted! 🎮', `${o.userName} accepted your ${after.subject} challenge. Time to play.`, id);
      } else if (was !== 'declined' && o.status === 'declined') {
        await sendPush(after.creatorId, 'Challenge declined', `${o.userName} declined your ${after.subject} challenge.`, id);
      }
    }

    const hadResult = new Set((before.results ?? []).map((r) => r.userId));
    const newResults = (after.results ?? []).filter((r) => !hadResult.has(r.userId));
    if (newResults.length === 0) return;

    const participants = [after.creatorId, ...(after.opponents ?? []).map((o) => o.userId)];
    const justCompleted = after.status === 'completed' && before.status !== 'completed';

    if (justCompleted) {
      await Promise.all(
        participants.map((uid) =>
          sendPush(
            uid,
            'Challenge result is in 🏆',
            uid === after.winner ? `You won your ${after.subject} challenge! Tap to see the scores.` : `Your ${after.subject} challenge is finished. Tap to see who won.`,
            id,
          ),
        ),
      );
      return;
    }

    for (const r of newResults) {
      await Promise.all(
        participants
          .filter((uid) => uid !== r.userId)
          .map((uid) => sendPush(uid, 'Your turn! ⚔️', `${r.userName ?? 'Your friend'} finished the ${after.subject} challenge. Beat their score!`, id)),
      );
    }
  });

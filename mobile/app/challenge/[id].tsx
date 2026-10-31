import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { checkGameQuestionAnswer } from '@shared/challenge-domain';
import {
  acceptChallenge,
  type Challenge,
  declineChallenge,
  type GameQuestion,
  type PlayerAnswer,
  submitAnswers,
  subscribeToChallenge,
  viewOf,
} from '../../src/lib/web-challenges';
import { useSession } from '../../src/lib/session';
import { Card, Chip, GhostButton, PrimaryButton, ProgressBar, Screen } from '../../src/ui/components';
import { theme } from '../../src/ui/theme';

// The web app gives each question this long; unanswered questions are scored as wrong.
const SECONDS_PER_QUESTION = 120;

function QuestionInput({ q, onAnswer }: { q: GameQuestion; onAnswer: (answer: string) => void }) {
  const [text, setText] = useState('');
  const optionStyle = { padding: 14, borderRadius: 12, backgroundColor: theme.tile, borderWidth: 1, borderColor: theme.border };

  if (q.type === 'mcq' && q.options) {
    return (
      <>
        {q.options.map((option, i) => (
          <Pressable key={i} onPress={() => onAnswer(option)} style={optionStyle}>
            <Text style={{ color: theme.ink }}>{option}</Text>
          </Pressable>
        ))}
      </>
    );
  }
  if (q.type === 'truefalse') {
    return (
      <>
        {['true', 'false'].map((v) => (
          <Pressable key={v} onPress={() => onAnswer(v)} style={optionStyle}>
            <Text style={{ color: theme.ink }}>{v === 'true' ? 'True' : 'False'}</Text>
          </Pressable>
        ))}
      </>
    );
  }
  return (
    <>
      <TextInput
        style={[optionStyle, { color: theme.ink }]}
        placeholder={q.type === 'number_input' ? 'Type a number' : 'Type your answer'}
        keyboardType={q.type === 'number_input' ? 'numbers-and-punctuation' : 'default'}
        value={text}
        onChangeText={setText}
      />
      {q.type === 'number_input' && (q as { unit?: string }).unit ? (
        <Text style={{ color: theme.muted }}>Unit: {(q as { unit?: string }).unit}</Text>
      ) : null}
      <PrimaryButton title="Submit answer" disabled={!text.trim()} onPress={() => onAnswer(text.trim())} />
    </>
  );
}

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { uid, profile, loading } = useSession();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(SECONDS_PER_QUESTION);
  const answers = useRef<PlayerAnswer[]>([]);
  const startedAt = useRef(0);
  const questionStartedAt = useRef(0);

  useEffect(() => {
    if (!uid) return;
    return subscribeToChallenge(
      id,
      (found) => (found ? setChallenge(found) : setError('Challenge not found.')),
      (e) => setError(e.message),
    );
  }, [id, uid]);

  const questions = challenge?.questions ?? [];
  const finishing = playing && index >= questions.length;

  const record = (answer: string | null) => {
    const q = questions[index];
    const isCorrect = answer !== null && checkGameQuestionAnswer(q, answer);
    answers.current.push({
      questionId: q.id,
      answer: answer ?? '',
      isCorrect,
      timeSpent: Date.now() - questionStartedAt.current,
      points: isCorrect ? q.points : 0,
      ...(q.conceptId ? { conceptId: q.conceptId } : {}),
      ...(q.difficulty ? { difficulty: q.difficulty } : {}),
      ...(q.subjectArea ? { subjectArea: q.subjectArea } : {}),
    });
    questionStartedAt.current = Date.now();
    setSecondsLeft(SECONDS_PER_QUESTION);
    setIndex(index + 1);
  };

  // Per-question countdown; running out records the question as unanswered.
  useEffect(() => {
    if (!playing || finishing) return;
    if (secondsLeft <= 0) return record(null);
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, finishing, secondsLeft]);

  useEffect(() => {
    if (!finishing || !challenge || !uid || !profile) return;
    submitAnswers(
      challenge.id,
      { id: uid, name: profile.name, school: profile.school },
      answers.current,
      Date.now() - startedAt.current,
    ).catch((e) => setError(e instanceof Error ? e.message : 'Failed to submit result.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishing]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <Screen>
        <Card>
          <Text style={{ color: theme.red }}>{error}</Text>
          <GhostButton title="← Home" onPress={() => router.replace('/')} />
        </Card>
      </Screen>
    );
  }
  if (loading || !challenge || !uid || !profile) return <ActivityIndicator style={{ flex: 1 }} />;

  const view = viewOf(challenge, uid);
  const friend = view.other.name;
  const total = questions.length;
  const home = <GhostButton title="← Back to Arena" onPress={() => router.replace('/')} />;
  const header = (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
      <Chip label={challenge.subject} />
      <Chip label={challenge.difficulty} />
      <Chip label={`${total} Qs`} />
    </View>
  );

  if (playing && !view.myResult) {
    // After the last answer, the result submit is still in flight.
    if (finishing) return <ActivityIndicator style={{ flex: 1 }} />;
    const q = questions[index];
    return (
      <Screen>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.muted }}>
            Question {index + 1} of {total}
          </Text>
          <Text style={{ color: secondsLeft <= 15 ? theme.red : theme.muted }}>⏱ {secondsLeft}s</Text>
        </View>
        <ProgressBar step={index + 1} total={total} />
        <Card>
          <Text style={{ fontSize: 17, color: theme.ink, fontWeight: '600' }}>{q.question}</Text>
          <QuestionInput key={q.id} q={q} onAnswer={record} />
        </Card>
      </Screen>
    );
  }

  const startPlaying = () => {
    answers.current = [];
    startedAt.current = Date.now();
    questionStartedAt.current = Date.now();
    setSecondsLeft(SECONDS_PER_QUESTION);
    setIndex(0);
    setPlaying(true);
  };

  if (view.phase === 'invited') {
    return (
      <Screen>
        <Card>
          <Text style={{ fontSize: 20, fontWeight: '700', color: theme.ink }}>⚔️ {friend} challenged you</Text>
          {header}
          <Text style={{ color: theme.muted }}>
            {challenge.creatorSchool} · {challenge.subject}
          </Text>
          <PrimaryButton
            title="Accept & play"
            disabled={busy}
            onPress={() =>
              run(async () => {
                await acceptChallenge(challenge.id, uid);
                startPlaying();
              })
            }
          />
          <GhostButton title="Decline" onPress={() => run(async () => {
            await declineChallenge(challenge, uid);
            router.replace('/');
          })} />
          {home}
        </Card>
      </Screen>
    );
  }

  if (view.phase === 'awaiting-accept') {
    return (
      <Screen>
        <Card>
          <Text style={{ fontSize: 20, fontWeight: '700', color: theme.ink }}>⏳ Waiting for {friend}</Text>
          {header}
          <Text style={{ color: theme.muted }}>
            They've been notified. The game opens here as soon as they accept.
          </Text>
          {home}
        </Card>
      </Screen>
    );
  }

  if (view.phase === 'declined') {
    return (
      <Screen>
        <Card>
          <Text style={{ fontSize: 20, fontWeight: '700', color: theme.ink }}>{friend} declined this challenge</Text>
          {home}
        </Card>
      </Screen>
    );
  }

  if (view.phase === 'your-turn') {
    return (
      <Screen>
        <Card>
          <Text style={{ fontSize: 20, fontWeight: '700', color: theme.ink }}>⚔️ vs {friend}</Text>
          {header}
          <PrimaryButton title="Start" onPress={startPlaying} />
          {home}
        </Card>
      </Screen>
    );
  }

  const mine = view.myResult;
  const theirs = view.theirResult;
  const waiting = view.phase === 'waiting-friend';
  const headline = waiting ? `⏳ Waiting for ${friend}` : view.won ? '🏆 You Won!' : `🎯 ${friend} won!`;
  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

  const ScoreCard = ({ name, score, correct, highlight }: { name: string; score: number; correct: number; highlight: boolean }) => (
    <View
      style={{
        flex: 1,
        padding: 14,
        borderRadius: theme.radius,
        gap: 6,
        backgroundColor: highlight ? '#FBE9CF' : '#E6F0FB',
        borderWidth: highlight ? 2 : 1,
        borderColor: highlight ? theme.gold : theme.border,
      }}
    >
      <Text style={{ fontWeight: '700', color: theme.ink }}>{name}</Text>
      <Text style={{ fontSize: 28, fontWeight: '800', color: theme.ink }}>
        {score}/{maxScore}
      </Text>
      <Text style={{ color: theme.green, fontWeight: '600' }}>
        {correct}/{total} correct
      </Text>
    </View>
  );

  return (
    <Screen>
      <Card>
        {header}
        <Text style={{ fontSize: 24, fontWeight: '800', color: theme.ink, textAlign: 'center' }}>{headline}</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {mine && <ScoreCard name="You" score={mine.score} correct={mine.correctAnswers} highlight={!!view.won} />}
          {theirs && <ScoreCard name={friend} score={theirs.score} correct={theirs.correctAnswers} highlight={view.won === false} />}
        </View>
        {waiting && <Text style={{ color: theme.muted }}>You'll see the result here once {friend} finishes.</Text>}
        {home}
      </Card>
    </Screen>
  );
}

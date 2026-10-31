import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { GameQuestion } from '../lib/web-challenges';
import { PrimaryButton } from './components';
import { theme } from './theme';

export type Feedback = { answer: string; correct: boolean };

const SECONDS_PER_QUESTION = 120;
const BLUE = '#3B82F6';
const INDIGO = '#4F46E5';
const ORANGE = '#F59E0B';
const RED = '#EF4444';
const GREEN = '#22C55E';

// Same thresholds as the web timer: blue, then orange under a minute, then red under 30s.
const timerColor = (s: number) => (s <= 30 ? RED : s <= 60 ? ORANGE : INDIGO);
const barColor = (s: number) => (s <= 30 ? RED : s <= 60 ? ORANGE : BLUE);

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2) || '?';

const same = (a: string, b: string) => a.toLowerCase().trim() === b.toLowerCase().trim();

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <View style={{ height: 8, borderRadius: 4, backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: '100%', backgroundColor: color }} />
    </View>
  );
}

function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: color,
        borderWidth: 2,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{initials(name)}</Text>
    </View>
  );
}

const cardShadow = { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 };

function Answers({ q, feedback, onAnswer }: { q: GameQuestion; feedback: Feedback | null; onAnswer: (a: string) => void }) {
  const [text, setText] = useState('');
  const right = String(q.correctAnswer);

  const choices: { label: string; value: string }[] =
    q.type === 'mcq' && q.options
      ? q.options.map((o) => ({ label: o, value: o }))
      : q.type === 'truefalse'
        ? [
            { label: 'True', value: 'true' },
            { label: 'False', value: 'false' },
          ]
        : [];

  if (choices.length > 0) {
    return (
      <View style={{ gap: 12 }}>
        {choices.map((c, i) => {
          const picked = !!feedback && same(c.value, feedback.answer);
          const isRight = !!feedback && same(c.value, right);
          // Web: the right option turns green, a wrong pick turns red, everything else stays plain.
          const solid = isRight ? GREEN : picked ? RED : null;
          return (
            <Pressable
              key={i}
              disabled={!!feedback}
              onPress={() => onAnswer(c.value)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                minHeight: 62,
                paddingHorizontal: 16,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: solid ?? '#E5E7EB',
                backgroundColor: solid ?? '#fff',
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: solid ? 'rgba(255,255,255,0.25)' : '#F3F4F6',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontWeight: '800', color: solid ? '#fff' : '#111827' }}>{String.fromCharCode(65 + i)}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 16, fontWeight: '600', color: solid ? '#fff' : '#111827' }}>{c.label}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  const unit = (q as { unit?: string }).unit;
  return (
    <View style={{ gap: 12 }}>
      <TextInput
        editable={!feedback}
        placeholder={q.type === 'number_input' ? 'Type a number' : 'Type your answer'}
        keyboardType={q.type === 'number_input' ? 'numbers-and-punctuation' : 'default'}
        value={text}
        onChangeText={setText}
        style={{
          minHeight: 56,
          paddingHorizontal: 16,
          borderRadius: 16,
          borderWidth: 2,
          fontSize: 16,
          color: feedback ? '#fff' : '#111827',
          borderColor: feedback ? (feedback.correct ? GREEN : RED) : '#E5E7EB',
          backgroundColor: feedback ? (feedback.correct ? GREEN : RED) : '#fff',
        }}
      />
      {!!unit && <Text style={{ color: theme.muted }}>Unit: {unit}</Text>}
      {feedback && !feedback.correct && (
        <Text style={{ color: RED, fontWeight: '700' }}>
          Wrong! Correct answer: {right}
          {unit ? ` ${unit}` : ''}
        </Text>
      )}
      <PrimaryButton title="Submit answer" disabled={!text.trim() || !!feedback} onPress={() => onAnswer(text.trim())} />
    </View>
  );
}

export interface GameViewProps {
  question: GameQuestion;
  subject: string;
  difficulty: string;
  index: number;
  total: number;
  answered: number;
  secondsLeft: number;
  feedback: Feedback | null;
  me: { name: string; rating?: number };
  opponent: { name: string; rating?: number };
  muted: boolean;
  onToggleMute: () => void;
  onAnswer: (answer: string) => void;
}

// Mobile counterpart of the web gameplay screen (src/app/challenge-arena/play/[challengeId]/page.tsx).
export function GameView(p: GameViewProps) {
  const tint = p.secondsLeft <= 30 ? '#FEE2E2' : p.secondsLeft <= 60 ? '#FEF3C7' : '#DCE4FB';
  const mm = Math.floor(p.secondsLeft / 60);
  const ss = String(p.secondsLeft % 60).padStart(2, '0');
  const progress = ((p.index + 1) / p.total) * 100;
  const timePct = (p.secondsLeft / SECONDS_PER_QUESTION) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEF0FB' }}>
      <View style={{ backgroundColor: tint, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: '#93B4F5' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
            <Text style={{ fontSize: 28 }}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', fontSize: 15, color: '#5B2A86' }}>
                Q{p.index + 1}/<Text style={{ color: '#7C3AED' }}>{p.total}</Text>
              </Text>
              <Text numberOfLines={1} style={{ fontSize: 12, color: theme.muted }}>
                {p.subject}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingHorizontal: 18,
              paddingVertical: 8,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: barColor(p.secondsLeft),
              backgroundColor: timerColor(p.secondsLeft),
            }}
          >
            <Ionicons name="time-outline" size={30} color="#fff" />
            <View>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>Time</Text>
              <Text style={{ fontSize: 26, fontWeight: '900', color: '#fff', fontVariant: ['tabular-nums'] }}>
                {mm}:{ss}
              </Text>
            </View>
          </View>

          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Pressable onPress={p.onToggleMute} hitSlop={10} style={{ padding: 6 }}>
              <Ionicons name={p.muted ? 'volume-mute' : 'volume-high'} size={22} color={p.muted ? theme.muted : theme.primary} />
            </Pressable>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Bar value={progress} color={theme.primary} />
            <Text style={{ fontSize: 10, color: theme.muted }}>Progress: {Math.round(progress)}%</Text>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Bar value={timePct} color={barColor(p.secondsLeft)} />
            <Text style={{ fontSize: 10, fontWeight: '700', color: barColor(p.secondsLeft) }}>Time: {Math.round(timePct)}%</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 12,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.9)',
            ...cardShadow,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
            <Avatar name={p.me.name} color={INDIGO} />
            <View style={{ flexShrink: 1 }}>
              <Text numberOfLines={1} style={{ fontWeight: '800', fontSize: 14, color: INDIGO }}>
                {p.me.name}
              </Text>
              <Text style={{ fontSize: 12, color: theme.muted }}>R: {p.me.rating ?? 1000}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 24 }}>⚔️</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flex: 1 }}>
            <View style={{ flexShrink: 1, alignItems: 'flex-end' }}>
              <Text numberOfLines={1} style={{ fontWeight: '800', fontSize: 14, color: '#EA580C' }}>
                {p.opponent.name}
              </Text>
              <Text style={{ fontSize: 12, color: theme.muted }}>R: {p.opponent.rating ?? '???'}</Text>
            </View>
            <Avatar name={p.opponent.name} color="#F97316" />
          </View>
        </View>

        <View style={{ padding: 18, borderRadius: 18, borderWidth: 2, borderColor: '#D5CFC8', backgroundColor: '#fff', gap: 16, ...cardShadow }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, backgroundColor: BLUE }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{p.subject}</Text>
            </View>
            <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, borderWidth: 2, borderColor: '#D5CFC8' }}>
              <Text style={{ color: theme.ink, fontWeight: '600', fontSize: 12 }}>{p.difficulty}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', lineHeight: 28 }}>{p.question.question}</Text>
          <Answers key={p.question.id} q={p.question} feedback={p.feedback} onAnswer={p.onAnswer} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 14,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: '#BFD3F5',
            backgroundColor: '#E6ECFB',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 24 }}>📊</Text>
            <View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: theme.muted }}>Progress</Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: INDIGO }}>
                {p.answered}/{p.total}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff' }}>
            <Ionicons name="checkmark-circle" size={18} color={GREEN} />
            <Text style={{ fontWeight: '800', color: '#16A34A' }}>{p.answered}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

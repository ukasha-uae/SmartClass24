import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from './theme';

export function Screen({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, gap: 16, width: '100%', maxWidth: 640, alignSelf: 'center' }}
      >
        {children}
      </ScrollView>
      {footer ? (
        <View
          style={{
            padding: 14,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            backgroundColor: theme.card,
            width: '100%',
            maxWidth: 640,
            alignSelf: 'center',
          }}
        >
          {footer}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, { backgroundColor: disabled ? theme.primaryDisabled : theme.primary }]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export function GhostButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.ghost}>
      <Text style={{ color: theme.ink, fontSize: 15 }}>{title}</Text>
    </Pressable>
  );
}

export function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: i < step ? theme.primary : theme.border }}
        />
      ))}
    </View>
  );
}

export function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={{ color: theme.muted, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 18,
    gap: 12,
  },
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  ghost: { paddingVertical: 12, paddingHorizontal: 8 },
  chip: { backgroundColor: '#EFE8E0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
});

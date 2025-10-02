import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  iconColor?: string;
}

export function EmptyState({
  title,
  message,
  icon = 'tray',
  actionText,
  onAction,
  iconColor,
}: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${title}. ${message}`}
    >
      <SymbolView
        name={icon}
        size={64}
        tintColor={iconColor || colors.icon}
        style={styles.icon}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      />
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.message}>{message}</ThemedText>
      
      {actionText && onAction && (
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { borderColor: colors.tint },
            pressed && styles.actionButtonPressed,
          ]}
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionText}
          accessibilityHint="Double tap to refresh the content"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ThemedText style={[styles.actionButtonText, { color: colors.tint }]}>
            {actionText}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  icon: {
    marginBottom: Spacing.lg,
    opacity: 0.3,
  },
  title: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...Typography.body,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 24,
    borderWidth: 2,
    marginTop: Spacing.lg,
    minWidth: 120,
    minHeight: 48, // Meets 44x44 minimum touch target
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPressed: {
    opacity: 0.6,
  },
  actionButtonText: {
    ...Typography.bodyBold,
  },
});

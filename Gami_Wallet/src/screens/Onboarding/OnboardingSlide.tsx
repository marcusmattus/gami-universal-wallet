/**
 * OnboardingSlide Component
 * Individual slide for onboarding carousel
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { neoUIColors, typography, spacing } from '@/theme';
import { OnboardingSlideData } from './onboardingData';

const { width } = Dimensions.get('window');

interface OnboardingSlideProps {
  data: OnboardingSlideData;
}

const illustrations: Record<string, string> = {
  safe: '🔐',
  transfer: '💸',
  growth: '📈',
};

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <LinearGradient
          colors={['#6C63FF33', '#4ECDC433', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.illustrationGlow}
        />
        <View style={styles.illustrationCircle}>
          <Text style={styles.illustrationEmoji}>
            {illustrations[data.illustration] || '✨'}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{data.title}</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>{data.subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  illustrationContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['3xl'],
    position: 'relative',
  },
  illustrationGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.6,
  },
  illustrationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: neoUIColors.background.cardDark,
    borderWidth: 2,
    borderColor: neoUIColors.border.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationEmoji: {
    fontSize: 100,
  },
  title: {
    fontSize: typography.sizes['3xl'],
    fontFamily: typography.fonts.bold,
    color: neoUIColors.text.light,
    textAlign: 'center',
    marginBottom: spacing.base,
    lineHeight: typography.lineHeights['3xl'],
  },
  subtitle: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: neoUIColors.text.subtext,
    textAlign: 'center',
    lineHeight: typography.lineHeights.lg,
    paddingHorizontal: spacing.base,
  },
});

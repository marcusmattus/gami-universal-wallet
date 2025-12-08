/**
 * OnboardingScreen Component
 * Main onboarding container with swipe navigation
 */

import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { neoUIColors, typography, spacing } from '@/theme';
import { NeoButton } from '@/components/NeoUI';
import { ProgressDots } from '@/components/NeoUI/ProgressDots';
import { OnboardingSlide } from './OnboardingSlide';
import { onboardingData } from './onboardingData';

const { width } = Dimensions.get('window');
const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    router.replace('/auth/signup');
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    router.replace('/auth/signup');
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const isLastSlide = currentIndex === onboardingData.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Skip Button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={({ item }) => <OnboardingSlide data={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        bounces={false}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <ProgressDots total={onboardingData.length} active={currentIndex} />
        
        <View style={styles.buttonContainer}>
          {isLastSlide ? (
            <NeoButton
              title="Get Started"
              onPress={handleGetStarted}
              variant="gradient"
              size="lg"
              fullWidth
            />
          ) : (
            <NeoButton
              title="Next"
              onPress={handleNext}
              variant="primary"
              size="lg"
              fullWidth
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neoUIColors.background.darker,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    zIndex: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  skipText: {
    color: neoUIColors.text.subtext,
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.semiBold,
  },
  footer: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['3xl'],
    gap: spacing['2xl'],
  },
  buttonContainer: {
    width: '100%',
  },
});

/**
 * Onboarding Data
 * Content for onboarding slides
 */

export interface OnboardingSlideData {
  id: string;
  title: string;
  subtitle: string;
  illustration: string;
}

export const onboardingData: OnboardingSlideData[] = [
  {
    id: '1',
    title: 'Safe and Secure Cryptocurrency wallet',
    subtitle: 'Secure way of sending and receiving cryptocurrency',
    illustration: 'safe', // Will use emoji/placeholder for now
  },
  {
    id: '2',
    title: 'Transfer your assets easily',
    subtitle: 'Crypto asset transfer instantly to your wallet',
    illustration: 'transfer',
  },
  {
    id: '3',
    title: 'Grow and swap your crypto assets',
    subtitle: 'Swap between different cryptocurrencies and watch your portfolio grow',
    illustration: 'growth',
  },
];

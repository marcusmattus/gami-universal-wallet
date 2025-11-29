import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 1200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0F0F13",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StatusBar style="light" />
      {/* Glow behind logo (soft aura) */}
      <LinearGradient
        colors={["#B026FF55", "#00F0FF33", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: 160,
          opacity: 0.8,
        }}
      />

      {/* Logo / Hero image from user-provided asset */}
      <Image
        source={{
          uri: "https://ucarecdn.com/60afe17e-96de-412e-b2be-fb767cd2b684/-/format/auto/",
        }}
        style={{
          width: 160,
          height: 160,
          borderRadius: 32,
          overflow: "hidden",
        }}
        contentFit="cover"
        transition={250}
      />

      <Text
        style={{
          marginTop: 20,
          color: "white",
          fontSize: 28,
          fontFamily: "Inter_700Bold",
          letterSpacing: 0.5,
        }}
      >
        Gami
      </Text>
      <Text
        style={{
          marginTop: 6,
          color: "#9CA3AF",
          fontSize: 14,
          fontFamily: "Inter_400Regular",
        }}
      >
        Universal Wallet
      </Text>
    </View>
  );
}

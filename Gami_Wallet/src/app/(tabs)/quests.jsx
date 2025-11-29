import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import ScreenSurface from "@/components/ScreenSurface";

const BG = "#0F0F13";
const CARD = "#1A1A24";
const BORDER = "#2A2A35";
const TEXT = "#FFFFFF";
const SUBTEXT = "#9CA3AF";
const MAGENTA = "#B026FF";
const CYAN = "#00F0FF";

export default function QuestsScreen() {
  const insets = useSafeAreaInsets();
  const [quests, setQuests] = useState([
    { id: "verify-email", title: "Verify Email", reward: 150, claimed: false },
    {
      id: "complete-profile",
      title: "Complete Profile",
      reward: 300,
      claimed: false,
    },
    {
      id: "invite-a-friend",
      title: "Invite a Friend",
      reward: 500,
      claimed: false,
    },
  ]);

  const onClaim = useCallback((id) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, claimed: true } : q)),
    );
  }, []);

  return (
    <ScreenSurface insets={insets}>
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{ color: TEXT, fontSize: 22, fontFamily: "Inter_700Bold" }}
        >
          Active Quests
        </Text>
        <Text
          style={{
            color: SUBTEXT,
            marginTop: 6,
            fontSize: 14,
            fontFamily: "Inter_400Regular",
          }}
        >
          Complete tasks to earn more XP and level up.
        </Text>

        <View style={{ marginTop: 16, gap: 10 }}>
          {quests.map((q) => (
            <View
              key={q.id}
              style={{
                backgroundColor: CARD,
                borderWidth: 1,
                borderColor: BORDER,
                borderRadius: 14,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    color: TEXT,
                    fontSize: 16,
                    fontFamily: "Inter_600SemiBold",
                  }}
                >
                  {q.title}
                </Text>
                <Text
                  style={{
                    color: SUBTEXT,
                    fontSize: 13,
                    marginTop: 4,
                    fontFamily: "Inter_400Regular",
                  }}
                >
                  +{q.reward} XP
                </Text>
              </View>
              {q.claimed ? (
                <View
                  style={{
                    backgroundColor: "#0F3D2E",
                    borderColor: "#12B981",
                    borderWidth: 1,
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                  }}
                >
                  <Text
                    style={{
                      color: "#12B981",
                      fontFamily: "Inter_600SemiBold",
                    }}
                  >
                    Claimed
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => onClaim(q.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[MAGENTA, CYAN]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 999,
                    }}
                  >
                    <Text
                      style={{ color: "#000", fontFamily: "Inter_700Bold" }}
                    >
                      Claim
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenSurface>
  );
}

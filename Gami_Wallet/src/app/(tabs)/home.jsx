import React, { useMemo, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Gem, Check } from "lucide-react-native";
import ScreenSurface from "@/components/ScreenSurface";

const BG = "#0F0F13";
const CARD = "#1A1A24";
const BORDER = "#2A2A35";
const TEXT = "#FFFFFF";
const SUBTEXT = "#9CA3AF";
const MAGENTA = "#B026FF";
const CYAN = "#00F0FF";

function ProgressRing({ size = 132, stroke = 10, progress = 0.75 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = useMemo(
    () => c * Math.max(0, Math.min(1, progress)),
    [c, progress],
  );

  return (
    <Svg width={size} height={size}>
      <Defs>
        <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={MAGENTA} />
          <Stop offset="100%" stopColor={CYAN} />
        </SvgLinearGradient>
      </Defs>
      {/* Track */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={BORDER}
        strokeWidth={stroke}
        fill="none"
      />
      {/* Progress */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="url(#grad)"
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="round"
        fill="none"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [quests, setQuests] = useState([
    { id: "connect-x", title: "Connect X", reward: 200, claimed: false },
    { id: "join-discord", title: "Join Discord", reward: 200, claimed: false },
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
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Avatar + Progress Ring */}
        <View style={{ alignItems: "center", marginTop: 8 }}>
          <View
            style={{
              width: 160,
              height: 160,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ProgressRing size={160} stroke={12} progress={0.75} />
            <Image
              source={{
                uri: "https://ucarecdn.com/02bd8994-5730-4a7a-8728-3449236cb46e/-/format/auto/",
              }}
              style={{
                position: "absolute",
                width: 96,
                height: 96,
                borderRadius: 48,
              }}
              contentFit="cover"
              transition={200}
            />
          </View>
          <Text
            style={{
              color: TEXT,
              fontSize: 20,
              fontFamily: "Inter_700Bold",
              marginTop: 12,
            }}
          >
            Level 5
          </Text>
          <Text
            style={{
              color: SUBTEXT,
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              marginTop: 4,
            }}
          >
            Total XP: 14,500
          </Text>
        </View>

        {/* Points Ticker */}
        <View
          style={{
            marginTop: 18,
            backgroundColor: CARD,
            borderWidth: 1,
            borderColor: BORDER,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 999,
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <LinearGradient
            colors={[MAGENTA, CYAN]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gem color="#000" size={18} />
          </LinearGradient>
          <Text style={{ color: TEXT, fontFamily: "Inter_600SemiBold" }}>
            Gami Points: 12,450
          </Text>
        </View>

        {/* Airdrop Hero Card */}
        <LinearGradient
          colors={[MAGENTA, CYAN]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 20, marginTop: 20 }}
        >
          <View style={{ padding: 20, borderRadius: 20 }}>
            <Text
              style={{
                color: "#0B0B0F",
                fontSize: 12,
                letterSpacing: 1.2,
                fontFamily: "Inter_600SemiBold",
              }}
            >
              THE GAMI DROP IS COMING
            </Text>
            <Text
              style={{
                color: "#071317",
                marginTop: 6,
                fontSize: 14,
                fontFamily: "Inter_400Regular",
              }}
            >
              Verify your eligibility now.
            </Text>
            <TouchableOpacity
              onPress={() => console.log("JOIN AIRDROP WAITLIST")}
              style={{
                marginTop: 16,
                backgroundColor: "#000",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 999,
                alignSelf: "flex-start",
              }}
              activeOpacity={0.8}
            >
              <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold" }}>
                JOIN AIRDROP WAITLIST
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Active Quests */}
        <Text
          style={{
            color: TEXT,
            fontSize: 18,
            fontFamily: "Inter_700Bold",
            marginTop: 24,
            marginBottom: 10,
          }}
        >
          Active Quests
        </Text>

        <View style={{ gap: 10 }}>
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
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Check size={16} color="#12B981" />
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

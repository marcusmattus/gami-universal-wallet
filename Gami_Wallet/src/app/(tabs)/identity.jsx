import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ShieldCheck, LogOut, UserPlus2 } from "lucide-react-native";
import ScreenSurface from "@/components/ScreenSurface";
import { usePrivy } from "@/utils/privy";
import gamiLogo from "../../../assets/gami_logo.png";

const TEXT = "#FFFFFF";
const SUBTEXT = "#9CA3AF";
const BORDER = "rgba(255,255,255,0.08)";

export default function IdentityScreen() {
  const insets = useSafeAreaInsets();
  const { authenticated, user, login, logout, status } = usePrivy();

  return (
    <ScreenSurface insets={insets}>
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32, gap: 18 }}
      >
        <View style={{ gap: 6 }}>
          <Text style={{ color: TEXT, fontSize: 24, fontFamily: "Inter_700Bold" }}>
            Identity
          </Text>
          <Text style={{ color: SUBTEXT, fontFamily: "Inter_400Regular" }}>
            Privy login mirrors the real SDK so you can walk through onboarding live.
          </Text>
        </View>

        <LinearGradient
          colors={["rgba(176,38,255,0.18)", "rgba(0,240,255,0.08)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 24, padding: 18, borderWidth: 1, borderColor: BORDER }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <Image source={gamiLogo} style={{ width: 64, height: 64, borderRadius: 28 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: TEXT, fontSize: 18, fontFamily: "Inter_600SemiBold" }}>
                {authenticated ? user.email : "Not connected"}
              </Text>
              <Text style={{ color: SUBTEXT, fontFamily: "Inter_400Regular" }}>
                Status • {status}
              </Text>
            </View>
            {authenticated ? (
              <TouchableOpacity onPress={logout} activeOpacity={0.85}>
                <LogOut color="#F87171" size={22} />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={{ height: 1, backgroundColor: BORDER, marginVertical: 16 }} />

          {authenticated ? (
            <View style={{ gap: 4 }}>
              <Text style={{ color: SUBTEXT, fontFamily: "Inter_600SemiBold" }}>
                Level {user.level} • {user.xp.toLocaleString()} XP
              </Text>
              <Text style={{ color: TEXT, fontFamily: "Inter_600SemiBold" }}>
                Connected via {user.loginProvider}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={login}
              activeOpacity={0.85}
              style={{
                borderRadius: 999,
                borderWidth: 1,
                borderColor: BORDER,
                paddingVertical: 12,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <UserPlus2 color="#FFFFFF" size={18} />
              <Text style={{ color: TEXT, fontFamily: "Inter_600SemiBold" }}>
                Sign in with Privy
              </Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        <View
          style={{
            borderRadius: 24,
            borderWidth: 1,
            borderColor: BORDER,
            padding: 18,
            gap: 12,
            backgroundColor: "rgba(15,15,23,0.95)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ShieldCheck color="#22D3EE" size={20} />
            <Text style={{ color: TEXT, fontFamily: "Inter_600SemiBold" }}>Badges</Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {(authenticated ? user.badges : ["Privy Required"]).map((badge) => (
              <View
                key={badge}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: BORDER,
                  backgroundColor: "rgba(255,255,255,0.02)",
                }}
              >
                <Text style={{ color: TEXT, fontFamily: "Inter_600SemiBold" }}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenSurface>
  );
}

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, ShieldCheck, Clock3 } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";
import { usePrivy } from "@/utils/privy";
import ScreenSurface from "@/components/ScreenSurface";

const TEXT = "#F8FAFC";
const SUBTEXT = "#9CA3AF";
const BORDER = "rgba(255,255,255,0.08)";

export default function AirdropScreen() {
  const insets = useSafeAreaInsets();
  const {
    ready,
    authenticated,
    login,
    airdrop,
    checkEligibility,
    claimAirdrop,
    status,
  } = usePrivy();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const lastCheckedLabel = useMemo(() => {
    if (!airdrop.lastCheckedAt) return "Never";
    return formatDistanceToNow(new Date(airdrop.lastCheckedAt), {
      addSuffix: true,
    });
  }, [airdrop.lastCheckedAt]);

  const handleCheck = async () => {
    setError(null);
    if (!authenticated) {
      login();
      return;
    }
    try {
      setIsProcessing(true);
      await checkEligibility();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClaim = () => {
    setError(null);
    try {
      if (!authenticated) {
        login();
        return;
      }
      claimAirdrop();
    } catch (err) {
      setError(err.message);
    }
  };

  const statusLabel = {
    locked: "Wallet not eligible yet",
    checking: "Checking eligibility...",
    eligible: "Eligible! Claim is ready",
    claimed: "Claim completed",
  }[airdrop.status];

  return (
    <ScreenSurface insets={insets}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32, gap: 18 }}
      >
        <View style={{ gap: 6 }}>
          <Text style={{ color: TEXT, fontSize: 24, fontFamily: "Inter_700Bold" }}>
            Gami Drop
          </Text>
          <Text style={{ color: SUBTEXT, fontFamily: "Inter_400Regular" }}>
            Connect Privy, prove eligibility, and claim the next BASE wave.
          </Text>
        </View>

        <LinearGradient
          colors={["#B026FF", "#00F0FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 24, padding: 20 }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text
                style={{
                  color: "#050505",
                  fontFamily: "Inter_600SemiBold",
                  letterSpacing: 1,
                  fontSize: 12,
                }}
              >
                {airdrop.windowLabel}
              </Text>
              <Text
                style={{
                  color: "#050505",
                  fontSize: 36,
                  fontFamily: "Inter_700Bold",
                  marginTop: 4,
                }}
              >
                {airdrop.claimableAmount} $GAMI
              </Text>
              <Text style={{ color: "#0F172A", fontFamily: "Inter_400Regular" }}>
                {statusLabel}
              </Text>
            </View>
            <Sparkles color="#050505" size={48} />
          </View>
          <TouchableOpacity
            onPress={authenticated ? handleClaim : login}
            disabled={airdrop.status === "locked" && authenticated}
            activeOpacity={0.85}
            style={{
              marginTop: 18,
              backgroundColor: "#050505",
              paddingVertical: 12,
              borderRadius: 999,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#F8FAFC", fontFamily: "Inter_700Bold" }}>
              {authenticated ? (airdrop.status === "eligible" ? "Claim tokens" : "Connect to claim") : "Connect Privy"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <View
          style={{
            borderRadius: 24,
            borderWidth: 1,
            borderColor: BORDER,
            padding: 20,
            gap: 14,
            backgroundColor: "rgba(17,17,25,0.9)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <ShieldCheck color="#22D3EE" size={20} />
            <Text style={{ color: TEXT, fontFamily: "Inter_600SemiBold" }}>
              Privy Simulation Mode
            </Text>
          </View>
          <Text style={{ color: SUBTEXT, fontFamily: "Inter_400Regular" }}>
            No real keys are used. The provider mirrors the Privy SDK surface so you can demo login, eligibility, and claims without production credentials.
          </Text>
        </View>

        <View
          style={{
            borderRadius: 24,
            borderWidth: 1,
            borderColor: BORDER,
            padding: 20,
            gap: 14,
            backgroundColor: "rgba(10,10,16,0.9)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Clock3 color="#C084FC" size={18} />
            <Text style={{ color: TEXT, fontFamily: "Inter_600SemiBold" }}>
              Eligibility
            </Text>
          </View>
          <Text style={{ color: SUBTEXT, fontFamily: "Inter_400Regular" }}>
            Last checked: {lastCheckedLabel}
          </Text>
          <TouchableOpacity
            onPress={handleCheck}
            disabled={isProcessing || !ready}
            activeOpacity={0.85}
            style={{
              marginTop: 6,
              borderRadius: 999,
              paddingVertical: 12,
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.05)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ color: TEXT, fontFamily: "Inter_600SemiBold" }}>
                {authenticated ? "Re-run eligibility" : "Connect + Check"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {error ? (
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(248,113,113,0.4)",
              backgroundColor: "rgba(127,29,29,0.35)",
              padding: 14,
            }}
          >
            <Text style={{ color: "#FECACA", fontFamily: "Inter_600SemiBold" }}>
              {error}
            </Text>
          </View>
        ) : null}

        <View style={{ gap: 8 }}>
          <Text style={{ color: SUBTEXT, fontSize: 12, fontFamily: "Inter_400Regular" }}>
            Status: {status}
          </Text>
          <Text style={{ color: SUBTEXT, fontSize: 12, fontFamily: "Inter_400Regular" }}>
            Next window: {new Date(airdrop.nextWindowAt).toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    </ScreenSurface>
  );
}

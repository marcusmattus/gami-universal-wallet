import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { KeyRound, Wallet2, UploadCloud, Shield } from "lucide-react-native";
import ScreenSurface from "@/components/ScreenSurface";
import { usePrivy } from "@/utils/privy";

const TEXT = "#FFFFFF";
const SUBTEXT = "#94A3B8";
const BORDER = "rgba(255,255,255,0.1)";

const maskAddress = (address) =>
  address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "0x0000";

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const { authenticated, login, wallets, importWallet } = usePrivy();
  const [label, setLabel] = useState("Ledger Import");
  const [secret, setSecret] = useState("0x");
  const [feedback, setFeedback] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const totalBalance = useMemo(
    () => wallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0),
    [wallets],
  );

  const handleImport = () => {
    setFeedback(null);
    if (!authenticated) {
      login();
      return;
    }
    try {
      setIsImporting(true);
      const wallet = importWallet({ label, privateKey: secret });
      setFeedback({ type: "success", message: `${wallet.label} connected.` });
      setSecret("0x");
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <ScreenSurface insets={insets}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32, gap: 18 }}
      >
        <View style={{ gap: 6 }}>
          <Text style={{ color: TEXT, fontSize: 24, fontFamily: "Inter_700Bold" }}>
            Wallets
          </Text>
          <Text style={{ color: SUBTEXT, fontFamily: "Inter_400Regular" }}>
            Import private keys or demo embedded wallets inside the same Privy session.
          </Text>
        </View>

        <LinearGradient
          colors={["rgba(176,38,255,0.2)", "rgba(0,240,255,0.12)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 24, padding: 20, borderWidth: 1, borderColor: BORDER }}
        >
          <Text style={{ color: TEXT, fontFamily: "Inter_600SemiBold" }}>
            Total Balance
          </Text>
          <Text
            style={{ color: TEXT, fontSize: 32, fontFamily: "Inter_700Bold", marginTop: 4 }}
          >
            {totalBalance.toLocaleString()} pts
          </Text>
          <Text style={{ color: SUBTEXT, fontFamily: "Inter_400Regular" }}>
            Across {wallets.length} connected wallets
          </Text>
        </LinearGradient>

        <View
          style={{
            borderRadius: 24,
            borderWidth: 1,
            borderColor: BORDER,
            padding: 18,
            gap: 12,
            backgroundColor: "rgba(10,10,16,0.92)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <KeyRound color="#FDE68A" size={18} />
            <Text style={{ color: TEXT, fontFamily: "Inter_600SemiBold" }}>
              Import private key
            </Text>
          </View>
          <TextInput
            placeholder="Wallet label"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={label}
            onChangeText={setLabel}
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: BORDER,
              padding: 12,
              color: TEXT,
              fontFamily: "Inter_600SemiBold",
            }}
          />
          <TextInput
            placeholder="0x..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={secret}
            onChangeText={setSecret}
            multiline
            style={{
              minHeight: 100,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: BORDER,
              padding: 12,
              color: TEXT,
              fontFamily: "Inter_400Regular",
            }}
          />
          <TouchableOpacity
            onPress={handleImport}
            disabled={isImporting}
            activeOpacity={0.85}
            style={{
              borderRadius: 999,
              backgroundColor: "#0EA5E9",
              paddingVertical: 14,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <UploadCloud color="#031526" size={18} />
            <Text style={{ color: "#031526", fontFamily: "Inter_700Bold" }}>
              {authenticated ? "Add wallet" : "Connect Privy first"}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: SUBTEXT, fontSize: 12, fontFamily: "Inter_400Regular" }}>
            Simulation only • keys never leave memory.
          </Text>
        </View>

        {feedback ? (
          <View
            style={{
              borderRadius: 16,
              padding: 12,
              backgroundColor:
                feedback.type === "success"
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(239,68,68,0.15)",
              borderWidth: 1,
              borderColor:
                feedback.type === "success"
                  ? "rgba(16,185,129,0.4)"
                  : "rgba(239,68,68,0.4)",
            }}
          >
            <Text style={{ color: TEXT, fontFamily: "Inter_600SemiBold" }}>
              {feedback.message}
            </Text>
          </View>
        ) : null}

        <View style={{ gap: 12 }}>
          <Text style={{ color: TEXT, fontSize: 18, fontFamily: "Inter_700Bold" }}>
            Connected wallets
          </Text>
          {wallets.map((wallet) => (
            <View
              key={wallet.id}
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: BORDER,
                padding: 16,
                backgroundColor: "rgba(7,7,12,0.9)",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 4 }}>
                <Text style={{ color: TEXT, fontFamily: "Inter_600SemiBold" }}>
                  {wallet.label}
                </Text>
                <Text style={{ color: SUBTEXT, fontFamily: "Inter_400Regular" }}>
                  {maskAddress(wallet.address)} • {wallet.chain}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: TEXT, fontFamily: "Inter_700Bold" }}>
                  {wallet.balance?.toLocaleString() ?? 0}
                </Text>
                <Text style={{ color: SUBTEXT, fontSize: 12, fontFamily: "Inter_400Regular" }}>
                  {wallet.kind}
                </Text>
              </View>
            </View>
          ))}
          {wallets.length === 0 ? (
            <View
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: BORDER,
                padding: 16,
                alignItems: "center",
                gap: 10,
              }}
            >
              <Wallet2 color="#475569" size={24} />
              <Text style={{ color: SUBTEXT, fontFamily: "Inter_400Regular" }}>
                Connect Privy to hydrate demo wallets.
              </Text>
            </View>
          ) : null}
        </View>

        <View
          style={{
            borderRadius: 20,
            borderWidth: 1,
            borderColor: BORDER,
            padding: 16,
            gap: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Shield color="#38BDF8" size={20} />
          <Text style={{ color: SUBTEXT, fontFamily: "Inter_400Regular", flex: 1 }}>
            Matches Privy’s `usePrivy()` surface so you can swap in the real SDK by dropping your App ID into .env.
          </Text>
        </View>
      </ScrollView>
    </ScreenSurface>
  );
}

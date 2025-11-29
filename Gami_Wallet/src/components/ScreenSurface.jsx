import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/**
 * Centers content inside a 375px chrome with a subtle neon gradient background,
 * giving every screen the same extension-like framing.
 */
export function ScreenSurface({ children, insets, style }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#030308",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
      }}
    >
      <LinearGradient
        colors={["#05060B", "#090918", "#05060B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
      <View
        style={{
          width: 375,
          maxWidth: "100%",
          flex: 1,
          borderRadius: 34,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.06)",
          backgroundColor: "rgba(10,10,18,0.94)",
          overflow: "hidden",
          paddingTop: (insets?.top ?? 0) + 16,
          paddingBottom: (insets?.bottom ?? 0) + 16,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOpacity: 0.4,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: 20 },
        }}
      >
        <View style={[{ flex: 1 }, style]}>{children}</View>
      </View>
    </View>
  );
}

export default ScreenSurface;

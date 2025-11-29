import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const INITIAL_AIRDROP = {
  status: "locked",
  lastCheckedAt: null,
  claimableAmount: 0,
  windowLabel: "Wave 03 • BASE",
  nextWindowAt: "2025-12-01T16:00:00.000Z",
  txHash: null,
};

const DEFAULT_USER = {
  id: "gami-prototype-user",
  email: "you@gami.xyz",
  badges: ["ZK Proof", "AI KYC", "Base Passport"],
  xp: 14500,
  level: 5,
  loginProvider: "email",
  wallets: [
    {
      id: "embedded-001",
      label: "Gami Smart Wallet",
      address: "0xF39c...2266",
      chain: "Base",
      balance: 12450,
      kind: "embedded",
    },
  ],
};

const PrivySimulationContext = createContext(null);

export function PrivySimulationProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("logged-out");
  const [user, setUser] = useState(null);
  const [airdrop, setAirdrop] = useState(INITIAL_AIRDROP);
  const [simulationLog, setSimulationLog] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 450);
    return () => clearTimeout(timer);
  }, []);

  const appendLog = useCallback((entry) => {
    setSimulationLog((prev) => [
      { id: Date.now().toString(), timestamp: new Date().toISOString(), ...entry },
      ...prev,
    ]);
  }, []);

  const login = useCallback(
    (provider = "email") => {
      if (!ready) return;
      setStatus("connecting");
      appendLog({ event: "login:start", provider });
      setTimeout(() => {
        setUser({ ...DEFAULT_USER, loginProvider: provider });
        setStatus("authenticated");
        appendLog({ event: "login:success", provider });
      }, 800);
    },
    [ready, appendLog],
  );

  const logout = useCallback(() => {
    setStatus("logged-out");
    setUser(null);
    appendLog({ event: "logout" });
  }, [appendLog]);

  const importWallet = useCallback(
    ({ label, privateKey }) => {
      if (!user) {
        throw new Error("You must be logged in to import a wallet.");
      }
      if (!privateKey || privateKey.replace(/^0x/, "").length < 32) {
        throw new Error("Private key must be at least 32 hex characters.");
      }
      const cleaned = privateKey.replace(/[^a-fA-F0-9]/g, "").slice(-64);
      const address = `0x${cleaned.slice(-40).padStart(40, "0")}`;
      const nextWallet = {
        id: `imported-${Date.now()}`,
        label: label || `Imported ${user.wallets.length + 1}`,
        address,
        chain: "Base",
        balance: 0,
        kind: "imported",
      };
      setUser((prev) => ({ ...prev, wallets: [nextWallet, ...prev.wallets] }));
      appendLog({ event: "wallet:import", label: nextWallet.label });
      return nextWallet;
    },
    [user, appendLog],
  );

  const checkEligibility = useCallback(() => {
    if (status !== "authenticated") {
      throw new Error("Please connect with Privy first.");
    }
    setAirdrop((prev) => ({ ...prev, status: "checking" }));
    appendLog({ event: "airdrop:check" });
    return new Promise((resolve) => {
      setTimeout(() => {
        const next = {
          status: "eligible",
          lastCheckedAt: new Date().toISOString(),
          claimableAmount: 1250,
          windowLabel: "Wave 03 • BASE",
          nextWindowAt: "2025-12-01T16:00:00.000Z",
          txHash: null,
        };
        setAirdrop(next);
        appendLog({ event: "airdrop:eligibility", eligible: true });
        resolve(next);
      }, 1200);
    });
  }, [status, appendLog]);

  const claimAirdrop = useCallback(() => {
    if (airdrop.status !== "eligible") {
      throw new Error("No claimable tokens yet.");
    }
    setAirdrop((prev) => ({
      ...prev,
      status: "claimed",
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    }));
    appendLog({ event: "airdrop:claim", amount: airdrop.claimableAmount });
  }, [airdrop, appendLog]);

  const value = useMemo(
    () => ({
      ready,
      status,
      authenticated: status === "authenticated",
      user,
      wallets: user?.wallets ?? [],
      airdrop,
      simulationLog,
      login,
      logout,
      importWallet,
      checkEligibility,
      claimAirdrop,
    }),
    [
      ready,
      status,
      user,
      airdrop,
      simulationLog,
      login,
      logout,
      importWallet,
      checkEligibility,
      claimAirdrop,
    ],
  );

  return (
    <PrivySimulationContext.Provider value={value}>
      {children}
    </PrivySimulationContext.Provider>
  );
}

export function usePrivy() {
  const ctx = useContext(PrivySimulationContext);
  if (!ctx) {
    throw new Error("usePrivy must be used inside PrivySimulationProvider");
  }
  return ctx;
}

export default PrivySimulationProvider;

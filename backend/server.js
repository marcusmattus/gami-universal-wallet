const express = require('express');
const cors = require('cors');
const { GamiWallet } = require('@gami/wallet-sdk');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const RPC_URL = process.env.GAMI_RPC_URL || 'http://localhost:8545';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

const app = express();
app.use(cors());
app.use(express.json());

function sanitizeAddress(raw) {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  return ADDRESS_REGEX.test(trimmed) ? trimmed : null;
}

async function initWallet(address) {
  const wallet = new GamiWallet(RPC_URL);
  await wallet.connectReadOnly(address);
  return wallet;
}

function handleError(res, error) {
  console.error('[gami-wallet-backend] chain error:', error);
  res.status(500).json({ error: 'CHAIN_REQUEST_FAILED', message: error.message });
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', rpcUrl: RPC_URL });
});

app.get('/api/chain/users/:address/stats', async (req, res) => {
  const address = sanitizeAddress(req.params.address);
  if (!address) {
    return res.status(400).json({ error: 'INVALID_ADDRESS', message: 'Address must be a 0x-prefixed 40 byte hex string.' });
  }

  try {
    const wallet = await initWallet(address);
    const stats = await wallet.checkMyLevel();

    res.json({
      address,
      level: stats.level.toString(),
      totalXP: stats.totalXP.toString(),
      xpToNextLevel: stats.xpToNextLevel.toString(),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/chain/agents/:agentAddress/budget', async (req, res) => {
  const agentAddress = sanitizeAddress(req.params.agentAddress);
  if (!agentAddress) {
    return res.status(400).json({ error: 'INVALID_ADDRESS', message: 'Agent address is invalid.' });
  }

  const { amount } = req.query;
  if (typeof amount !== 'string' || !amount.trim()) {
    return res.status(400).json({ error: 'INVALID_AMOUNT', message: 'Query parameter "amount" is required as a bigint string.' });
  }

  let requestedAmount;
  try {
    requestedAmount = BigInt(amount);
  } catch (error) {
    return res.status(400).json({ error: 'INVALID_AMOUNT', message: 'Amount must be a valid bigint string.' });
  }

  try {
    const wallet = await initWallet(agentAddress);
    const budget = await wallet.checkAgentBudget(agentAddress, requestedAmount);

    res.json({
      agent: agentAddress,
      requestedAmount: requestedAmount.toString(),
      allowed: budget.allowed,
      remaining: budget.remaining.toString(),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/chain/economy/inflation-rate', async (_req, res) => {
  try {
    const wallet = await initWallet(ZERO_ADDRESS);
    const basisPoints = await wallet.getInflationRate();
    res.json({
      basisPoints: basisPoints.toString(),
      percentage: Number(basisPoints) / 100,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.listen(PORT, () => {
  console.log(`Gami wallet backend listening on http://localhost:${PORT}`);
});

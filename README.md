<div align="center">

# Oracul

### AI-Native Prediction Markets on GenLayer

**Resolve real-world outcomes with AI validators — no oracles, no human arbitrators.**

[![GenLayer](https://img.shields.io/badge/Built%20on-GenLayer-00D4AA?style=for-the-badge&logo=genlayer)](https://genlayer.com)
[![Python](https://img.shields.io/badge/Contract-Python-3776AB?style=for-the-badge&logo=python)](https://genlayer.com/developers)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://react.dev)

</div>

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Resolution** | Multiple AI validators fetch real-world data and reach consensus automatically |
| **Web-Native** | Contracts can read live internet data — no oracles needed |
| **Fast Consensus** | Uses `prompt_comparative` for ~15-30s resolution times |
| **GEN Tokens** | Place bets on YES/NO outcomes with GEN tokens |
| **MetaMask Ready** | Connect wallet and switch to GenLayer StudioNet |
| **Auto Payout** | Winners claim GEN directly from contract via `emit_transfer` |

---

## Architecture

### Design Philosophy: Contract is Source of Truth

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│   React + TypeScript + Tailwind CSS + genlayer-js           │
│   Shared MarketContext cache for fast navigation            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   GenLayer Contract                          │
│                   (Source of Truth)                          │
├─────────────────────────────────────────────────────────────┤
│ Market CRUD          │ Betting            │ Resolution       │
│ • create_market()    │ • place_bet()      │ • resolve_market()│
│ • get_market()       │ • get_odds()       │ • claim_winnings()│
│ • get_market_count() │ • get_bet_count()  │                    │
│                      │                    │                    │
│ Aggregation          │ User Stats         │ Platform           │
│ • get_bets_by_owner()│ • get_user_stats() │ • get_platform_stats()│
│ • get_bets_by_market()│• get_created_     │ • get_markets_by_status()│
│                      │  market_count()    │                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI Validators                            │
│                                                             │
│   1. Fetch web data (resolution source URL)                │
│   2. Analyze with LLM                                      │
│   3. prompt_comparative consensus                           │
│   4. Record outcome on-chain                               │
│   5. emit_transfer payout to winner                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Contract Address

```
0x7fCa58A7788E57a2c541570b02A495871E168747
```

**Network:** GenLayer Studionet
**RPC:** `https://studio.genlayer.com/api`
**Chain ID:** `61999`
**Currency:** `GEN`

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MetaMask](https://metamask.io/) extension
- GEN tokens from [GenLayer Studio](https://studio.genlayer.com)

### 1. Install Dependencies

```bash
cd oracul
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_CONTRACT_ADDRESS=0x7fCa58A7788E57a2c541570b02A495871E168747
```

### 3. Add GenLayer to MetaMask

| Field | Value |
|-------|-------|
| Network Name | GenLayer Studionet |
| RPC URL | `https://studio.genlayer.com/api` |
| Chain ID | `61999` |
| Currency Symbol | GEN |

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## How AI Resolution Works

### Step 1: Market Creation
```python
@gl.public.write
def create_market(self, title, description, resolution_source, resolution_criteria, end_date):
    # Store market with resolution source URL and criteria
```

### Step 2: AI Validators Fetch Data
```python
src = market.resolution_source  # Extract to plain variable
web_data = gl.nondet.web.render(src, mode="text")
```

### Step 3: LLM Analyzes Outcome
```python
task = (
    'You are an impartial AI judge resolving a prediction market.\n'
    f'Market Title: {title}\n'
    f'Resolution Criteria: {criteria}\n'
    f'\nWeb page content:\n{web_data[:3000]}\n'
    '\nReturn ONLY valid JSON: {"outcome":"yes"} or {"outcome":"no"}'
)
return gl.nondet.exec_prompt(task, response_format="json")
```

### Step 4: Consensus via `prompt_comparative`
```python
outcome = gl.eq_principle.prompt_comparative(
    nondet,
    "Both outputs must be valid JSON with key 'outcome'. Values must be 'yes' or 'no'."
)
```

### Step 5: Payout via `emit_transfer`
```python
@gl.evm.contract_interface
class _Recipient:
    class View: pass
    class Write: pass

# In claim_winnings:
_Recipient(Address(bet.bettor)).emit_transfer(value=payout)
```

---

## Project Structure

```
oracul/
├── contracts/
│   └── prediction_market.py      # GenLayer Intelligent Contract (Python)
├── src/
│   ├── components/
│   │   └── Layout.tsx            # Navigation + wallet connect
│   ├── data/
│   │   ├── categories.ts         # 8 market categories
│   │   └── markets.ts            # 100+ market templates
│   ├── lib/
│   │   ├── genlayer-network.ts   # Network config (Chain ID, RPC)
│   │   ├── genlayer-client.ts    # SDK wrapper for contract calls
│   │   ├── useWallet.ts          # MetaMask connection hook
│   │   ├── WalletContext.tsx      # Shared wallet state
│   │   ├── MarketContext.tsx      # Shared market cache
│   │   └── format.ts             # weiToGen + formatGen helpers
│   ├── pages/
│   │   ├── LandingPage.tsx       # Hero + platform stats
│   │   ├── MarketsPage.tsx       # Browse all markets (cached)
│   │   ├── MarketDetailPage.tsx  # View + place bets
│   │   ├── CreateMarketPage.tsx  # Create new market
│   │   ├── PortfolioPage.tsx     # Your bets + claim winnings
│   │   └── ResolutionDashboard.tsx # AI resolution monitor
│   └── types/
│       └── database.ts           # TypeScript types
├── .env.example
├── package.json
└── vite.config.ts
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Smart Contract** | Python (GenLayer Intelligent Contracts) |
| **Blockchain** | GenLayer Studionet |
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS |
| **Wallet** | MetaMask + genlayer-js SDK |
| **State** | React Context (MarketContext + WalletContext) |
| **Icons** | Lucide React |

---

## Contract Functions

### Write Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `create_market()` | title, description, resolution_source, resolution_criteria, end_date | Create new prediction market |
| `place_bet()` | market_id, prediction | Place YES/NO bet (payable, sends GEN) |
| `resolve_market()` | market_id | Trigger AI resolution |
| `claim_winnings()` | market_id, bet_id | Claim winnings (sends GEN via emit_transfer) |
| `update_resolution_source()` | market_id, new_source | Update resolution URL (creator only) |

### View Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `get_market()` | market_id | Get market details |
| `get_bet()` | bet_id | Get bet details |
| `get_odds()` | market_id | Get current YES/NO odds |
| `get_market_count()` | - | Total markets created |
| `get_bet_count()` | - | Total bets placed |
| `get_bets_by_owner()` | owner | All bets by a user with market data |
| `get_bets_by_market()` | market_id | All bets for a market |
| `get_user_stats()` | user | User wins, losses, wagered, won |
| `get_created_market_count()` | user | Markets created by user |
| `get_markets_by_status()` | status | Filter markets by status |
| `get_platform_stats()` | - | Platform-wide statistics |

---

## Deploy Contract

```bash
# Install GenLayer CLI
npm install -g genlayer

# Set network
genlayer network studionet

# Create account
genlayer account create --name deployer
genlayer account use deployer

# Deploy
genlayer deploy --contract contracts/prediction_market.py
```

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_CONTRACT_ADDRESS
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for auto-deploys.

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## License

MIT License

---

## Links

- [GenLayer Documentation](https://docs.genlayer.com)
- [GenLayer Studio](https://studio.genlayer.com)
- [GenLayer Discord](https://discord.gg/genlayer)

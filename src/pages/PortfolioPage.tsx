import { useState, useCallback, useEffect } from 'react';
import { useSharedWallet } from '../lib/WalletContext';
import { getBetsByOwner, claimWinnings as contractClaimWinnings, getUserStats, getCreatedMarketCount } from '../lib/genlayer-client';
import { weiToGen, formatGen } from '../lib/format';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Wallet,
  Award,
  Target,
  Plus,
} from 'lucide-react';

interface MarketData {
  id: number;
  title: string;
  description: string;
  status: string;
  outcome: string;
  total_pool_yes: number;
  total_pool_no: number;
  end_date: number;
}

interface BetData {
  id: number;
  bettor: string;
  market_id: number;
  prediction: string;
  amount: number;
  odds_at_bet: number;
  claimed: boolean;
  market: MarketData;
}

interface UserStats {
  total_bets: number;
  wins: number;
  losses: number;
  pending: number;
  total_wagered: number;
  total_won: number;
}

export default function PortfolioPage() {
  const wallet = useSharedWallet();
  const [bets, setBets] = useState<BetData[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [createdCount, setCreatedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!wallet.address) return;
    setLoading(true);
    try {
      const [betsData, statsData, created] = await Promise.all([
        getBetsByOwner(wallet.address),
        getUserStats(wallet.address),
        getCreatedMarketCount(wallet.address),
      ]);
      setCreatedCount(created);
      setBets((betsData as BetData[]).map(b => ({
        ...b,
        amount: Number(b.amount),
        odds_at_bet: Number(b.odds_at_bet),
        market: {
          ...b.market,
          total_pool_yes: Number(b.market?.total_pool_yes ?? 0),
          total_pool_no: Number(b.market?.total_pool_no ?? 0),
        },
      })));
      if (statsData) {
        setStats({
          total_bets: Number(statsData.total_bets),
          wins: Number(statsData.wins),
          losses: Number(statsData.losses),
          pending: Number(statsData.pending),
          total_wagered: Number(statsData.total_wagered),
          total_won: Number(statsData.total_won),
        });
      }
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    } finally {
      setLoading(false);
    }
  }, [wallet.address]);

  useEffect(() => {
    if (wallet.isConnected && wallet.address) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [wallet.isConnected, wallet.address, fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-slate-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  const pendingBets = bets.filter(b => b.market?.status === 'active');
  const resolvedBets = bets.filter(b => b.market?.status === 'resolved');
  const wonBets = resolvedBets.filter(b => b.market?.outcome === b.prediction);
  const lostBets = resolvedBets.filter(b => b.market?.outcome !== b.prediction);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Your Portfolio</h1>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Wallet className="w-4 h-4" />
            <span className="font-mono text-sm">
              {wallet.isConnected ? wallet.address : 'Connect wallet to view portfolio'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-slate-400 text-sm">Total Predictions</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.total_bets ?? bets.length}</div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Wallet className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-slate-400 text-sm">Total Wagered</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {formatGen(weiToGen(stats?.total_wagered ?? 0))} GEN
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-slate-800/50 border border-emerald-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">Won</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">{stats?.wins ?? wonBets.length}</div>
            {(stats?.total_won ?? 0) > 0 && (
              <div className="text-emerald-400/70 text-sm mt-1">
                {formatGen(weiToGen(stats!.total_won))} GEN earned
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/20 to-slate-800/50 border border-rose-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-rose-500/20">
                <TrendingDown className="w-5 h-5 text-rose-400" />
              </div>
              <span className="text-slate-400 text-sm">Lost</span>
            </div>
            <div className="text-3xl font-bold text-rose-400">{stats?.losses ?? lostBets.length}</div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Plus className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-slate-400 text-sm">Markets Created</span>
            </div>
            <div className="text-3xl font-bold text-white">{createdCount}</div>
          </div>
        </div>

        {(stats?.wins ?? 0) + (stats?.losses ?? 0) > 0 && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center">
                  <Award className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Win Rate</div>
                  <div className="text-3xl font-bold text-white">
                    {Math.round(
                      ((stats?.wins ?? 0) / ((stats?.wins ?? 0) + (stats?.losses ?? 0))) * 100
                    )}
                    %
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-sm mb-1">Net Profit/Loss</div>
                <div
                  className={`text-2xl font-bold ${
                    (stats?.total_won ?? 0) > (stats?.total_wagered ?? 0) ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {(stats?.total_won ?? 0) > (stats?.total_wagered ?? 0) ? '+' : ''}
                  {formatGen(weiToGen((stats?.total_won ?? 0) - (stats?.total_wagered ?? 0)))} GEN
                </div>
              </div>
            </div>
          </div>
        )}

        {pendingBets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Pending Predictions ({pendingBets.length})
            </h2>
            <div className="space-y-4">
              {pendingBets.map((bet) => (
                <PendingBetCard key={bet.id} bet={bet} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Bet History
          </h2>

          {bets.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-slate-800/30 border border-slate-700/50">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No predictions yet</p>
              <p className="text-slate-500 text-sm mt-1">
                Start predicting on markets to build your portfolio
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {resolvedBets.map((bet) => (
                <BetCard key={bet.id} bet={bet} onClaim={fetchData} />
              ))}
              {pendingBets.map((bet) => (
                <BetCard key={bet.id} bet={bet} onClaim={fetchData} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PendingBetCard({ bet }: { bet: BetData }) {
  const timeLeft = () => {
    const end = new Date(bet.market.end_date * 1000);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff < 0) return 'Ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 30) return `${Math.floor(days / 30)}mo ${days % 30}d`;
    if (days > 0) return `${days}d`;
    return `${Math.floor(diff / (1000 * 60 * 60))}h`;
  };

  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-white font-medium mb-2 line-clamp-1">{bet.market.title}</div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>
              {bet.odds_at_bet}% on{' '}
              <span className={bet.prediction === 'yes' ? 'text-emerald-400' : 'text-rose-400'}>
                {bet.prediction.toUpperCase()}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeLeft()} remaining
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 text-xs">Odds at Bet</div>
          <div className="text-cyan-400 font-medium">{bet.odds_at_bet}%</div>
        </div>
      </div>
    </div>
  );
}

function BetCard({ bet, onClaim }: { bet: BetData; onClaim: () => void }) {
  const wallet = useSharedWallet();
  const [claiming, setClaiming] = useState(false);
  const isWon = bet.market?.status === 'resolved' && bet.market?.outcome === bet.prediction;
  const isLost = bet.market?.status === 'resolved' && bet.market?.outcome !== bet.prediction;

  const handleClaim = async () => {
    if (!wallet.isConnected || !wallet.address) return;

    setClaiming(true);
    try {
      await contractClaimWinnings(wallet.address, bet.market_id, bet.id);
      onClaim();
    } catch (err) {
      console.error('Claim failed:', err);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div
      className={`p-5 rounded-xl border transition-colors ${
        isWon
          ? 'bg-gradient-to-br from-emerald-500/10 to-slate-800/50 border-emerald-500/30'
          : isLost
          ? 'bg-gradient-to-br from-rose-500/10 to-slate-800/50 border-rose-500/30'
          : 'bg-gradient-to-br from-slate-800 to-slate-800/50 border-slate-700/50 hover:border-cyan-500/30'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-white font-medium mb-2 line-clamp-1">{bet.market.title}</div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>{bet.odds_at_bet}% odds</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                bet.prediction === 'yes' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {bet.prediction.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="text-right">
          {bet.market?.status === 'active' ? (
            <div className="flex items-center gap-1 text-cyan-400">
              <Clock className="w-4 h-4" />
              Pending
            </div>
          ) : isWon ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                Won
              </div>
              {!bet.claimed && (
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="mt-2 px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 disabled:opacity-50"
                >
                  {claiming ? 'Claiming...' : 'Claim'}
                </button>
              )}
            </div>
          ) : isLost ? (
            <div className="flex items-center gap-1 text-rose-400">
              <XCircle className="w-5 h-5" />
              Lost
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

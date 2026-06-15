import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMarket, getBetsByMarket, placeBet as contractPlaceBet } from '../lib/genlayer-client';
import { weiToGen, formatGen } from '../lib/format';
import { useSharedWallet } from '../lib/WalletContext';
import { useMarkets } from '../lib/MarketContext';
import { categories as localCategories } from '../data/categories';
import type { Market, Bet, Category, ResolutionLog } from '../types/database';
import {
  ArrowLeft,
  Clock,
  Globe,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Brain,
  Vote,
  TrendingUp,
  History,
} from 'lucide-react';

export default function MarketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const wallet = useSharedWallet();
  const { refreshMarkets } = useMarkets();
  const [market, setMarket] = useState<(Market & { category?: Category }) | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [resolutionLogs, setResolutionLogs] = useState<ResolutionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [betting, setBetting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    async function fetchMarket() {
      if (!id) return;

      try {
        const raw = await getMarket(parseInt(id));
        if (!raw) {
          setError('Market not found');
          setLoading(false);
          return;
        }

        const m = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const cat = localCategories.find((c) => c.slug === m.category);

        setMarket({
          id: String(m.id ?? id),
          title: m.title || '',
          description: m.description || '',
          category_id: cat?.id || null,
          resolution_source: m.resolution_source || '',
          resolution_criteria: m.resolution_criteria || '',
          end_date: m.end_date ? new Date(Number(m.end_date) * 1000).toISOString() : '',
          resolution_date: m.resolution_date ? new Date(Number(m.resolution_date) * 1000).toISOString() : null,
          status: m.status || 'active',
          outcome: m.outcome || 'pending',
          total_pool_yes: Number(m.total_pool_yes ?? 0),
          total_pool_no: Number(m.total_pool_no ?? 0),
          created_at: m.created_at ? new Date(Number(m.created_at) * 1000).toISOString() : '',
          updated_at: m.updated_at ? new Date(Number(m.updated_at) * 1000).toISOString() : '',
          category: cat,
        });

        const betsData = await getBetsByMarket(parseInt(id));
        setBets(betsData.map((b: Record<string, unknown>) => ({
          id: String(b.id),
          bettor: b.bettor as string,
          market_id: String(b.market_id),
          prediction: b.prediction as string,
          amount: Number(b.amount),
          odds_at_bet: Number(b.odds_at_bet),
          claimed: b.claimed as boolean,
          created_at: '',
        })));
        setResolutionLogs([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load market');
      } finally {
        setLoading(false);
      }
    }

    fetchMarket();
  }, [id]);

  const calculateOdds = () => {
    if (!market) return { yes: 50, no: 50 };
    const total = market.total_pool_yes + market.total_pool_no;
    if (total === 0) return { yes: 50, no: 50 };
    return {
      yes: Math.round((market.total_pool_yes / total) * 100),
      no: Math.round((market.total_pool_no / total) * 100),
    };
  };

  const calculatePotentialPayout = () => {
    if (!selectedOption || !betAmount || !market) return 0;
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) return 0;

    const odds = calculateOdds();
    const optionOdds = selectedOption === 'yes' ? odds.yes : odds.no;

    if (optionOdds === 0) return amount * 2;
    const payout = amount * (100 / optionOdds);
    return Math.round(payout * 100) / 100;
  };

  const handlePlaceBet = async () => {
    if (!selectedOption || !betAmount || !market || !id) return;

    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (!wallet.isConnected || !wallet.address) {
      setError('Please connect your wallet first');
      return;
    }

    setBetting(true);
    try {
      // Send GEN to contract (source of truth)
      const amountWei = BigInt(Math.floor(amount * 1e18));
      await contractPlaceBet(
        wallet.address,
        parseInt(id),
        selectedOption,
        amountWei
      );

      // Refresh from contract
      const raw = await getMarket(parseInt(id));
      if (raw) {
        const m = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const cat = localCategories.find((c) => c.slug === m.category);
        setMarket({
          id: String(m.id ?? id),
          title: m.title || '',
          description: m.description || '',
          category_id: cat?.id || null,
          resolution_source: m.resolution_source || '',
          resolution_criteria: m.resolution_criteria || '',
          end_date: m.end_date ? new Date(Number(m.end_date) * 1000).toISOString() : '',
          resolution_date: m.resolution_date ? new Date(Number(m.resolution_date) * 1000).toISOString() : null,
          status: m.status || 'active',
          outcome: m.outcome || 'pending',
          total_pool_yes: Number(m.total_pool_yes ?? 0),
          total_pool_no: Number(m.total_pool_no ?? 0),
          created_at: m.created_at ? new Date(Number(m.created_at) * 1000).toISOString() : '',
          updated_at: m.updated_at ? new Date(Number(m.updated_at) * 1000).toISOString() : '',
          category: cat,
        });

        const betsData = await getBetsByMarket(parseInt(id));
        setBets(betsData.map((b: Record<string, unknown>) => ({
          id: String(b.id),
          bettor: b.bettor as string,
          market_id: String(b.market_id),
          prediction: b.prediction as string,
          amount: Number(b.amount),
          odds_at_bet: Number(b.odds_at_bet),
          claimed: b.claimed as boolean,
          created_at: '',
        })));
      }
      setBetAmount('');
      setSelectedOption(null);
      await refreshMarkets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet');
    } finally {
      setBetting(false);
    }
  };

  const formatTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff < 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 365) {
      const years = Math.floor(days / 365);
      return `${years} year${years > 1 ? 's' : ''} ${days % 365} days`;
    }
    if (days > 30) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? 's' : ''} ${days % 30} days`;
    }
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-slate-400">Loading market...</p>
        </div>
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-red-400">{error || 'Market not found'}</p>
          <Link
            to="/markets"
            className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
          >
            Back to Markets
          </Link>
        </div>
      </div>
    );
  }

  const odds = calculateOdds();
  const totalPool = market.total_pool_yes + market.total_pool_no;
  const potentialPayout = calculatePotentialPayout();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/markets"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Markets
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50">
              {/* Category & Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700/50 text-slate-400 text-sm">
                  <Globe className="w-4 h-4" />
                  {market.category?.name || 'General'}
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    market.status === 'resolved'
                      ? market.outcome === 'yes'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}
                >
                  {market.status === 'resolved' ? (
                    market.outcome === 'yes' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Resolved: YES
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        Resolved: NO
                      </>
                    )
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      Active
                    </>
                  )}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{market.title}</h1>

              {/* Description */}
              <p className="text-slate-400 mb-6">{market.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-900/50">
                  <div className="text-slate-500 text-xs mb-1">
                    {market.status === 'resolved' ? 'Status' : 'Time Left'}
                  </div>
                  <div className={`font-semibold ${market.status === 'resolved' ? 'text-emerald-400' : 'text-white'}`}>
                    {market.status === 'resolved' ? 'Resolved' : formatTimeLeft(market.end_date)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50">
                  <div className="text-slate-500 text-xs mb-1">Total Pool</div>
                  <div className="text-white font-semibold">
                    {formatGen(weiToGen(totalPool))} GEN
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50">
                  <div className="text-slate-500 text-xs mb-1">Predictions</div>
                  <div className="text-white font-semibold">{bets.length}</div>
                </div>
              </div>

              {/* Resolution Criteria Card */}
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-cyan-400 font-medium mb-1">AI Resolution Criteria</div>
                    <p className="text-slate-400 text-sm">{market.resolution_criteria}</p>
                    <div className="mt-3 flex items-center gap-2 text-slate-500 text-xs">
                      <Globe className="w-3 h-3" />
                      Sources: {market.resolution_source}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Odds Visualization */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50">
              <h2 className="text-lg font-semibold text-white mb-4">Current Odds</h2>
              <div className="space-y-4">
                {/* Yes Option */}
                <button
                  onClick={() => market.status === 'active' && setSelectedOption('yes')}
                  disabled={market.status !== 'active'}
                  className={`w-full p-4 rounded-xl border transition-all ${
                    selectedOption === 'yes'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-900/50 border-slate-700 hover:border-emerald-500/50'
                  } ${market.status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${selectedOption === 'yes' ? 'text-emerald-400' : 'text-white'}`}>
                      YES
                    </span>
                    <span className={`${selectedOption === 'yes' ? 'text-emerald-400' : 'text-emerald-400'}`}>
                      {odds.yes}%
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                      style={{ width: `${odds.yes}%` }}
                    />
                  </div>
                  <div className="mt-2 text-slate-500 text-xs">
                    Pool: {formatGen(weiToGen(market.total_pool_yes))} GEN
                  </div>
                </button>

                {/* No Option */}
                <button
                  onClick={() => market.status === 'active' && setSelectedOption('no')}
                  disabled={market.status !== 'active'}
                  className={`w-full p-4 rounded-xl border transition-all ${
                    selectedOption === 'no'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'bg-slate-900/50 border-slate-700 hover:border-rose-500/50'
                  } ${market.status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${selectedOption === 'no' ? 'text-rose-400' : 'text-white'}`}>
                      NO
                    </span>
                    <span className={`${selectedOption === 'no' ? 'text-rose-400' : 'text-rose-400'}`}>
                      {odds.no}%
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 to-rose-400 transition-all"
                      style={{ width: `${odds.no}%` }}
                    />
                  </div>
                  <div className="mt-2 text-slate-500 text-xs">
                    Pool: {formatGen(weiToGen(market.total_pool_no))} GEN
                  </div>
                </button>
              </div>
            </div>

            {/* Resolution Logs */}
            {resolutionLogs.length > 0 && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Vote className="w-5 h-5 text-cyan-400" />
                  AI Validator Votes
                </h2>
                <div className="space-y-3">
                  {resolutionLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <Brain className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{log.ai_model}</div>
                            <div className="text-slate-500 text-xs">{log.validator_id}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              log.vote === 'yes'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {log.vote.toUpperCase()}
                          </div>
                          <div className="text-slate-400 text-xs">
                            {Math.round(log.confidence * 100)}% conf
                          </div>
                        </div>
                      </div>
                      {log.reasoning && (
                        <p className="text-slate-500 text-sm mt-2">{log.reasoning}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Betting Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Place Prediction
              </h2>

              {market.status !== 'active' ? (
                <div className="text-center py-6">
                  <div className="text-slate-400 mb-2">This market has been resolved</div>
                  <div
                    className={`text-2xl font-bold ${
                      market.outcome === 'yes' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    Outcome: {market.outcome?.toUpperCase()}
                  </div>
                </div>
              ) : (
                <>
                  {!selectedOption ? (
                    <div className="text-center py-6 text-slate-500">
                      Select an outcome above to place a bet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                        <div className="text-slate-500 text-xs mb-1">Selected</div>
                        <div
                          className={`text-xl font-bold ${
                            selectedOption === 'yes' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {selectedOption.toUpperCase()}
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Amount (GEN)</label>
                        <input
                          type="number"
                          value={betAmount}
                          onChange={(e) => setBetAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>

                      {/* Quick amounts */}
                      <div className="flex gap-2">
                        {[2, 5, 10, 20].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setBetAmount(amt.toString())}
                            className="flex-1 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-400 text-sm hover:border-cyan-500/50 hover:text-white transition-colors"
                          >
                            {amt}
                          </button>
                        ))}
                      </div>

                      {betAmount && parseFloat(betAmount) > 0 && (
                        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                          <div className="text-slate-400 text-sm mb-1">Potential Payout</div>
                          <div className="text-2xl font-bold text-cyan-400">
                            {potentialPayout.toLocaleString()} GEN
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handlePlaceBet}
                        disabled={betting || !betAmount || parseFloat(betAmount) <= 0}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-semibold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {betting ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Placing Bet...
                          </span>
                        ) : (
                          'Confirm Prediction'
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Recent Activity */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  Recent Activity
                </h2>
                {bets.length > 5 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-cyan-400 text-sm hover:text-cyan-300"
                  >
                    {showHistory ? 'Show Less' : 'Show All'}
                  </button>
                )}
              </div>

              {bets.length === 0 ? (
                <div className="text-center py-6 text-slate-500">
                  No predictions yet. Be the first!
                </div>
              ) : (
                <div className="space-y-3">
                  {(showHistory ? bets : bets.slice(0, 5)).map((bet) => (
                    <div
                      key={bet.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50"
                    >
                      <div>
                        <div className="text-white text-sm font-mono">
                          {(bet as unknown as { bettor?: string }).bettor?.slice(0, 8)}...{(bet as unknown as { bettor?: string }).bettor?.slice(-4)}
                        </div>
                        <div className="text-slate-500 text-xs">
                          {bet.created_at ? new Date(bet.created_at).toLocaleDateString() : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${
                            bet.prediction === 'yes' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {bet.prediction.toUpperCase()}
                        </div>
                        <div className="text-slate-400 text-sm">{formatGen(weiToGen(bet.amount))} GEN</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resolve Button */}
            {market.status === 'active' && (
              <Link
                to="/resolution"
                className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 font-semibold flex items-center justify-center gap-2 hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
              >
                <Brain className="w-5 h-5" />
                Go to Resolution Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMarketCount, getMarket, resolveMarket as contractResolveMarket } from '../lib/genlayer-client';
import { weiToGen, formatGen } from '../lib/format';
import { useSharedWallet } from '../lib/WalletContext';
import { categories as localCategories } from '../data/categories';
import type { Market, ResolutionLog } from '../types/database';
import {
  Brain,
  Vote,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
  Play,
  Activity,
  Shield,
} from 'lucide-react';

interface MarketWithLogs extends Market {
  resolution_logs: ResolutionLog[];
}

const categoryDescriptions: Record<string, string> = {
  sports: 'ESPN, BBC Sport, official league websites',
  crypto: 'CoinGecko, CoinMarketCap, major exchange price feeds',
  technology: 'Official announcements, verified news sources',
  politics: 'Official government websites, Reuters, AP News',
  entertainment: 'Official studio announcements, box office data',
  science: 'Nature, Science, official research institutions',
  finance: 'Bloomberg, Reuters, official financial filings',
  'world-events': 'Reuters, AP News, official government statements',
};

export default function ResolutionDashboard() {
  const wallet = useSharedWallet();
  const [markets, setMarkets] = useState<MarketWithLogs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolving, setResolving] = useState<string | null>(null);

  useEffect(() => {
    fetchMarkets();
  }, []);

  async function fetchMarkets() {
    try {
      const count = await getMarketCount();
      const marketsData: MarketWithLogs[] = [];

      for (let i = 0; i < count; i++) {
        try {
          const raw = await getMarket(i);
          if (!raw) continue;

          const m = typeof raw === 'string' ? JSON.parse(raw) : raw;
          const cat = localCategories.find((c) => c.slug === m.category);

          marketsData.push({
            id: String(m.id ?? i),
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
            resolution_logs: [],
          });
        } catch {
          // skip unreadable markets
        }
      }

      setMarkets(marketsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load markets');
    } finally {
      setLoading(false);
    }
  }

  async function handleResolve(marketId: string) {
    if (!wallet.isConnected || !wallet.address) {
      setError('Please connect your wallet first');
      return;
    }

    setResolving(marketId);
    try {
      await contractResolveMarket(wallet.address, parseInt(marketId));
      await fetchMarkets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve market');
    } finally {
      setResolving(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-slate-400">Loading resolution dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const activeMarkets = markets.filter(m => m.status === 'active');
  const resolvedMarkets = markets.filter(m => m.status === 'resolved');

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              AI Resolution Dashboard
            </h1>
          </div>
          <p className="text-slate-400">
            Monitor how GenLayer's AI validators analyze real-world data to resolve prediction markets
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-cyan-400 text-2xl font-bold">{activeMarkets.length}</div>
            <div className="text-slate-400 text-sm">Pending Resolution</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-emerald-400 text-2xl font-bold">{resolvedMarkets.length}</div>
            <div className="text-slate-400 text-sm">Resolved</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-white text-2xl font-bold">
              {markets.reduce((sum, m) => sum + (m.resolution_logs?.length || 0), 0)}
            </div>
            <div className="text-slate-400 text-sm">AI Votes Cast</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-white text-2xl font-bold">3</div>
            <div className="text-slate-400 text-sm">Active Validators</div>
          </div>
        </div>

        {/* How GenLayer Resolution Works */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Optimistic Democracy Consensus
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-medium">1</span>
              </div>
              <div>
                <div className="text-white font-medium mb-1">Leader Proposes</div>
                <p>A validator fetches real-world data and proposes an outcome</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-medium">2</span>
              </div>
              <div>
                <div className="text-white font-medium mb-1">Validators Verify</div>
                <p>Other validators independently recompute using their AI models</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-medium">3</span>
              </div>
              <div>
                <div className="text-white font-medium mb-1">Consensus Reached</div>
                <p>Majority agreement finalizes the outcome on-chain</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Markets Needing Resolution */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Markets Awaiting AI Resolution
          </h2>

          {activeMarkets.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-slate-800/30 border border-slate-700/50">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-400">All markets have been resolved</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeMarkets.map((market) => {
                const catSlug = market.category?.slug || '';
                const description = categoryDescriptions[catSlug] || 'Verified data sources';

                return (
                  <div
                    key={market.id}
                    className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <Link
                          to={`/market/${market.id}`}
                          className="text-lg font-semibold text-white hover:text-cyan-400 transition-colors inline-flex items-center gap-2"
                        >
                          {market.title}
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Ends {new Date(market.end_date).toLocaleDateString()}
                          </div>
                          <div>
                            Pool: {formatGen(weiToGen(market.total_pool_yes + market.total_pool_no))} GEN
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleResolve(market.id)}
                        disabled={resolving === market.id}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {resolving === market.id ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Resolving...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Trigger AI Resolution
                          </>
                        )}
                      </button>
                    </div>

                    {/* Resolution Info */}
                    <div className="mt-4 p-4 rounded-xl bg-slate-900/50">
                      <div className="text-slate-500 text-xs mb-2">AI will fetch data from</div>
                      <div className="text-cyan-400 text-sm">{description}</div>
                      <div className="text-slate-500 text-xs mt-3 mb-2">AI Evaluation Criteria</div>
                      <div className="text-slate-300 text-sm">{market.resolution_criteria}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recently Resolved */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Vote className="w-5 h-5 text-emerald-400" />
            Recently Resolved Markets
          </h2>

          {resolvedMarkets.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-slate-800/30 border border-slate-700/50">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No markets resolved yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resolvedMarkets.map((market) => (
                <div
                  key={market.id}
                  className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-slate-800/50 border border-emerald-500/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Link
                        to={`/market/${market.id}`}
                        className="text-lg font-semibold text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-2"
                      >
                        {market.title}
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Resolved
                        </span>
                        <span>Outcome: <span className="text-emerald-400 font-medium">{market.outcome.toUpperCase()}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

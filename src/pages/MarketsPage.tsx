import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMarkets } from '../lib/MarketContext';
import { weiToGen, formatGen } from '../lib/format';
import { categories as localCategories } from '../data/categories';
import { marketTemplates } from '../data/markets';
import type { Category } from '../types/database';
import {
  TrendingUp,
  Search,
  Filter,
  Clock,
  Users,
  Loader2,
  Trophy,
  Bitcoin,
  Cpu,
  Landmark,
  Clapperboard,
  Atom,
  Globe,
} from 'lucide-react';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  sports: Trophy,
  crypto: Bitcoin,
  technology: Cpu,
  politics: Landmark,
  entertainment: Clapperboard,
  science: Atom,
  finance: TrendingUp,
  'world-events': Globe,
};

export default function MarketsPage() {
  const { markets, loading, refreshMarkets } = useMarkets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'volume' | 'end_date' | 'created'>('volume');
  const [showFilters, setShowFilters] = useState(false);

  const filteredMarkets = useMemo(() => {
    let filtered = [...markets];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((m) => m.category_id === selectedCategory);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'volume') {
        return (b.total_pool_yes + b.total_pool_no) - (a.total_pool_yes + a.total_pool_no);
      }
      if (sortBy === 'end_date') {
        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
      }
      return 0;
    });

    return filtered;
  }, [markets, searchQuery, selectedCategory, sortBy]);

  const formatTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff < 0) return 'Ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 30) return `${Math.floor(days / 30)}mo ${days % 30}d`;
    if (days > 0) return `${days}d`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h`;
  };

  const calculateOdds = (market: { total_pool_yes: number; total_pool_no: number }) => {
    const total = market.total_pool_yes + market.total_pool_no;
    if (total === 0) return { yes: 50, no: 50 };
    return {
      yes: Math.round((market.total_pool_yes / total) * 100),
      no: Math.round((market.total_pool_no / total) * 100),
    };
  };

  if (loading && markets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-slate-400">Loading markets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Prediction Markets</h1>
              <p className="text-slate-400">
                {markets.length} market{markets.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <Link
              to="/create"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Create Market
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search markets..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {showFilters && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:text-white'
                  }`}
                >
                  All
                </button>
                {localCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {(['volume', 'end_date', 'created'] as const).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === sort
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:text-white'
                    }`}
                  >
                    {sort === 'volume' ? 'Volume' : sort === 'end_date' ? 'Ending Soon' : 'Newest'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Markets Grid */}
        {filteredMarkets.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No markets found matching your criteria</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => {
              const odds = calculateOdds(market);
              const CategoryIcon = categoryIcons[market.category?.slug || ''] || Globe;

              return (
                <Link
                  key={market.id}
                  to={`/market/${market.id}`}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  {/* Category & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <CategoryIcon className="w-3 h-3" />
                      {market.category?.name || 'General'}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Clock className="w-3 h-3" />
                      {market.status === 'resolved' ? 'Ended' : formatTimeLeft(market.end_date)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-semibold mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {market.title}
                  </h3>

                  {/* Odds Display */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>YES</span>
                      <span>NO</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700 overflow-hidden flex">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                        style={{ width: `${odds.yes}%` }}
                      />
                      <div
                        className="bg-gradient-to-r from-rose-500 to-rose-400 transition-all"
                        style={{ width: `${odds.no}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-emerald-400 text-sm font-medium">{odds.yes}%</span>
                      <span className="text-rose-400 text-sm font-medium">{odds.no}%</span>
                    </div>
                  </div>

                  {/* Pool Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>
                        {formatGen(weiToGen(market.total_pool_yes + market.total_pool_no))} GEN pool
                      </span>
                    </div>
                    <div className="text-cyan-400 text-sm group-hover:translate-x-1 transition-transform">
                      View Details
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

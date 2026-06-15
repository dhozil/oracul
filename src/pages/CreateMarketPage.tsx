import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSharedWallet } from '../lib/WalletContext';
import { useMarkets } from '../lib/MarketContext';
import { createMarket as contractCreateMarket } from '../lib/genlayer-client';
import { categories as localCategories } from '../data/categories';
import { marketTemplates, categoryTemplates } from '../data/markets';
import {
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Globe,
  Trophy,
  Bitcoin,
  Cpu,
  Landmark,
  Clapperboard,
  Atom,
  TrendingUp,
  Lightbulb,
  Sparkles,
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

const categoryUrls: Record<string, string> = {
  sports: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
  crypto: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
  technology: 'https://hacker-news.firebaseio.com/v0/topstories.json',
  politics: 'https://en.wikipedia.org/api/rest_v1/page/summary/United_States',
  entertainment: 'https://en.wikipedia.org/api/rest_v1/page/summary/Film',
  science: 'https://en.wikipedia.org/api/rest_v1/page/summary/Scientific_method',
  finance: 'https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC',
  'world-events': 'https://en.wikipedia.org/api/rest_v1/page/summary/Current_events',
};

const categoryDescriptions: Record<string, string> = {
  sports: 'ESPN, BBC Sport, official league websites',
  crypto: 'CoinGecko, CoinMarketCap, major exchange price feeds',
  technology: 'Official announcements, verified news sources, academic publications',
  politics: 'Official government websites, Reuters, AP News',
  entertainment: 'Official studio announcements, Box Office Mojo, verified entertainment news',
  science: 'Nature, Science, official research institutions',
  finance: 'Bloomberg, Reuters, official financial filings',
  'world-events': 'Reuters, AP News, official government statements',
};

export default function CreateMarketPage() {
  const navigate = useNavigate();
  const wallet = useSharedWallet();
  const { refreshMarkets } = useMarkets();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    resolution_source: '',
    resolution_criteria: '',
    end_date: '',
  });

  const handleCategoryChange = (categoryId: string) => {
    const category = localCategories.find((c) => c.id === categoryId);
    const slug = category?.slug || '';
    const template = slug ? categoryTemplates[slug as keyof typeof categoryTemplates] : null;
    const autoUrl = categoryUrls[slug] || '';

    setFormData({
      ...formData,
      category_id: categoryId,
      resolution_source: autoUrl,
      resolution_criteria: template?.resolution_criteria || formData.resolution_criteria,
    });
  };

  const generateRandomMarket = () => {
    setIsShuffling(true);

    const allCategorySlugs = Object.keys(marketTemplates);
    const randomCategorySlug = allCategorySlugs[Math.floor(Math.random() * allCategorySlugs.length)];
    const targetCategory = localCategories.find((c) => c.slug === randomCategorySlug);

    const templatesForCategory = marketTemplates[randomCategorySlug as keyof typeof marketTemplates];
    if (!templatesForCategory || templatesForCategory.length === 0) return;

    const randomTemplate = templatesForCategory[Math.floor(Math.random() * templatesForCategory.length)];

    const now = new Date();
    const monthsAhead = Math.floor(Math.random() * 12) + 1;
    const endDate = new Date(now.getTime());
    endDate.setMonth(now.getMonth() + monthsAhead);
    const endDateString = endDate.toISOString().slice(0, 16);

    const autoUrl = categoryUrls[randomCategorySlug] || '';

    setTimeout(() => {
      setFormData({
        ...formData,
        category_id: targetCategory?.id || '',
        title: randomTemplate.title,
        description: randomTemplate.description,
        resolution_source: autoUrl,
        resolution_criteria: randomTemplate.resolution_criteria,
        end_date: endDateString,
      });
      setIsShuffling(false);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!formData.title || !formData.description || !formData.category_id || !formData.end_date) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.resolution_source) {
        throw new Error('Please select a category');
      }

      if (new Date(formData.end_date) <= new Date()) {
        throw new Error('End date must be in the future');
      }

      if (!wallet.isConnected || !wallet.address) {
        throw new Error('Please connect your wallet first');
      }

      const endDateTimestamp = Math.floor(new Date(formData.end_date).getTime() / 1000);
      await contractCreateMarket(
        wallet.address,
        {
          title: formData.title,
          description: formData.description,
          resolutionSource: formData.resolution_source,
          resolutionCriteria: formData.resolution_criteria || 'To be specified',
          endDate: endDateTimestamp,
        }
      );

      setSuccess(true);
      await refreshMarkets();
      setTimeout(() => {
        navigate('/markets');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create market');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Market Created!</h2>
          <p className="text-slate-400">Redirecting to markets...</p>
        </div>
      </div>
    );
  }

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const selectedCategory = localCategories.find((c) => c.id === formData.category_id);
  const selectedSlug = selectedCategory?.slug || '';

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">Create Market</h1>
          </div>
          <p className="text-slate-400">
            Create a new prediction market for any verifiable real-world event
          </p>
        </div>

        <button
          type="button"
          onClick={generateRandomMarket}
          disabled={isShuffling}
          className="w-full mb-6 py-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isShuffling ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {isShuffling ? 'Generating...' : 'Generate Random Market Idea'}
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-slate-300 font-medium mb-3">Category</label>
            <div className="grid grid-cols-4 gap-3">
              {localCategories.map((category) => {
                const Icon = categoryIcons[category.slug] || Globe;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryChange(category.id)}
                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                      formData.category_id === category.id
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                        : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">Market Question</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Will Bitcoin reach $200,000 by end of 2026?"
              className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                isShuffling ? 'border-purple-500 ring-purple-500' : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this market is about and what the YES/NO outcomes mean..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-1 resize-none transition-all ${
                isShuffling ? 'border-purple-500 ring-purple-500' : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500'
              }`}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">End Date</label>
            <input
              type="datetime-local"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              min={minDate}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                isShuffling ? 'border-purple-500 ring-purple-500' : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500'
              }`}
            />
          </div>

          {/* Resolution Settings */}
          <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-cyan-400" />
              <h3 className="text-white font-medium">Resolution Settings</h3>
            </div>

            {/* Resolution Source - Hidden, show description only */}
            {selectedSlug && (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/30">
                <div className="text-slate-400 text-sm">AI will fetch data from:</div>
                <div className="text-cyan-400 text-sm mt-1">{categoryDescriptions[selectedSlug]}</div>
              </div>
            )}

            {/* Resolution Criteria */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">Resolution Criteria</label>
              <textarea
                value={formData.resolution_criteria}
                onChange={(e) => setFormData({ ...formData, resolution_criteria: e.target.value })}
                placeholder="Describe in plain language how AI should determine if the event occurred. Be specific about what constitutes 'yes' vs 'no'."
                rows={4}
                className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-1 resize-none transition-all ${
                  isShuffling ? 'border-purple-500 ring-purple-500' : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500'
                }`}
              />
              <p className="mt-2 text-slate-500 text-sm">
                Write clear criteria for AI validators to follow when resolving the market
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span className="text-rose-400">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-semibold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Market...
              </span>
            ) : (
              'Create Prediction Market'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

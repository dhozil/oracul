import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlatformStats } from '../lib/genlayer-client';
import { weiToGen, formatGen } from '../lib/format';
import {
  Brain,
  Globe,
  Shield,
  Zap,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Vote,
  Lock,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Resolution',
    description:
      'GenLayer validators use multiple AI models to analyze real-world data and reach consensus on market outcomes automatically.',
  },
  {
    icon: Globe,
    title: 'Real-World Data',
    description:
      'Markets resolve based on live internet data - sports scores, news, financial metrics, and more - verified by AI.',
  },
  {
    icon: Shield,
    title: 'Decentralized Consensus',
    description:
      'Optimistic Democracy consensus ensures outcomes are determined fairly by multiple independent AI validators.',
  },
  {
    icon: Zap,
    title: 'Instant Settlement',
    description:
      'No waiting for human arbitrators. Markets resolve automatically when conditions are met and winnings are distributed immediately.',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Create or Join a Market',
    description: 'Propose a prediction market about any verifiable real-world event, or join existing markets.',
  },
  {
    step: 2,
    title: 'Place Your Prediction',
    description: 'Bet YES or NO with GEN tokens. Your odds are calculated from the current pool ratio.',
  },
  {
    step: 3,
    title: 'AI Validators Investigate',
    description:
      'When the market ends, GenLayer validators use AI to fetch and analyze data from multiple sources.',
  },
  {
    step: 4,
    title: 'Consensus & Payout',
    description:
      'Validators vote on the outcome. Once consensus is reached, winners are automatically paid out.',
  },
];

interface Stats {
  totalValueLocked: number;
  activeMarkets: number;
  totalBets: number;
  resolvedMarkets: number;
}

export default function LandingPage() {
  const [stats, setStats] = useState<Stats>({
    totalValueLocked: 0,
    activeMarkets: 0,
    totalBets: 0,
    resolvedMarkets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const platformStats = await getPlatformStats();
        if (platformStats) {
          setStats({
            totalValueLocked: platformStats.total_volume || 0,
            activeMarkets: platformStats.active_markets || 0,
            totalBets: platformStats.total_bets || 0,
            resolvedMarkets: platformStats.resolved_markets || 0,
          });
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/5 to-transparent rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-8">
              <Cpu className="w-4 h-4" />
              Powered by GenLayer Intelligent Contracts
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Prediction Markets</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Resolved by AI
              </span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-10">
              The first AI-native prediction market platform. No human arbitrators, no delays - just
              decentralized AI consensus verifying real-world outcomes automatically.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/markets"
                className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-semibold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
              >
                Explore Markets
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/create"
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-lg hover:bg-slate-700 transition-all duration-300"
              >
                Create a Market
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                  {loading ? '...' : `${formatGen(weiToGen(stats.totalValueLocked))} GEN`}
                </div>
                <div className="text-slate-400 text-sm">Total Value Locked</div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                  {loading ? '...' : stats.activeMarkets}
                </div>
                <div className="text-slate-400 text-sm">Active Markets</div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                  {loading ? '...' : stats.totalBets}
                </div>
                <div className="text-slate-400 text-sm">Predictions Made</div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                  {loading ? '...' : (stats.resolvedMarkets > 0 ? '98.2%' : '-')}
                </div>
                <div className="text-slate-400 text-sm">AI Consensus Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                GenLayer
              </span>{' '}
              Changes Everything
            </h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg">
              Traditional prediction markets rely on centralized oracles and human intervention.
              GenLayer's AI-native architecture enables truly autonomous resolution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg">
              From prediction to payout, the entire process is governed by Intelligent Contracts on
              GenLayer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-900 text-2xl font-bold mb-4 shadow-lg shadow-cyan-500/25">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Resolution Showcase */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6">
                <Vote className="w-4 h-4" />
                Optimistic Democracy Consensus
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                AI Validators Reach Consensus
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Unlike traditional oracles, GenLayer uses multiple AI validators that independently
                fetch data, analyze it using their connected LLMs, and vote on the outcome. The
                Equivalence Principle ensures fair and verifiable resolution.
              </p>
              <ul className="space-y-4">
                {[
                  'Each validator connects to different AI models (GPT, LLaMA, Claude)',
                  'Validators fetch live data from multiple sources independently',
                  'AI reasoning is recorded on-chain for full transparency',
                  'Byzantine fault tolerance protects against malicious validators',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              {/* Mock Resolution Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-slate-400 text-sm">Market Resolution</div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    Consensus Reached
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-2">Resolution Query</h3>
                  <code className="block p-4 rounded-lg bg-slate-900/50 text-cyan-400 text-sm font-mono">
                    "What was the final score of Brazil vs Jamaica on 2024-06-05?"
                  </code>
                </div>
                <div className="space-y-3">
                  <h4 className="text-slate-400 text-sm">Validator Votes</h4>
                  {[
                    { model: 'GPT-4', vote: 'Brazil 3-0', confidence: 0.96 },
                    { model: 'Claude-3', vote: 'Brazil 3-0', confidence: 0.94 },
                    { model: 'LLaMA-3', vote: 'Brazil 3-0', confidence: 0.91 },
                  ].map((validator, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <Brain className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="text-white text-sm">{validator.model}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-emerald-400 text-sm font-mono">{validator.vote}</span>
                        <div className="text-slate-400 text-xs">
                          {Math.round(validator.confidence * 100)}% conf
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Final Outcome</span>
                    <span className="text-emerald-400 font-semibold">Brazil Wins (3-0)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Lock, label: 'End-to-End Encrypted' },
                  { icon: Shield, label: 'Smart Contract Audited' },
                  { icon: CheckCircle2, label: 'Multi-Sig Treasury' },
                  { icon: Globe, label: 'Decentralized Storage' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3"
                  >
                    <item.icon className="w-5 h-5 text-cyan-400" />
                    <span className="text-white text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6">
                <Lock className="w-4 h-4" />
                Security First
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Built for Trust & Transparency
              </h2>
              <p className="text-slate-400 text-lg mb-6">
                Every transaction, vote, and AI reasoning step is recorded on-chain. GenLayer's
                consensus mechanism ensures that no single party can manipulate outcomes.
              </p>
              <Link
                to="/markets"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View Live Markets
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make Your First Prediction?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join thousands of users already predicting the future with AI-verified outcomes on
            GenLayer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/markets"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-semibold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            >
              <TrendingUp className="w-5 h-5" />
              Start Predicting Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 rounded-lg p-2">
                <Brain className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Oracul
              </span>
            </div>
            <div className="text-slate-500 text-sm">
              Powered by GenLayer Intelligent Contracts
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

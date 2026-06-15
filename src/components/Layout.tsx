import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useSharedWallet } from '../lib/WalletContext';
import {
  Layers,
  LayoutDashboard,
  TrendingUp,
  Vote,
  Briefcase,
  Plus,
  Menu,
  X,
  Wallet,
  AlertCircle,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const wallet = useSharedWallet();

  const navItems = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/markets', label: 'Markets', icon: TrendingUp },
    { path: '/create', label: 'Create Market', icon: Plus },
    { path: '/resolution', label: 'AI Resolution', icon: Vote },
    { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-slate-900 rounded-lg p-2">
                  <Layers className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Oracul
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Connect Wallet Button */}
            <div className="hidden md:flex items-center gap-4">
              {wallet.error && (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span className="max-w-[100px] truncate">{wallet.error}</span>
                </div>
              )}
              <button
                onClick={wallet.isConnected ? wallet.disconnect : wallet.connect}
                disabled={wallet.isConnecting}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  wallet.isConnected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 hover:from-cyan-400 hover:to-emerald-400 shadow-lg shadow-cyan-500/25'
                } ${wallet.isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Wallet className="w-4 h-4" />
                {wallet.isConnecting
                  ? 'Connecting...'
                  : wallet.isConnected
                  ? `${wallet.address?.slice(0, 6)}...${wallet.address?.slice(-4)}`
                  : 'Connect Wallet'}
              </button>
              {wallet.isConnected && wallet.chainId !== 61999 && (
                <button
                  onClick={wallet.switchToGenLayer}
                  className="text-xs text-amber-400 hover:text-amber-300"
                >
                  Switch Network
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  wallet.isConnected ? wallet.disconnect() : wallet.connect();
                  setMobileMenuOpen(false);
                }}
                disabled={wallet.isConnecting}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-medium"
              >
                <Wallet className="w-5 h-5" />
                {wallet.isConnecting
                  ? 'Connecting...'
                  : wallet.isConnected
                  ? `${wallet.address?.slice(0, 6)}...${wallet.address?.slice(-4)}`
                  : 'Connect Wallet'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}

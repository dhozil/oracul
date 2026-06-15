import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { getMarketCount, getMarket } from './genlayer-client';
import { categories as localCategories } from '../data/categories';

export interface MarketData {
  id: string;
  title: string;
  description: string;
  category_id: string | null;
  resolution_source: string;
  resolution_criteria: string;
  end_date: string;
  resolution_date: string | null;
  status: string;
  outcome: string;
  total_pool_yes: number;
  total_pool_no: number;
  created_at: string;
  updated_at: string;
  category: { id: string; name: string; slug: string } | null;
}

interface MarketContextType {
  markets: MarketData[];
  loading: boolean;
  refreshMarkets: () => Promise<void>;
  getMarketById: (id: string) => MarketData | undefined;
}

const MarketContext = createContext<MarketContextType>({
  markets: [],
  loading: false,
  refreshMarkets: async () => {},
  getMarketById: () => undefined,
});

export function MarketProvider({ children }: { children: ReactNode }) {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshMarkets = useCallback(async () => {
    setLoading(true);
    try {
      const count = await getMarketCount();
      const marketsData: MarketData[] = [];

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
            category: cat || null,
          });
        } catch {
          // skip unreadable markets
        }
      }

      setMarkets(marketsData);
    } catch (err) {
      console.error('Failed to refresh markets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMarketById = useCallback((id: string) => {
    return markets.find((m) => m.id === id);
  }, [markets]);

  useEffect(() => {
    refreshMarkets();
  }, [refreshMarkets]);

  return (
    <MarketContext.Provider value={{ markets, loading, refreshMarkets, getMarketById }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarkets() {
  return useContext(MarketContext);
}

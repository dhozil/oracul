export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
}

export interface Market {
  id: string;
  title: string;
  description: string;
  category_id: string | null;
  resolution_source: string;
  resolution_criteria: string;
  end_date: string;
  resolution_date: string | null;
  status: 'active' | 'resolved' | 'cancelled';
  outcome: 'yes' | 'no' | 'pending' | null;
  total_pool_yes: number;
  total_pool_no: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Bet {
  id: string;
  market_id: string;
  user_address: string;
  prediction: 'yes' | 'no';
  amount: number;
  odds_at_bet: number;
  claimed: boolean;
  payout: number | null;
  created_at: string;
  market?: Market;
}

export interface ResolutionLog {
  id: string;
  market_id: string;
  validator_id: string;
  ai_model: string;
  reasoning: string | null;
  vote: 'yes' | 'no';
  confidence: number;
  created_at: string;
}

export interface Profile {
  id: string;
  wallet_address: string;
  username: string | null;
  avatar_url: string | null;
  total_winnings: number;
  total_bets: number;
  win_rate: number;
  created_at: string;
}

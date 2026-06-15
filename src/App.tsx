import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './lib/WalletContext';
import { MarketProvider } from './lib/MarketContext';
import LandingPage from './pages/LandingPage';
import MarketsPage from './pages/MarketsPage';
import MarketDetailPage from './pages/MarketDetailPage';
import ResolutionDashboard from './pages/ResolutionDashboard';
import PortfolioPage from './pages/PortfolioPage';
import CreateMarketPage from './pages/CreateMarketPage';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <WalletProvider>
        <MarketProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/markets" element={<MarketsPage />} />
              <Route path="/market/:id" element={<MarketDetailPage />} />
              <Route path="/resolution" element={<ResolutionDashboard />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/create" element={<CreateMarketPage />} />
            </Routes>
          </Layout>
        </MarketProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;

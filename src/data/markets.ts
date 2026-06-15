export interface MarketTemplate {
  title: string;
  description: string;
  resolution_source: string;
  resolution_criteria: string;
}

export const categoryTemplates: Record<string, { resolution_source: string; resolution_criteria: string }> = {
  sports: {
    resolution_source: 'ESPN, BBC Sport, official league websites',
    resolution_criteria: 'AI validators will check scores from official sports data providers. Resolution based on verified final results.',
  },
  crypto: {
    resolution_source: 'CoinGecko, CoinMarketCap, major exchange price feeds',
    resolution_criteria: 'AI validators will verify historical price data from multiple cryptocurrency data sources. Resolution based on verified price at specified time.',
  },
  technology: {
    resolution_source: 'Official announcements, verified news sources, academic publications',
    resolution_criteria: 'AI validators will analyze official statements and verified reports. Resolution based on consensus of multiple trusted sources.',
  },
  politics: {
    resolution_source: 'Official government websites, Reuters, AP News',
    resolution_criteria: 'AI validators will verify election results and official government announcements. Resolution based on certified results.',
  },
  entertainment: {
    resolution_source: 'Official studio announcements, Box Office Mojo, verified entertainment news',
    resolution_criteria: 'AI validators will verify official announcements and box office data. Resolution based on verified results.',
  },
  science: {
    resolution_source: 'Nature, Science, official research institutions',
    resolution_criteria: 'AI validators will verify published research and official scientific announcements. Resolution based on peer-reviewed findings.',
  },
  finance: {
    resolution_source: 'Bloomberg, Reuters, official financial filings',
    resolution_criteria: 'AI validators will verify financial data from official sources. Resolution based on confirmed financial reports.',
  },
  'world-events': {
    resolution_source: 'Reuters, AP News, official government statements',
    resolution_criteria: 'AI validators will verify events from multiple trusted news sources. Resolution based on confirmed reports.',
  },
};

export const marketTemplates: Record<string, MarketTemplate[]> = {
  sports: [
    {
      title: 'Will Argentina win the 2026 FIFA World Cup?',
      description: 'Predict whether Argentina will defend their title and win the 2026 FIFA World Cup hosted by USA, Canada, and Mexico.',
      resolution_source: 'FIFA official website, BBC Sport, ESPN, major sports broadcasters',
      resolution_criteria: 'AI validators will verify the 2026 World Cup winner from official FIFA results. Resolution is YES if Argentina is crowned champion.',
    },
    {
      title: 'Will Brazil reach the 2026 World Cup final?',
      description: 'Predict whether Brazil will advance to the final match of the 2026 FIFA World Cup.',
      resolution_source: 'FIFA official website, major sports broadcasters, verified match results',
      resolution_criteria: 'AI validators will verify World Cup bracket results. Resolution is YES if Brazil plays in the final match.',
    },
    {
      title: 'Will the USMNT reach the 2026 World Cup quarter-finals?',
      description: 'Predict whether the United States Mens National Team will advance to at least the quarter-finals in the 2026 World Cup.',
      resolution_source: 'FIFA official results, USSoccer announcements, major sports news',
      resolution_criteria: 'AI validators will verify USMNT tournament progression. Resolution is YES if they reach quarter-finals or further.',
    },
    {
      title: 'Will a European team win the 2026 World Cup?',
      description: 'Predict whether a team from Europe (UEFA) will win the 2026 FIFA World Cup.',
      resolution_source: 'FIFA official results, UEFA announcements, sports news',
      resolution_criteria: 'AI validators will verify winning team confederation. Resolution is YES if UEFA team wins.',
    },
    {
      title: 'Will Mbappe win the 2026 World Cup Golden Boot?',
      description: 'Predict whether Kylian Mbappe will finish as top scorer of the 2026 FIFA World Cup.',
      resolution_source: 'FIFA official awards, BBC Sport, ESPN statistics',
      resolution_criteria: 'AI validators will verify official Golden Boot winner. Resolution is YES if Mbappe is awarded.',
    },
    {
      title: 'Will there be over 3.5 goals in the 2026 World Cup final?',
      description: 'Predict whether the 2026 FIFA World Cup final match will feature 4 or more total goals.',
      resolution_source: 'FIFA official match reports, major sports broadcasters',
      resolution_criteria: 'AI validators will verify final match score. Resolution is YES if both teams combined score 4+ goals.',
    },
    {
      title: 'Will Mexico advance past the Round of 16 in 2026 World Cup?',
      description: 'Predict whether Mexico will progress beyond the Round of 16 in their home World Cup.',
      resolution_source: 'FIFA official results, FMF announcements, sports news',
      resolution_criteria: 'AI validators will verify Mexico tournament progression. Resolution is YES if they reach quarter-finals or beyond.',
    },
    {
      title: 'Will VAR overturn more than 50 decisions in 2026 World Cup?',
      description: 'Predict whether Video Assistant Referee will overturn more than 50 on-field decisions during the tournament.',
      resolution_source: 'FIFA VAR statistics, referee reports, sports analytics',
      resolution_criteria: 'AI validators will count official VAR overturn statistics. Resolution is YES if count exceeds 50.',
    },
    {
      title: 'Will Manchester City win the Premier League 2026?',
      description: 'Predict whether Manchester City will win the Premier League title in the 2025-26 season.',
      resolution_source: 'Official Premier League website, BBC Sport, ESPN',
      resolution_criteria: 'AI validators will verify the final Premier League standings. Resolution is YES if Manchester City is champion.',
    },
    {
      title: 'Will Real Madrid win the 2026 Champions League?',
      description: 'Predict whether Real Madrid will win the UEFA Champions League in the 2025-26 season.',
      resolution_source: 'UEFA official website, BBC Sport, ESPN FC',
      resolution_criteria: 'AI validators will verify Champions League winner. Resolution is YES if Real Madrid wins the trophy.',
    },
    {
      title: 'Will LeBron James retire before the 2026-27 NBA season?',
      description: 'Predict whether LeBron James will officially announce retirement before the 2026-27 NBA season begins.',
      resolution_source: 'NBA official announcements, Lakers statements, LeBron social media',
      resolution_criteria: 'AI validators will verify official retirement announcement. Resolution is YES if LeBron announces retirement.',
    },
    {
      title: 'Will Tiger Woods win a major in 2026?',
      description: 'Predict whether Tiger Woods will win any golf major championship in 2026.',
      resolution_source: 'PGA Tour, Masters, US Open, Open Championship, PGA Championship official results',
      resolution_criteria: 'AI validators will verify major championship winners. Resolution is YES if Tiger wins any of the four majors.',
    },
    {
      title: 'Will F1 have a first-time champion in 2026?',
      description: 'Predict whether Formula 1 will crown a first-time world champion driver in 2026.',
      resolution_source: 'Formula 1 official website, FIA announcements, motorsport news',
      resolution_criteria: 'AI validators will verify if champion has never won before. Resolution is YES if first-time winner is crowned.',
    },
    {
      title: 'Will the Los Angeles Dodgers repeat as World Series champions in 2026?',
      description: 'Predict whether the LA Dodgers will win the 2026 World Series.',
      resolution_source: 'MLB official results, ESPN, baseball news',
      resolution_criteria: 'AI validators will verify World Series winner. Resolution is YES if Dodgers are 2026 champions.',
    },
    {
      title: 'Will an African team reach 2026 World Cup semi-finals?',
      description: 'Predict whether any African nation will reach the semi-finals of the 2026 FIFA World Cup.',
      resolution_source: 'FIFA official results, CAF announcements, sports news',
      resolution_criteria: 'AI validators will verify tournament bracket. Resolution is YES if African team reaches semi-finals.',
    },
    {
      title: 'Will Lionel Messi play in the 2026 World Cup?',
      description: 'Predict whether Lionel Messi will participate in the 2026 FIFA World Cup.',
      resolution_source: 'FIFA squad lists, Argentina FA announcements, Messi statements',
      resolution_criteria: 'AI validators will verify official World Cup rosters. Resolution is YES if Messi is on Argentina squad.',
    },
  ],
  crypto: [
    {
      title: 'Will Bitcoin reach $200,000 by end of 2026?',
      description: 'Predict whether Bitcoin will reach or exceed the price of $200,000 USD at any point during 2026.',
      resolution_source: 'CoinGecko, CoinMarketCap, Binance, major exchange price feeds',
      resolution_criteria: 'AI validators will verify historical price data from multiple sources. Resolution is YES if any verified source shows BTC/USD >= $200,000 in 2026.',
    },
    {
      title: 'Will Bitcoin hit a new all-time high in 2026?',
      description: 'Predict whether Bitcoin will break its previous all-time high price record during 2026.',
      resolution_source: 'CoinGecko, CoinMarketCap, trading data',
      resolution_criteria: 'AI validators will compare 2026 prices to historical ATH. Resolution is YES if BTC exceeds previous record.',
    },
    {
      title: 'Will Ethereum exceed $15,000 in 2026?',
      description: 'Predict whether Ethereum price will reach $15,000 or higher during 2026.',
      resolution_source: 'CoinGecko, CoinMarketCap, major exchanges',
      resolution_criteria: 'AI validators will verify ETH price data. Resolution is YES if ETH >= $15,000 at any verified point in 2026.',
    },
    {
      title: 'Will Ethereum flip Bitcoin in market cap by 2026?',
      description: 'Predict whether Ethereum market capitalization will exceed Bitcoin at any point in 2026.',
      resolution_source: 'CoinGecko, CoinMarketCap historical data',
      resolution_criteria: 'AI validators will check daily market cap data. Resolution YES if ETH market cap > BTC market cap for any 24-hour period in 2026.',
    },
    {
      title: 'Will Solana enter top 3 crypto by market cap in 2026?',
      description: 'Predict whether Solana will reach a top 3 position by total market capitalization during 2026.',
      resolution_source: 'CoinGecko, CoinMarketCap rankings',
      resolution_criteria: 'AI validators will verify ranking positions. Resolution is YES if Solana is ranked #3 or higher at any point in 2026.',
    },
    {
      title: 'Will XRP exceed $5 in 2026?',
      description: 'Predict whether XRP price will reach $5 or higher during 2026.',
      resolution_source: 'CoinGecko, CoinMarketCap, exchanges',
      resolution_criteria: 'AI validators will verify XRP price data. Resolution is YES if XRP >= $5.',
    },
    {
      title: 'Will a major exchange delist Tether (USDT) in 2026?',
      description: 'Predict whether any top 10 cryptocurrency exchange will delist Tether stablecoin in 2026.',
      resolution_source: 'Exchange announcements, crypto news media, official exchange statements',
      resolution_criteria: 'AI validators will verify official delisting announcements from major exchanges. Resolution is YES if any top 10 exchange delists USDT.',
    },
    {
      title: 'Will total crypto market cap exceed $5 trillion in 2026?',
      description: 'Predict whether the total cryptocurrency market capitalization will surpass $5 trillion.',
      resolution_source: 'CoinGecko, CoinMarketCap total market data',
      resolution_criteria: 'AI validators will verify total market cap data. Resolution is YES if total crypto market cap >= $5T.',
    },
    {
      title: 'Will DeFi TVL reach $300 billion in 2026?',
      description: 'Predict whether Total Value Locked in DeFi protocols reaches $300 billion.',
      resolution_source: 'DeFi Llama, DeFi Pulse, protocol analytics',
      resolution_criteria: 'AI validators will verify TVL metrics from trusted aggregators. Resolution is YES if TVL reaches or exceeds $300B.',
    },
    {
      title: 'Will the first spot Bitcoin ETF exceed $50B AUM in 2026?',
      description: 'Predict whether any spot Bitcoin ETF will have over $50 billion in assets under management.',
      resolution_source: 'ETF provider reports, SEC filings, financial news',
      resolution_criteria: 'AI validators will verify ETF AUM data. Resolution is YES if any spot BTC ETF exceeds $50B AUM.',
    },
    {
      title: 'Will Coinbase stock exceed $500 per share in 2026?',
      description: 'Predict whether Coinbase Global Inc (COIN) stock price will exceed $500 during 2026.',
      resolution_source: 'NASDAQ, Yahoo Finance, Bloomberg',
      resolution_criteria: 'AI validators will check daily stock prices. Resolution is YES if COIN trades above $500 at any verified point.',
    },
    {
      title: 'Will a country adopt Bitcoin as legal tender in 2026?',
      description: 'Predict whether any sovereign nation will officially adopt Bitcoin as legal tender in 2026.',
      resolution_source: 'Government announcements, central bank statements, verified news',
      resolution_criteria: 'AI validators will verify official legislation. Resolution is YES if any country adopts BTC as legal tender.',
    },
    {
      title: 'Will NFT trading volume exceed $20B in 2026?',
      description: 'Predict whether total NFT trading volume across all platforms exceeds $20 billion in 2026.',
      resolution_source: 'DappRadar, NonFungible, CryptoSlam, major NFT marketplace data',
      resolution_criteria: 'AI validators will aggregate verified trading volume data. Resolution is YES if total exceeds $20B for the year.',
    },
    {
      title: 'Will Bitcoin ETF inflows exceed $100B in 2026?',
      description: 'Predict whether total inflows into Bitcoin ETFs will exceed $100 billion in 2026.',
      resolution_source: 'ETF flow reports, Bloomberg, financial news',
      resolution_criteria: 'AI validators will aggregate ETF flow data. Resolution is YES if total inflows exceed $100B.',
    },
  ],
  technology: [
    {
      title: 'Will OpenAI release GPT-5 in 2026?',
      description: 'Predict whether OpenAI will officially release GPT-5 model during 2026.',
      resolution_source: 'OpenAI official announcements, tech news media, OpenAI social media',
      resolution_criteria: 'AI validators will verify official release announcements from OpenAI. Resolution is YES if GPT-5 is publicly released in 2026.',
    },
    {
      title: 'Will Apple release AR glasses in 2026?',
      description: 'Predict whether Apple will launch consumer AR glasses product in 2026.',
      resolution_source: 'Apple press releases, Apple events, verified tech journalism',
      resolution_criteria: 'AI validators will verify official Apple product announcements. Resolution is YES if AR glasses are officially released.',
    },
    {
      title: 'Will Tesla achieve Level 5 autonomous driving in 2026?',
      description: 'Predict whether Tesla will achieve full Level 5 autonomous driving capability in 2026.',
      resolution_source: 'Tesla official announcements, NHTSA reports, verified tech testing',
      resolution_criteria: 'AI validators will verify official Tesla statements and regulatory approvals. Resolution is YES if Level 5 is achieved.',
    },
    {
      title: 'Will quantum computing break RSA encryption in 2026?',
      description: 'Predict whether a quantum computer will demonstrate ability to break RSA encryption in 2026.',
      resolution_source: 'Academic publications, NIST announcements, quantum computing research papers',
      resolution_criteria: 'AI validators will verify peer-reviewed research. Resolution is YES if RSA-breaking capability is demonstrated.',
    },
    {
      title: 'Will SpaceX successfully land on Mars in 2026?',
      description: 'Predict whether SpaceX will successfully land a spacecraft on Mars during 2026.',
      resolution_source: 'SpaceX official updates, NASA announcements, space news',
      resolution_criteria: 'AI validators will verify official landing confirmation from SpaceX or NASA. Resolution is YES if successful landing occurs.',
    },
    {
      title: 'Will 6G networks be commercially available in 2026?',
      description: 'Predict whether 6G cellular networks will be commercially available to consumers in 2026.',
      resolution_source: 'Telecom carrier announcements, 3GPP standards, tech news',
      resolution_criteria: 'AI validators will verify commercial 6G launches. Resolution is YES if any carrier offers 6G service.',
    },
    {
      title: 'Will Apple release an foldable iPhone in 2026?',
      description: 'Predict whether Apple will release a foldable iPhone model in 2026.',
      resolution_source: 'Apple press releases, supply chain reports, verified leaks',
      resolution_criteria: 'AI validators will verify official Apple product announcements. Resolution is YES if foldable iPhone is released.',
    },
    {
      title: 'Will self-driving taxis be available in 10+ US cities in 2026?',
      description: 'Predict whether autonomous taxi services will operate in 10 or more US cities by end of 2026.',
      resolution_source: 'Waymo, Cruise, city permits, transportation department records',
      resolution_criteria: 'AI validators will verify operating permits and service availability. Resolution is YES if 10+ cities have active services.',
    },
    {
      title: 'Will Bitcoin be accepted as payment by a FAANG company in 2026?',
      description: 'Predict whether any FAANG company (Meta, Apple, Amazon, Netflix, Google) will accept Bitcoin as payment in 2026.',
      resolution_source: 'Company official announcements, payment integration news',
      resolution_criteria: 'AI validators will verify official company statements. Resolution is YES if any FAANG accepts BTC payments.',
    },
    {
      title: 'Will China release an AI model superior to GPT-5 in 2026?',
      description: 'Predict whether a Chinese AI company will release a model that outperforms GPT-5 on major benchmarks in 2026.',
      resolution_source: 'AI benchmark results, official company announcements, peer reviews',
      resolution_criteria: 'AI validators will verify benchmark comparisons. Resolution is YES if Chinese model outperforms GPT-5.',
    },
  ],
  politics: [
    {
      title: 'Will there be a government shutdown in the US in 2026?',
      description: 'Predict whether the US federal government will experience a shutdown during 2026.',
      resolution_source: 'Official government announcements, congressional records, verified news',
      resolution_criteria: 'AI validators will verify official shutdown declarations. Resolution is YES if government shuts down.',
    },
    {
      title: 'Will a new country join the European Union in 2026?',
      description: 'Predict whether a new member state will officially join the EU during 2026.',
      resolution_source: 'Official EU announcements, European Council statements',
      resolution_criteria: 'AI validators will verify official EU accession. Resolution is YES if new member joins.',
    },
    {
      title: 'Will there be a peace agreement between Russia and Ukraine in 2026?',
      description: 'Predict whether Russia and Ukraine will sign a formal peace agreement in 2026.',
      resolution_source: 'Official government statements, UN announcements, verified news',
      resolution_criteria: 'AI validators will verify official peace agreement. Resolution is YES if agreement is signed.',
    },
    {
      title: 'Will Taiwan declare independence in 2026?',
      description: 'Predict whether Taiwan will formally declare independence from China in 2026.',
      resolution_source: 'Official government statements, UN records, verified news',
      resolution_criteria: 'AI validators will verify official declaration. Resolution is YES if Taiwan declares independence.',
    },
    {
      title: 'Will a major country implement universal basic income in 2026?',
      description: 'Predict whether a major economy will implement a UBI program in 2026.',
      resolution_source: 'Official government policy announcements, economic news',
      resolution_criteria: 'AI validators will verify official UBI implementation. Resolution is YES if program launches.',
    },
    {
      title: 'Will the WHO declare a new pandemic in 2026?',
      description: 'Predict whether the World Health Organization will declare a new pandemic in 2026.',
      resolution_source: 'Official WHO announcements, health ministry statements',
      resolution_criteria: 'AI validators will verify official WHO pandemic declaration. Resolution is YES if declared.',
    },
    {
      title: 'Will a nuclear disarmament treaty be signed in 2026?',
      description: 'Predict whether a major nuclear disarmament treaty will be signed in 2026.',
      resolution_source: 'Official government statements, UN treaties database',
      resolution_criteria: 'AI validators will verify official treaty signing. Resolution is YES if treaty is signed.',
    },
    {
      title: 'Will there be mass protests in more than 5 countries simultaneously in 2026?',
      description: 'Predict whether mass protests will occur in 5+ countries at the same time during 2026.',
      resolution_source: 'News reports, government statements, verified social media',
      resolution_criteria: 'AI journalists will verify coordinated protests across multiple countries. Resolution is YES if 5+ countries experience simultaneous mass protests.',
    },
    {
      title: 'Will a new country gain UN membership in 2026?',
      description: 'Predict whether a new member state will be admitted to the United Nations in 2026.',
      resolution_source: 'Official UN General Assembly records',
      resolution_criteria: 'AI validators will verify official UN membership admissions. Resolution is YES if new member is admitted.',
    },
    {
      title: 'Will a major cryptocurrency be banned in the EU in 2026?',
      description: 'Predict whether the EU will officially ban a major cryptocurrency in 2026.',
      resolution_source: 'Official EU regulations, European Central Bank statements',
      resolution_criteria: 'AI validators will verify official EU ban. Resolution is YES if ban is enacted.',
    },
  ],
  entertainment: [
    {
      title: 'Will a streaming service reach 300M subscribers in 2026?',
      description: 'Predict whether Netflix, Disney+, or another streaming service will reach 300 million subscribers in 2026.',
      resolution_source: 'Official company earnings reports, verified subscriber data',
      resolution_criteria: 'AI validators will verify official subscriber counts. Resolution is YES if any service reaches 300M.',
    },
    {
      title: 'Will a Marvel movie gross over $2B in 2026?',
      description: 'Predict whether a Marvel Cinematic Universe film will earn over $2 billion worldwide in 2026.',
      resolution_source: 'Box Office Mojo, official studio announcements',
      resolution_criteria: 'AI validators will verify box office totals. Resolution is YES if any Marvel film exceeds $2B.',
    },
    {
      title: 'Will AI generate a #1 Billboard song in 2026?',
      description: 'Predict whether an AI-generated song will reach #1 on the Billboard Hot 100 in 2026.',
      resolution_source: 'Official Billboard charts, verified production credits',
      resolution_criteria: 'AI journalists will verify song production credits. Resolution is YES if AI-generated song reaches #1.',
    },
    {
      title: 'Will a video game sell over 100M copies in 2026?',
      description: 'Predict whether any video game will sell over 100 million copies in 2026.',
      resolution_source: 'Official publisher reports, verified sales data',
      resolution_criteria: 'AI journalists will verify official sales figures. Resolution is YES if any game exceeds 100M copies.',
    },
    {
      title: 'Will Netflix win an Academy Award for Best Picture in 2026?',
      description: 'Predict whether a Netflix original film will win the Oscar for Best Picture in 2026.',
      resolution_source: 'Official Academy Awards results',
      resolution_criteria: 'AI journalists will verify official Oscar results. Resolution is YES if Netflix film wins Best Picture.',
    },
    {
      title: 'Will a K-pop group debut in the US top 10 in 2026?',
      description: 'Predict whether a K-pop group will have a song debut in the US Billboard Hot 100 top 10 in 2026.',
      resolution_source: 'Official Billboard charts, verified K-pop releases',
      resolution_criteria: 'AI journalists will verify chart positions. Resolution is YES if K-pop group debuts in top 10.',
    },
    {
      title: 'Will a new Star Wars movie be released in 2026?',
      description: 'Predict whether Disney will release a new Star Wars theatrical film in 2026.',
      resolution_source: 'Official Disney/Lucasfilm announcements',
      resolution_criteria: 'AI journalists will verify official release announcements. Resolution is YES if new Star Wars film is released.',
    },
    {
      title: 'Will a movie based on a video game gross over $1B in 2026?',
      description: 'Predict whether a video game adaptation film will earn over $1 billion worldwide in 2026.',
      resolution_source: 'Box Office Mojo, official studio reports',
      resolution_criteria: 'AI journalists will verify box office totals. Resolution is YES if any game adaptation exceeds $1B.',
    },
    {
      title: 'Will TikTok be banned in the US in 2026?',
      description: 'Predict whether TikTok will be officially banned in the United States in 2026.',
      resolution_source: 'Official government statements, court rulings',
      resolution_criteria: 'AI journalists will verify official ban. Resolution is YES if TikTok is banned.',
    },
    {
      title: 'Will a YouTube creator reach 100M subscribers in 2026?',
      description: 'Predict whether any YouTube channel will reach 100 million subscribers in 2026.',
      resolution_source: 'Official YouTube subscriber counts, verified creator data',
      resolution_criteria: 'AI journalists will verify subscriber milestones. Resolution is YES if any channel reaches 100M.',
    },
  ],
  science: [
    {
      title: 'Will a new exoplanet be discovered in the habitable zone in 2026?',
      description: 'Predict whether astronomers will confirm discovery of a new exoplanet in the habitable zone in 2026.',
      resolution_source: 'NASA Exoplanet Archive, peer-reviewed publications',
      resolution_criteria: 'AI validators will verify official exoplanet discoveries. Resolution is YES if new habitable zone planet confirmed.',
    },
    {
      title: 'Will a nuclear fusion reactor generate net positive energy in 2026?',
      description: 'Predict whether a fusion reactor will demonstrate sustained net energy gain in 2026.',
      resolution_source: 'Official research institution announcements, peer-reviewed publications',
      resolution_criteria: 'AI validators will verify energy output data. Resolution is YES if net positive energy is achieved.',
    },
    {
      title: 'Will a CRISPR therapy be approved for a common disease in 2026?',
      description: 'Predict whether FDA or EMA will approve a CRISPR-based therapy for treating a common disease in 2026.',
      resolution_source: 'Official FDA/EMA approval announcements',
      resolution_criteria: 'AI validators will verify regulatory approvals. Resolution is YES if CRISPR therapy is approved.',
    },
    {
      title: 'Will a new element be synthesized in 2026?',
      description: 'Predict whether scientists will successfully synthesize a new chemical element in 2026.',
      resolution_source: 'IUPAC announcements, peer-reviewed physics publications',
      resolution_criteria: 'AI validators will verify element synthesis claims. Resolution is YES if new element is confirmed.',
    },
    {
      title: 'Will a major AI breakthrough in protein folding be announced in 2026?',
      description: 'Predict whether a significant advancement in protein structure prediction will be published in 2026.',
      resolution_source: 'Nature, Science, CASP competition results',
      resolution_criteria: 'AI validators will verify peer-reviewed publications. Resolution is YES if breakthrough is confirmed.',
    },
    {
      title: 'Will scientists successfully clone an endangered species in 2026?',
      description: 'Predict whether scientists will successfully clone an endangered animal species in 2026.',
      resolution_source: 'Official research institution announcements, peer-reviewed publications',
      resolution_criteria: 'AI validators will verify official cloning announcements. Resolution is YES if successful cloning occurs.',
    },
    {
      title: 'Will a new type of battery with 2x energy density be announced in 2026?',
      description: 'Predict whether a battery technology with double current energy density will be demonstrated in 2026.',
      resolution_source: 'Official research publications, company announcements',
      resolution_criteria: 'AI journalists will verify energy density claims. Resolution is YES if breakthrough is demonstrated.',
    },
    {
      title: 'Will a major breakthrough in cancer treatment be announced in 2026?',
      description: 'Predict whether a significant advancement in cancer therapy will be published in 2026.',
      resolution_source: 'Official medical journal publications, FDA announcements',
      resolution_criteria: 'AI validators will verify peer-reviewed publications. Resolution is YES if breakthrough is confirmed.',
    },
    {
      title: 'Will a new high-temperature superconductor be discovered in 2026?',
      description: 'Predict whether a new superconducting material operating at higher temperatures will be discovered in 2026.',
      resolution_source: 'Peer-reviewed physics publications, official research announcements',
      resolution_criteria: 'AI validators will verify superconductor claims. Resolution is YES if new material is confirmed.',
    },
    {
      title: 'Will scientists map a complete human brain connectome in 2026?',
      description: 'Predict whether researchers will publish a complete map of neural connections in a human brain in 2026.',
      resolution_source: 'Official research institution announcements, peer-reviewed publications',
      resolution_criteria: 'AI validators will verify connectome mapping claims. Resolution is YES if complete map is published.',
    },
  ],
  finance: [
    {
      title: 'Will the US Federal Reserve cut interest rates in 2026?',
      description: 'Predict whether the Federal Reserve will cut the federal funds rate during 2026.',
      resolution_source: 'Official Federal Reserve announcements, FOMC statements',
      resolution_criteria: 'AI journalists will verify official Fed announcements. Resolution is YES if rate cut occurs.',
    },
    {
      title: 'Will the S&P 500 reach 6,000 in 2026?',
      description: 'Predict whether the S&P 500 index will reach or exceed 6,000 points during 2026.',
      resolution_source: 'Official market data from NYSE, NASDAQ',
      resolution_criteria: 'AI journalists will verify market index levels. Resolution is YES if S&P 500 reaches 6,000.',
    },
    {
      title: 'Will Gold reach $3,000 per ounce in 2026?',
      description: 'Predict whether gold price will reach $3,000 per troy ounce during 2026.',
      resolution_source: 'Bloomberg, Reuters, official precious metals markets',
      resolution_criteria: 'AI journalists will verify gold price data. Resolution is YES if gold reaches $3,000.',
    },
    {
      title: 'Will a major bank fail in 2026?',
      description: 'Predict whether a major global bank will fail or be bailed out in 2026.',
      resolution_source: 'Official banking regulator announcements, financial news',
      resolution_criteria: 'AI journalists will verify official bank failure declarations. Resolution is YES if major bank fails.',
    },
    {
      title: 'Will the US national debt exceed $40 trillion in 2026?',
      description: 'Predict whether US national debt will surpass $40 trillion during 2026.',
      resolution_source: 'US Treasury Department official data',
      resolution_criteria: 'AI journalists will verify Treasury Department data. Resolution is YES if debt exceeds $40T.',
    },
    {
      title: 'Will a country default on its sovereign debt in 2026?',
      description: 'Predict whether a sovereign nation will default on its debt obligations in 2026.',
      resolution_source: 'IMF, World Bank, financial news, government announcements',
      resolution_criteria: 'AI journalists will verify debt default announcements. Resolution is YES if country misses debt payments.',
    },
    {
      title: 'Will inflation in the US fall below 2% in 2026?',
      description: 'Predict whether US CPI inflation will fall below 2% during 2026.',
      resolution_source: 'Official Bureau of Labor Statistics data',
      resolution_criteria: 'AI journalists will verify official CPI data. Resolution is YES if inflation falls below 2%.',
    },
    {
      title: 'Will a major stock exchange implement T+0 settlement in 2026?',
      description: 'Predict whether a major stock exchange will implement same-day settlement in 2026.',
      resolution_source: 'Official exchange announcements, SEC filings',
      resolution_criteria: 'AI journalists will verify exchange implementation. Resolution is YES if T+0 settlement is implemented.',
    },
    {
      title: 'Will a country adopt a CBDC as primary currency in 2026?',
      description: 'Predict whether a country will launch a Central Bank Digital Currency as its primary currency in 2026.',
      resolution_source: 'Official central bank announcements',
      resolution_criteria: 'AI journalists will verify official CBDC launches. Resolution is YES if CBDC becomes primary currency.',
    },
    {
      title: 'Will Warren Buffett make a major acquisition over $50B in 2026?',
      description: 'Predict whether Berkshire Hathaway will complete an acquisition valued over $50 billion in 2026.',
      resolution_source: 'Official Berkshire Hathaway announcements, SEC filings',
      resolution_criteria: 'AI journalists will verify official acquisition announcements. Resolution is YES if $50B+ acquisition occurs.',
    },
  ],
};

export function getRandomMarketByCategory(slug: string): MarketTemplate | null {
  const templates = marketTemplates[slug];
  if (!templates || templates.length === 0) return null;
  return templates[Math.floor(Math.random() * templates.length)];
}

export function getRandomMarket(): MarketTemplate {
  const allSlugs = Object.keys(marketTemplates);
  const randomSlug = allSlugs[Math.floor(Math.random() * allSlugs.length)];
  return getRandomMarketByCategory(randomSlug)!;
}

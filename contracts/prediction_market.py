# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from dataclasses import dataclass
from genlayer import *


@gl.evm.contract_interface
class _Recipient:
    class View:
        pass
    class Write:
        pass


@allow_storage
@dataclass
class Market:
    creator: str
    title: str
    description: str
    resolution_source: str
    resolution_criteria: str
    end_date: u256
    status: str  # "active", "resolved", "cancelled"
    outcome: str  # "yes", "no", ""
    total_pool_yes: u256
    total_pool_no: u256
    total_bets: u256


@allow_storage
@dataclass
class Bet:
    bettor: str
    market_id: u256
    prediction: str  # "yes" or "no"
    amount: u256
    odds_at_bet: u256
    claimed: bool


class PredictionMarket(gl.Contract):
    market_counter: u256
    markets: TreeMap[u256, Market]
    bets: TreeMap[u256, Bet]
    bet_counter: u256
    platform_fee_percent: u256

    def __init__(self):
        self.market_counter = u256(0)
        self.bet_counter = u256(0)
        self.platform_fee_percent = u256(2)

    # ==================== Market Creation ====================

    @gl.public.write
    def create_market(
        self,
        title: str,
        description: str,
        resolution_source: str,
        resolution_criteria: str,
        end_date: u256,
    ) -> u256:
        if len(title) == 0:
            raise Exception("Title is required")
        if len(description) == 0:
            raise Exception("Description is required")
        if end_date <= u256(0):
            raise Exception("End date must be in the future")

        market_id = self.market_counter
        self.markets[market_id] = Market(
            creator=str(gl.message.sender_address).lower(),
            title=title,
            description=description,
            resolution_source=resolution_source,
            resolution_criteria=resolution_criteria,
            end_date=end_date,
            status="active",
            outcome="",
            total_pool_yes=u256(0),
            total_pool_no=u256(0),
            total_bets=u256(0),
        )
        self.market_counter = market_id + u256(1)
        return market_id

    @gl.public.write
    def update_resolution_source(self, market_id: u256, new_source: str) -> None:
        market = self.markets[market_id]
        if market.status != "active":
            raise Exception("Market is not active")
        if str(gl.message.sender_address).lower() != market.creator.lower():
            raise Exception("Only creator can update")
        market.resolution_source = new_source
        self.markets[market_id] = market

    # ==================== Betting ====================

    @gl.public.write.payable
    def place_bet(self, market_id: u256, prediction: str) -> u256:
        market = self.markets[market_id]
        if market.status != "active":
            raise Exception("Market is not active")
        if prediction not in ("yes", "no"):
            raise Exception("Prediction must be 'yes' or 'no'")

        amount = int(gl.message.value)
        if amount <= 0:
            raise Exception("Must send GEN to place bet")

        bet_id = self.bet_counter
        self.bets[bet_id] = Bet(
            bettor=str(gl.message.sender_address).lower(),
            market_id=market_id,
            prediction=prediction,
            amount=u256(amount),
            odds_at_bet=self._calculate_odds(market_id, prediction),
            claimed=False,
        )
        self.bet_counter = bet_id + u256(1)

        if prediction == "yes":
            market.total_pool_yes = market.total_pool_yes + u256(amount)
        else:
            market.total_pool_no = market.total_pool_no + u256(amount)
        market.total_bets = market.total_bets + u256(1)
        self.markets[market_id] = market

        return bet_id

    # ==================== Resolution ====================

    @gl.public.write
    def resolve_market(self, market_id: u256) -> str:
        market = self.markets[market_id]
        if market.status != "active":
            raise Exception("Market is not active")

        src = market.resolution_source
        title = market.title
        desc = market.description
        criteria = market.resolution_criteria

        def nondet() -> str:
            web_data = gl.nondet.web.render(src, mode="text")

            task = (
                'You are an impartial AI judge resolving a prediction market.\n'
                f'Market Title: {title}\n'
                f'Market Description: {desc}\n'
                f'Resolution Criteria: {criteria}\n'
                f'\nWeb page content:\n{web_data[:3000]}\n'
                '\nBased on the data above, determine the outcome.\n'
                'Return ONLY valid JSON: {"outcome":"yes"} or {"outcome":"no"}'
            )
            return gl.nondet.exec_prompt(task, response_format="json")

        raw = gl.eq_principle.prompt_comparative(
            nondet,
            "Both outputs must be valid JSON with exactly one key: 'outcome'. "
            "The value must be either 'yes' or 'no'. Whitespace and key order may differ.",
        )

        raw_str = str(raw).lower()
        if '"yes"' in raw_str or "'yes'" in raw_str or ': yes' in raw_str or ': "yes"' in raw_str:
            outcome = "yes"
        else:
            outcome = "no"

        market.outcome = outcome
        market.status = "resolved"
        self.markets[market_id] = market

        return outcome

    # ==================== Claims ====================

    @gl.public.write
    def claim_winnings(self, market_id: u256, bet_id: u256) -> u256:
        market = self.markets[market_id]
        if market.status != "resolved":
            raise Exception("Market is not resolved")

        bet = self.bets[bet_id]
        if bet.bettor.lower() != str(gl.message.sender_address).lower():
            raise Exception("Not your bet")
        if bet.claimed:
            raise Exception("Already claimed")
        if bet.prediction != market.outcome:
            raise Exception("Wrong prediction - you lost")

        payout = self._calculate_payout(market_id, bet_id)
        bet.claimed = True
        self.bets[bet_id] = bet

        _Recipient(Address(bet.bettor)).emit_transfer(value=payout)

        return payout

    # ==================== View Methods ====================

    @gl.public.view
    def get_market(self, market_id: u256) -> dict:
        if market_id >= self.market_counter:
            raise Exception("Market does not exist")
        market = self.markets[market_id]
        return {
            "id": int(market_id),
            "creator": market.creator,
            "title": market.title,
            "description": market.description,
            "resolution_source": market.resolution_source,
            "resolution_criteria": market.resolution_criteria,
            "end_date": int(market.end_date),
            "status": market.status,
            "outcome": market.outcome,
            "total_pool_yes": int(market.total_pool_yes),
            "total_pool_no": int(market.total_pool_no),
            "total_bets": int(market.total_bets),
        }

    @gl.public.view
    def get_bet(self, bet_id: u256) -> dict:
        bet = self.bets[bet_id]
        return {
            "id": int(bet_id),
            "bettor": bet.bettor,
            "market_id": int(bet.market_id),
            "prediction": bet.prediction,
            "amount": int(bet.amount),
            "odds_at_bet": int(bet.odds_at_bet),
            "claimed": bet.claimed,
        }

    @gl.public.view
    def get_odds(self, market_id: u256) -> dict:
        market = self.markets[market_id]
        total = market.total_pool_yes + market.total_pool_no
        if total == u256(0):
            return {"yes": 50, "no": 50}
        yes_odds = (market.total_pool_yes * u256(100)) / total
        no_odds = (market.total_pool_no * u256(100)) / total
        return {"yes": int(yes_odds), "no": int(no_odds)}

    @gl.public.view
    def get_market_count(self) -> u256:
        return self.market_counter

    @gl.public.view
    def get_bet_count(self) -> u256:
        return self.bet_counter

    # ==================== Aggregation Methods ====================

    @gl.public.view
    def get_bets_by_owner(self, owner: str) -> list:
        result = []
        owner_lower = owner.lower()
        for i in range(int(self.bet_counter)):
            bet = self.bets[u256(i)]
            if bet.bettor.lower() == owner_lower:
                market = self.markets[bet.market_id]
                result.append({
                    "id": i,
                    "bettor": bet.bettor,
                    "market_id": int(bet.market_id),
                    "prediction": bet.prediction,
                    "amount": int(bet.amount),
                    "odds_at_bet": int(bet.odds_at_bet),
                    "claimed": bet.claimed,
                    "market": {
                        "id": int(bet.market_id),
                        "title": market.title,
                        "description": market.description,
                        "status": market.status,
                        "outcome": market.outcome,
                        "total_pool_yes": int(market.total_pool_yes),
                        "total_pool_no": int(market.total_pool_no),
                        "end_date": int(market.end_date),
                    },
                })
        return result

    @gl.public.view
    def get_bets_by_market(self, market_id: u256) -> list:
        result = []
        for i in range(int(self.bet_counter)):
            bet = self.bets[u256(i)]
            if bet.market_id == market_id:
                result.append({
                    "id": i,
                    "bettor": bet.bettor,
                    "market_id": int(bet.market_id),
                    "prediction": bet.prediction,
                    "amount": int(bet.amount),
                    "odds_at_bet": int(bet.odds_at_bet),
                    "claimed": bet.claimed,
                })
        return result

    @gl.public.view
    def get_markets_by_status(self, status: str) -> list:
        result = []
        for i in range(int(self.market_counter)):
            market = self.markets[u256(i)]
            if market.status == status:
                result.append({
                    "id": i,
                    "creator": market.creator,
                    "title": market.title,
                    "description": market.description,
                    "resolution_source": market.resolution_source,
                    "resolution_criteria": market.resolution_criteria,
                    "end_date": int(market.end_date),
                    "status": market.status,
                    "outcome": market.outcome,
                    "total_pool_yes": int(market.total_pool_yes),
                    "total_pool_no": int(market.total_pool_no),
                    "total_bets": int(market.total_bets),
                })
        return result

    @gl.public.view
    def get_created_market_count(self, user: str) -> u256:
        count = u256(0)
        user_lower = user.lower()
        for i in range(int(self.market_counter)):
            market = self.markets[u256(i)]
            if market.creator.lower() == user_lower:
                count = count + u256(1)
        return count

    @gl.public.view
    def get_user_stats(self, user: str) -> dict:
        total_bets = 0
        wins = 0
        losses = 0
        total_wagered = u256(0)
        total_won = u256(0)
        user_lower = user.lower()

        for i in range(int(self.bet_counter)):
            bet = self.bets[u256(i)]
            if bet.bettor.lower() == user_lower:
                total_bets += 1
                total_wagered = total_wagered + bet.amount
                market = self.markets[bet.market_id]
                if market.status == "resolved":
                    if bet.prediction == market.outcome:
                        wins += 1
                        payout = self._calculate_payout(bet.market_id, u256(i))
                        total_won = total_won + payout
                    else:
                        losses += 1

        return {
            "total_bets": total_bets,
            "wins": wins,
            "losses": losses,
            "pending": total_bets - wins - losses,
            "total_wagered": int(total_wagered),
            "total_won": int(total_won),
        }

    @gl.public.view
    def get_platform_stats(self) -> dict:
        active = 0
        resolved = 0
        total_volume = u256(0)

        for i in range(int(self.market_counter)):
            market = self.markets[u256(i)]
            if market.status == "active":
                active += 1
            elif market.status == "resolved":
                resolved += 1
            total_volume = total_volume + market.total_pool_yes + market.total_pool_no

        return {
            "total_markets": int(self.market_counter),
            "active_markets": active,
            "resolved_markets": resolved,
            "total_bets": int(self.bet_counter),
            "total_volume": int(total_volume),
        }

    # ==================== Internal Helpers ====================

    def _calculate_odds(self, market_id: u256, prediction: str) -> u256:
        market = self.markets[market_id]
        total = market.total_pool_yes + market.total_pool_no
        if total == u256(0):
            return u256(50)
        if prediction == "yes":
            return (market.total_pool_yes * u256(100)) // total
        else:
            return (market.total_pool_no * u256(100)) // total

    def _calculate_payout(self, market_id: u256, bet_id: u256) -> u256:
        market = self.markets[market_id]
        bet = self.bets[bet_id]

        total_pool = market.total_pool_yes + market.total_pool_no
        if market.outcome == "yes":
            winning_pool = market.total_pool_yes
        else:
            winning_pool = market.total_pool_no

        if winning_pool == u256(0):
            return bet.amount

        payout = (bet.amount * total_pool) // winning_pool
        fee = (payout * self.platform_fee_percent) // u256(100)
        return payout - fee

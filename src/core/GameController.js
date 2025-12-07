/**
 * GameController - Orchestrates the entire game lifecycle
 */
import { ChartGenerator } from './ChartGenerator.js';
import { InvestmentManager } from './InvestmentManager.js';
import { BalanceManager } from './BalanceManager.js';
import { RoundTimer } from './RoundTimer.js';

export class GameController {
  constructor() {
    this.chartGenerator = new ChartGenerator();
    this.investmentManager = new InvestmentManager();
    this.balanceManager = new BalanceManager(1000);
    this.roundTimer = new RoundTimer();

    this.state = 'idle'; // idle, countdown, active, results
    this.currentRound = null;
    this.currentCoinName = null;
    this.animationFrameId = null;
    this.betAmount = 100;
    this.lastCashOutResult = null;

    this.listeners = {
      stateChange: [],
      priceUpdate: [],
      roundEnd: [],
      balanceUpdate: []
    };

    this.memeCoins = [
      '$COPE', '$FOMO', '$YOLO', '$MOON', '$REKT',
      '$DEGEN', '$WAGMI', '$NGMI', '$HODL', '$PUMP',
      '$DUMP', '$APE', '$GRUG', '$PONZI', '$SCAM',
      '$RUGPULL', '$BASED', '$CRINGE', '$GIGACHAD', '$WOJAK'
    ];

    this.lastCoinName = null;
  }

  /**
   * Start a new round
   */
  async startRound() {
    if (this.state !== 'idle') return;

    // Countdown phase
    this.state = 'countdown';
    this.emit('stateChange', { state: this.state });

    await this.sleep(3000); // 3 second countdown

    // Generate round
    const duration = Math.floor(Math.random() * 4) + 15; // 7-10 seconds
    this.currentRound = this.chartGenerator.generateChart(duration);
    this.currentCoinName = this.getRandomCoinName();

    // Log round info for debugging
    console.log(`🎲 Round Type: ${this.currentRound.type}`);
    console.log(`📈 Peak Multiplier: ${this.currentRound.peakMultiplier.toFixed(2)}x`);
    console.log(`⚡ Opening: Extreme Chaos (1.5-3s violent swings)`);

    // Reset round-specific managers
    this.investmentManager.reset();
    this.roundTimer.start(duration);
    this.lastCashOutResult = null;

    // Auto-invest at round start (Day 0, $1.00)
    if (this.balanceManager.hasSufficientFunds(this.betAmount)) {
      this.balanceManager.deduct(this.betAmount, 'investment');
      this.investmentManager.autoInvest(this.betAmount);
      this.emit('balanceUpdate', { balance: this.balanceManager.getBalance() });
    }

    // Start active round
    this.state = 'active';
    this.emit('stateChange', {
      state: this.state,
      round: this.currentRound,
      coinName: this.currentCoinName
    });

    // Start animation loop
    this.startAnimationLoop();
  }

  /**
   * Animation loop for active round
   */
  startAnimationLoop() {
    const animate = () => {
      if (this.state !== 'active') return;

      const elapsedTime = this.roundTimer.getElapsedTime();
      const currentPrice = this.chartGenerator.getPriceAtTime(
        this.currentRound.pricePoints,
        elapsedTime
      );
      const currentDay = this.roundTimer.getCurrentDay();

      // Emit price update
      this.emit('priceUpdate', {
        price: currentPrice,
        day: currentDay,
        time: elapsedTime
      });

      // Check if round is over
      if (this.roundTimer.isOver()) {
        this.endRound();
        return;
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * End the current round
   */
  endRound() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.roundTimer.stop();

    // Calculate results
    let result;
    if (this.investmentManager.hasActiveInvestments()) {
      // Player didn't cash out - lost everything
      result = this.investmentManager.markAsLost();
      result.profit = -result.totalLoss;
      result.multiplier = 0;
      result.outcome = 'loss';
    } else if (this.investmentManager.hasCashedOut && this.lastCashOutResult) {
      // Already cashed out - use stored result
      result = {
        outcome: 'cashed_out',
        profit: this.lastCashOutResult.totalProfit,
        multiplier: this.lastCashOutResult.multiplier,
        totalInvested: this.lastCashOutResult.totalInvested,
        currentValue: this.lastCashOutResult.currentValue
      };
    } else {
      // No investments
      result = {
        outcome: 'no_investment',
        profit: 0,
        multiplier: 0
      };
    }

    this.state = 'results';
    this.emit('roundEnd', {
      result,
      round: this.currentRound,
      coinName: this.currentCoinName
    });

    // Auto-start next round after 3 seconds
    setTimeout(() => {
      this.state = 'idle';
      this.emit('stateChange', { state: this.state });
      this.startRound();
    }, 3000);
  }

  /**
   * Player doubles down (adds second investment at current price)
   */
  doubleDown() {
    if (this.state !== 'active') {
      return { success: false, message: 'Round not active' };
    }

    if (!this.investmentManager.canDoubleDown()) {
      return { success: false, message: 'Cannot double down' };
    }

    // Check 70% time restriction
    const elapsedTime = this.roundTimer.getElapsedTime();
    const duration = this.currentRound.duration;
    const roundProgress = elapsedTime / duration;

    if (roundProgress > 0.70) {
      return { success: false, message: 'Too late to double down' };
    }

    // Check balance
    if (!this.balanceManager.hasSufficientFunds(this.betAmount)) {
      return { success: false, message: 'Insufficient funds' };
    }

    // Get current price
    const currentPrice = this.chartGenerator.getPriceAtTime(
      this.currentRound.pricePoints,
      elapsedTime
    );

    // Deduct from balance
    const deductResult = this.balanceManager.deduct(this.betAmount, 'investment');
    if (!deductResult.success) {
      return deductResult;
    }

    // Double down investment
    const doubleDownResult = this.investmentManager.doubleDown(
      this.betAmount,
      currentPrice,
      elapsedTime
    );

    this.emit('balanceUpdate', { balance: this.balanceManager.getBalance() });

    return {
      ...doubleDownResult,
      balance: this.balanceManager.getBalance()
    };
  }

  /**
   * Player cashes out
   */
  cashOut() {
    if (this.state !== 'active') {
      return { success: false, message: 'Round not active' };
    }

    if (!this.investmentManager.hasActiveInvestments()) {
      return { success: false, message: 'No active investments' };
    }

    // Get current price
    const elapsedTime = this.roundTimer.getElapsedTime();
    const currentPrice = this.chartGenerator.getPriceAtTime(
      this.currentRound.pricePoints,
      elapsedTime
    );

    // Cash out investments
    const cashOutResult = this.investmentManager.cashOut(currentPrice);
    if (!cashOutResult.success) {
      return cashOutResult;
    }

    // Add to balance
    this.balanceManager.add(cashOutResult.currentValue, 'cash_out');

    // Store cashout result for round end display
    this.lastCashOutResult = {
      totalProfit: cashOutResult.totalProfit,
      multiplier: cashOutResult.multiplier,
      totalInvested: cashOutResult.totalInvested,
      currentValue: cashOutResult.currentValue
    };

    this.emit('balanceUpdate', { balance: this.balanceManager.getBalance() });

    return {
      ...cashOutResult,
      balance: this.balanceManager.getBalance()
    };
  }

  /**
   * Get current price for UI display
   */
  getCurrentPrice() {
    if (this.state !== 'active' || !this.currentRound) return 1.0;

    const elapsedTime = this.roundTimer.getElapsedTime();
    return this.chartGenerator.getPriceAtTime(
      this.currentRound.pricePoints,
      elapsedTime
    );
  }

  /**
   * Get current profit/loss
   */
  getCurrentProfit() {
    if (!this.investmentManager.hasActiveInvestments()) {
      return { totalProfit: 0, positions: [] };
    }

    const currentPrice = this.getCurrentPrice();
    return this.investmentManager.calculateCurrentProfit(currentPrice);
  }

  /**
   * Set bet amount
   */
  setBetAmount(amount) {
    this.betAmount = Math.max(1, Math.floor(amount));
  }

  /**
   * Get random coin name (no repeats)
   */
  getRandomCoinName() {
    let availableCoins = this.memeCoins.filter(coin => coin !== this.lastCoinName);
    const coin = availableCoins[Math.floor(Math.random() * availableCoins.length)];
    this.lastCoinName = coin;
    return coin;
  }

  /**
   * Event listener system
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Utility sleep function
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get game state for debugging
   */
  getState() {
    return {
      state: this.state,
      balance: this.balanceManager.getBalance(),
      currentPrice: this.getCurrentPrice(),
      currentDay: this.roundTimer.getCurrentDay(),
      investments: this.investmentManager.getSummary(),
      currentProfit: this.getCurrentProfit(),
      coinName: this.currentCoinName
    };
  }
}

/**
 * InvestmentManager - Tracks player investments and calculates profit/loss
 */
export class InvestmentManager {
  constructor() {
    this.reset();
  }

  /**
   * Reset investments for new round
   */
  reset() {
    this.investments = [];
    this.hasDoubledDown = false;
    this.hasCashedOut = false;
  }

  /**
   * Auto-invest at round start (always at $1.00, Day 0)
   * @param {number} amount - Investment amount
   * @returns {Object} Investment result
   */
  autoInvest(amount) {
    const investment = {
      id: Date.now() + Math.random(),
      amount,
      entryPrice: 1.0,
      entryTime: 0,
      entryDay: 1,
      status: 'active',
      type: 'initial'
    };

    this.investments.push(investment);

    return { success: true, investment };
  }

  /**
   * Double down - add second investment at current price
   * @param {number} amount - Investment amount
   * @param {number} entryPrice - Current market price
   * @param {number} entryTime - Current time
   * @returns {Object} Investment result
   */
  doubleDown(amount, entryPrice, entryTime) {
    if (this.hasDoubledDown) {
      return { success: false, message: 'Already doubled down this round' };
    }

    if (this.hasCashedOut) {
      return { success: false, message: 'Already cashed out this round' };
    }

    if (this.investments.length === 0) {
      return { success: false, message: 'No initial investment' };
    }

    const investment = {
      id: Date.now() + Math.random(),
      amount,
      entryPrice,
      entryTime,
      entryDay: Math.floor(entryTime) + 1,
      status: 'active',
      type: 'doubled'
    };

    this.investments.push(investment);
    this.hasDoubledDown = true;

    return { success: true, investment };
  }

  /**
   * Calculate current profit/loss based on current price
   * @param {number} currentPrice - Current market price
   * @returns {Object} Profit data
   */
  calculateCurrentProfit(currentPrice) {
    if (this.investments.length === 0) {
      return {
        totalProfit: 0,
        totalInvested: 0,
        currentValue: 0,
        multiplier: 0,
        positions: []
      };
    }

    let totalInvested = 0;
    let currentValue = 0;
    const positions = [];

    for (const inv of this.investments) {
      const invested = inv.amount;
      const multiplier = currentPrice / inv.entryPrice;
      const value = invested * multiplier;
      const profit = value - invested;

      totalInvested += invested;
      currentValue += value;

      positions.push({
        ...inv,
        multiplier,
        value,
        profit
      });
    }

    const totalProfit = currentValue - totalInvested;
    const overallMultiplier = currentValue / totalInvested;

    return {
      totalProfit,
      totalInvested,
      currentValue,
      multiplier: overallMultiplier,
      positions
    };
  }

  /**
   * Cash out all investments
   * @param {number} currentPrice - Current market price
   * @returns {Object} Cash out result
   */
  cashOut(currentPrice) {
    if (this.investments.length === 0) {
      return { success: false, message: 'No active investments' };
    }

    if (this.hasCashedOut) {
      return { success: false, message: 'Already cashed out' };
    }

    const profitData = this.calculateCurrentProfit(currentPrice);
    this.hasCashedOut = true;

    // Mark all investments as cashed out
    this.investments.forEach(inv => {
      inv.status = 'cashed_out';
    });

    return {
      success: true,
      ...profitData
    };
  }

  /**
   * Mark all investments as lost (round ended without cash out)
   * @returns {Object} Loss result
   */
  markAsLost() {
    if (this.investments.length === 0) {
      return { success: false, totalLoss: 0 };
    }

    let totalLoss = 0;
    this.investments.forEach(inv => {
      inv.status = 'lost';
      totalLoss += inv.amount;
    });

    return {
      success: true,
      totalLoss,
      totalInvested: totalLoss
    };
  }

  /**
   * Check if can double down
   * @returns {boolean}
   */
  canDoubleDown() {
    return !this.hasDoubledDown && !this.hasCashedOut && this.investments.length > 0;
  }

  /**
   * Check if has active investments
   * @returns {boolean}
   */
  hasActiveInvestments() {
    return this.investments.length > 0 && !this.hasCashedOut;
  }

  /**
   * Get investment summary
   * @returns {Object}
   */
  getSummary() {
    return {
      totalInvestments: this.investments.length,
      hasDoubledDown: this.hasDoubledDown,
      hasCashedOut: this.hasCashedOut,
      canDoubleDown: this.canDoubleDown(),
      investments: this.investments
    };
  }
}

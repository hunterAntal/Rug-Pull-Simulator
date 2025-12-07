/**
 * BalanceManager - Manages player balance and transactions
 */
export class BalanceManager {
  constructor(initialBalance = 1000) {
    // this.balance = this.loadBalance() || initialBalance;
    this.balance = initialBalance;
    this.initialBalance = initialBalance;
    this.transactionHistory = [];
  }

  /**
   * Get current balance
   * @returns {number}
   */
  getBalance() {
    return this.balance;
  }

  /**
   * Check if player has sufficient funds
   * @param {number} amount
   * @returns {boolean}
   */
  hasSufficientFunds(amount) {
    return this.balance >= amount;
  }

  /**
   * Deduct amount from balance
   * @param {number} amount
   * @param {string} reason
   * @returns {Object} Transaction result
   */
  deduct(amount, reason = 'investment') {
    if (!this.hasSufficientFunds(amount)) {
      return {
        success: false,
        message: 'Insufficient funds',
        balance: this.balance
      };
    }

    this.balance -= amount;
    this.recordTransaction(-amount, reason);
    this.saveBalance();

    return {
      success: true,
      balance: this.balance,
      amount: -amount
    };
  }

  /**
   * Add amount to balance
   * @param {number} amount
   * @param {string} reason
   * @returns {Object} Transaction result
   */
  add(amount, reason = 'cash_out') {
    this.balance += amount;
    this.recordTransaction(amount, reason);
    this.saveBalance();

    return {
      success: true,
      balance: this.balance,
      amount: amount
    };
  }

  /**
   * Record transaction in history
   * @param {number} amount - Positive for credits, negative for debits
   * @param {string} reason
   */
  recordTransaction(amount, reason) {
    this.transactionHistory.push({
      amount,
      reason,
      timestamp: Date.now(),
      balanceAfter: this.balance
    });

    // Keep only last 100 transactions
    if (this.transactionHistory.length > 100) {
      this.transactionHistory.shift();
    }
  }

  /**
   * Reset balance to initial amount
   */
  reset() {
    this.balance = this.initialBalance;
    this.transactionHistory = [];
    this.saveBalance();
  }

  /**
   * Save balance to localStorage
   */
  saveBalance() {
    try {
      localStorage.setItem('playerBalance', this.balance.toString());
    } catch (e) {
      console.warn('Could not save balance to localStorage:', e);
    }
  }

  /**
   * Load balance from localStorage
   * @returns {number|null}
   */
  loadBalance() {
    try {
      const saved = localStorage.getItem('playerBalance');
      return saved ? parseFloat(saved) : null;
    } catch (e) {
      console.warn('Could not load balance from localStorage:', e);
      return null;
    }
  }

  /**
   * Get transaction history
   * @param {number} limit - Number of recent transactions
   * @returns {Array}
   */
  getHistory(limit = 10) {
    return this.transactionHistory.slice(-limit);
  }

  /**
   * Format balance as currency string
   * @param {number} amount
   * @returns {string}
   */
  static formatCurrency(amount) {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}$${amount.toFixed(2)}`;
  }
}

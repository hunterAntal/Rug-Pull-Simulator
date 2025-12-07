/**
 * UIRenderer - Handles all UI rendering and chart animation
 */
export class UIRenderer {
  constructor(gameController) {
    this.game = gameController;
    this.initializeElements();
    this.setupCanvas();
    this.priceHistory = [];
    this.maxHistoryPoints = 1000;
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    this.elements = {
      coinName: document.getElementById('coinName'),
      balance: document.getElementById('balance'),
      dayCounter: document.getElementById('dayCounter'),
      currentPrice: document.getElementById('currentPrice'),
      canvas: document.getElementById('priceChart'),
      betAmount: document.getElementById('betAmount'),
      investBtn: document.getElementById('investBtn'),
      cashOutBtn: document.getElementById('cashOutBtn'),
      positionsList: document.getElementById('positionsList'),
      currentProfit: document.getElementById('currentProfit'),
      tickerText: document.getElementById('tickerText'),
      resultsOverlay: document.getElementById('resultsOverlay'),
      resultsTitle: document.getElementById('resultsTitle'),
      resultsProfit: document.getElementById('resultsProfit'),
      resultsMultiplier: document.getElementById('resultsMultiplier')
    };
  }

  /**
   * Setup canvas for chart
   */
  setupCanvas() {
    this.ctx = this.elements.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  /**
   * Resize canvas to fit container
   */
  resizeCanvas() {
    const container = this.elements.canvas.parentElement;
    const rect = container.getBoundingClientRect();

    this.elements.canvas.width = rect.width - 40;
    this.elements.canvas.height = 400;
  }

  /**
   * Update UI based on game state
   */
  update(state) {
    this.updateBalance();
    this.updateButtons(state);

    if (state === 'active') {
      this.updateActiveRound();
    }
  }

  /**
   * Update balance display
   */
  updateBalance() {
    const balance = this.game.balanceManager.getBalance();
    this.elements.balance.textContent = `$${balance.toFixed(2)}`;
  }

  /**
   * Update button states
   */
  updateButtons(state) {
    const canInvest = state === 'active' &&
                     this.game.investmentManager.canInvest() &&
                     this.game.balanceManager.hasSufficientFunds(this.game.betAmount);

    const canCashOut = state === 'active' &&
                      this.game.investmentManager.hasActiveInvestments();

    this.elements.investBtn.disabled = !canInvest;
    this.elements.cashOutBtn.disabled = !canCashOut;

    // Update invest button text
    const remaining = this.game.investmentManager.getRemainingSlots();
    if (state === 'active' && remaining > 0) {
      this.elements.investBtn.textContent = `INVEST (${remaining} left)`;
    } else {
      this.elements.investBtn.textContent = 'INVEST';
    }
  }

  /**
   * Update active round display
   */
  updateActiveRound() {
    const currentDay = this.game.roundTimer.getCurrentDay();
    const currentPrice = this.game.getCurrentPrice();

    // Update displays
    this.elements.dayCounter.textContent = `Day ${currentDay}`;
    this.elements.currentPrice.textContent = `$${currentPrice.toFixed(3)}`;

    // Update profit display
    const profitData = this.game.getCurrentProfit();
    this.updateProfitDisplay(profitData);

    // Update positions list
    this.updatePositionsList(profitData.positions);
  }

  /**
   * Update profit display
   */
  updateProfitDisplay(profitData) {
    const profit = profitData.totalProfit || 0;
    this.elements.currentProfit.textContent = `${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`;

    this.elements.currentProfit.classList.remove('positive', 'negative');
    if (profit > 0) {
      this.elements.currentProfit.classList.add('positive');
    } else if (profit < 0) {
      this.elements.currentProfit.classList.add('negative');
    }
  }

  /**
   * Update positions list
   */
  updatePositionsList(positions) {
    if (!positions || positions.length === 0) {
      this.elements.positionsList.innerHTML = '<p class="no-positions">No active positions</p>';
      return;
    }

    const html = positions.map((pos, index) => {
      const profitClass = pos.profit >= 0 ? 'positive' : 'negative';
      const profitPercent = ((pos.multiplier - 1) * 100).toFixed(1);
      const positionType = index === 0 ? 'Initial' : 'Doubled';

      return `
        <div class="position-item">
          <div class="position-row">
            <span class="label">${positionType}:</span>
            <span class="value">Day ${pos.entryDay}</span>
          </div>
          <div class="position-row">
            <span class="label">Entry:</span>
            <span class="value">$${pos.entryPrice.toFixed(3)}</span>
          </div>
          <div class="position-row">
            <span class="label">Amount:</span>
            <span class="value">$${pos.amount.toFixed(2)}</span>
          </div>
          <div class="position-row">
            <span class="label">Value:</span>
            <span class="value">$${pos.value.toFixed(2)}</span>
          </div>
          <div class="position-row profit">
            <span class="label">P/L:</span>
            <span class="value ${profitClass}">${pos.profit >= 0 ? '+' : ''}$${pos.profit.toFixed(2)} (${profitPercent >= 0 ? '+' : ''}${profitPercent}%)</span>
          </div>
        </div>
      `;
    }).join('');

    this.elements.positionsList.innerHTML = html;
  }

  /**
   * Draw price chart
   */
  drawChart(pricePoint) {
    if (!pricePoint) return;

    // Add to history
    this.priceHistory.push(pricePoint);
    if (this.priceHistory.length > this.maxHistoryPoints) {
      this.priceHistory.shift();
    }

    // Clear canvas
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.elements.canvas.width, this.elements.canvas.height);

    if (this.priceHistory.length < 2) return;

    // Find price range
    const prices = this.priceHistory.map(p => p.price);
    const maxPrice = Math.max(...prices, 1.5);
    const minPrice = 0;

    // Draw grid lines
    this.drawGrid(maxPrice);

    // Draw price line
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#00ff88';
    this.ctx.lineWidth = 3;

    const width = this.elements.canvas.width;
    const height = this.elements.canvas.height;
    const padding = 40;

    this.priceHistory.forEach((point, index) => {
      const x = (index / (this.priceHistory.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((point.price - minPrice) / (maxPrice - minPrice)) * (height - padding * 2);

      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });

    this.ctx.stroke();

    // Draw current price indicator
    const lastPoint = this.priceHistory[this.priceHistory.length - 1];
    const lastX = width - padding;
    const lastY = height - padding - ((lastPoint.price - minPrice) / (maxPrice - minPrice)) * (height - padding * 2);

    this.ctx.fillStyle = '#00ff88';
    this.ctx.beginPath();
    this.ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw price label
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 14px Courier New';
    this.ctx.fillText(`$${lastPoint.price.toFixed(3)}`, lastX + 10, lastY + 5);
  }

  /**
   * Draw grid lines on chart
   */
  drawGrid(maxPrice) {
    const width = this.elements.canvas.width;
    const height = this.elements.canvas.height;
    const padding = 40;

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;

    // Horizontal lines
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const y = padding + (i / steps) * (height - padding * 2);
      const price = maxPrice * (1 - i / steps);

      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(width - padding, y);
      this.ctx.stroke();

      // Price labels
      this.ctx.fillStyle = '#666';
      this.ctx.font = '12px Courier New';
      this.ctx.fillText(`$${price.toFixed(2)}`, 5, y + 4);
    }
  }

  /**
   * Show round start
   */
  showRoundStart(coinName) {
    this.elements.coinName.textContent = coinName;
    this.priceHistory = [];
    this.elements.positionsList.innerHTML = '<p style="color: #666;">No active positions</p>';
    this.elements.currentProfit.textContent = '$0.00';
    this.hideResults();
  }

  /**
   * Show round results
   */
  showResults(result, coinName) {
    const overlay = this.elements.resultsOverlay;
    overlay.classList.add('active');

    // Determine title
    let title = 'NO ACTION';
    let titleClass = '';

    if (result.outcome === 'loss') {
      title = 'REKT 💀';
      titleClass = 'loss';
    } else if (result.outcome === 'cashed_out') {
      title = 'PAPER HANDS 📄';
      titleClass = 'win';
    } else if (result.profit > 0) {
      title = 'PROFIT! 🚀';
      titleClass = 'win';
    }

    this.elements.resultsTitle.textContent = title;
    this.elements.resultsTitle.className = `results-title ${titleClass}`;

    // Show profit
    const profit = result.profit || 0;
    this.elements.resultsProfit.textContent = `${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`;
    this.elements.resultsProfit.className = `results-profit ${profit >= 0 ? 'positive' : 'negative'}`;

    // Show multiplier
    const mult = result.multiplier || 0;
    this.elements.resultsMultiplier.textContent = `${mult.toFixed(2)}x`;
  }

  /**
   * Hide results overlay
   */
  hideResults() {
    this.elements.resultsOverlay.classList.remove('active');
  }

  /**
   * Show countdown
   */
  showCountdown() {
    this.elements.coinName.textContent = 'LOADING...';
    this.elements.dayCounter.textContent = 'Starting soon...';
  }

  /**
   * Update news ticker
   */
  updateNewsTicker(message) {
    this.elements.tickerText.textContent = message;
  }
}

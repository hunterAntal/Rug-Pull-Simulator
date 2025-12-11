/**
 * Main entry point for Rug Pull Simulator
 */
import { GameController } from './core/GameController.js';
import { UIRenderer } from './ui/UIRenderer.js';

class Game {
  constructor() {
    this.controller = new GameController();
    this.ui = new UIRenderer(this.controller);

    this.setupEventListeners();
    this.setupGameEvents();
    this.initialize();
  }

  /**
   * Setup DOM event listeners
   */
  setupEventListeners() {
    // Double down button
    this.ui.elements.investBtn.addEventListener('click', () => {
      const result = this.controller.doubleDown();
      if (!result.success) {
        this.showNotification(result.message);
      } else {
        this.ui.setDoubleDownMarker();
        this.playSound('invest');
      }
    });

    // Cash out button
    this.ui.elements.cashOutBtn.addEventListener('click', () => {
      const result = this.controller.cashOut();
      if (!result.success) {
        this.showNotification(result.message);
      } else {
        this.ui.setCashOutMarker();
        this.playSound('cashout');
        this.showNotification(`Cashed out! ${result.totalProfit >= 0 ? '+' : ''}$${result.totalProfit.toFixed(2)}`);
      }
    });

    // Bet amount input
    this.ui.elements.betAmount.addEventListener('input', (e) => {
      const amount = parseFloat(e.target.value) || 0;
      this.controller.setBetAmount(amount);
    });

    // Results screen bet adjustment
    this.ui.elements.decreaseBet.addEventListener('click', () => {
      this.adjustBet(-10);
    });

    this.ui.elements.increaseBet.addEventListener('click', () => {
      this.adjustBet(10);
    });

    this.ui.elements.betInputResults.addEventListener('input', (e) => {
      const amount = parseFloat(e.target.value) || 0;
      if (amount >= 10 && amount <= this.controller.balanceManager.getBalance()) {
        this.controller.setBetAmount(amount);
        this.ui.elements.betAmount.value = amount;
      }
    });

    // Mobile button handlers
    this.ui.elements.mobileDoubleDownBtn.addEventListener('click', () => {
      const result = this.controller.doubleDown();
      if (!result.success) {
        this.showNotification(result.message);
      } else {
        this.ui.setDoubleDownMarker();
        this.playSound('invest');
      }
    });

    this.ui.elements.mobileCashOutBtn.addEventListener('click', () => {
      const result = this.controller.cashOut();
      if (!result.success) {
        this.showNotification(result.message);
      } else {
        this.ui.setCashOutMarker();
        this.playSound('cashout');
        this.showNotification(`Cashed out! ${result.totalProfit >= 0 ? '+' : ''}$${result.totalProfit.toFixed(2)}`);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.controller.state === 'active') {
        e.preventDefault();
        if (this.controller.investmentManager.canDoubleDown()) {
          this.ui.elements.investBtn.click();
        }
      } else if (e.code === 'KeyC' && this.controller.state === 'active') {
        e.preventDefault();
        this.ui.elements.cashOutBtn.click();
      }
    });
  }

  /**
   * Setup game controller events
   */
  setupGameEvents() {
    // State changes
    this.controller.on('stateChange', (data) => {
      console.log('State changed:', data.state);

      if (data.state === 'countdown') {
        this.ui.showCountdown();
      } else if (data.state === 'active') {
        this.ui.showRoundStart(data.coinName);
        this.updateNewsTicker(data.coinName);
      }

      this.ui.update(data.state);
    });

    // Price updates
    this.controller.on('priceUpdate', (data) => {
      this.ui.drawChart(data);
      this.ui.updateActiveRound();
      this.ui.updateButtons(this.controller.state);
    });

    // Round end
    this.controller.on('roundEnd', (data) => {
      console.log('Round ended:', data);
      this.ui.showResults(data.result, data.coinName, this.controller.stats);
      this.startCountdown(3);
    });

    // Balance updates
    this.controller.on('balanceUpdate', (data) => {
      this.ui.updateBalance();
      this.ui.updateButtons(this.controller.state);
    });
  }

  /**
   * Initialize game
   */
  async initialize() {
    console.log('Initializing Rug Pull Simulator...');
    this.ui.updateBalance();
    this.ui.updateButtons('idle');

    // Show welcome message
    this.updateNewsTicker('Welcome to the casino... I mean, investment platform! 🎰');

    // Start first round after short delay
    setTimeout(() => {
      this.controller.startRound();
    }, 2000);
  }

  /**
   * Update news ticker with random messages
   */
  updateNewsTicker(coinName) {
    const messages = [
      `${coinName} just launched! 🚀`,
      `Elon just tweeted about ${coinName}!`,
      `${coinName} mentioned on Reddit frontpage`,
      `Whales accumulating ${coinName}`,
      `${coinName} audit passed (trust me bro)`,
      `SEC investigating ${coinName} devs 👀`,
      `${coinName} dev wallet just moved...`,
      `${coinName} liquidity locked (for now)`,
      `Anonymous billionaire spotted buying ${coinName}`,
      `${coinName} partnerships incoming (allegedly)`,
      `Chart looking bullish for ${coinName}! 📈`,
      `${coinName} just got listed on... nowhere`,
      `This is financial advice: buy ${coinName}`,
      `${coinName} devs are totally not anonymous`,
      `${coinName} to the moon! (not financial advice)`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    this.ui.updateNewsTicker(randomMessage);

    // Update ticker periodically during round
    if (this.controller.state === 'active') {
      setTimeout(() => {
        if (this.controller.state === 'active') {
          this.updateNewsTicker(coinName);
        }
      }, 5000 + Math.random() * 5000);
    }
  }

  /**
   * Show notification message
   */
  showNotification(message) {
    console.log('Notification:', message);
    // Could add toast notifications here
  }

  /**
   * Play sound effect
   */
  playSound(type) {
    // Sound effects could be added here
    console.log('Sound:', type);
  }

  /**
   * Adjust bet amount
   */
  adjustBet(delta) {
    const currentBet = this.controller.betAmount;
    const newBet = currentBet + delta;
    const maxBet = this.controller.balanceManager.getBalance();

    if (newBet >= 10 && newBet <= maxBet) {
      this.controller.setBetAmount(newBet);
      this.ui.elements.betAmount.value = newBet;
      this.ui.elements.betInputResults.value = newBet;
    }
  }

  /**
   * Start countdown between rounds
   */
  startCountdown(seconds) {
    let remaining = seconds;

    const updateCountdown = () => {
      if (remaining > 0) {
        this.ui.elements.countdownMessage.textContent =
          `Next round starting in ${remaining}...`;
      } else {
        this.ui.elements.countdownMessage.textContent =
          `Starting now...`;
      }

      remaining--;

      if (remaining >= 0) {
        setTimeout(updateCountdown, 1000);
      }
    };

    updateCountdown();
  }
}

// Start game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
  });
} else {
  window.game = new Game();
}

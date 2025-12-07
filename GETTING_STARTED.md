# Getting Started with Rug Pull Simulator

Welcome to the Rug Pull Simulator! This guide will walk you through installation, gameplay, and understanding the mechanics.

## Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)

### Setup Steps

1. **Clone or download the repository**
   ```bash
   cd RugPullSimulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The terminal will show a URL (usually `http://localhost:5173`)
   - Open that URL in your browser
   - Game starts automatically!

### Build for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` folder. You can deploy these to any static hosting service.

## First Time Playing

### Understanding the Interface

When you open the game, you'll see:

**Top Bar**
- **Coin Name**: Current meme coin ($COPE, $FOMO, $YOLO, etc.)
- **Balance**: Your current funds (starts at $1000)

**Left Side - Chart**
- **Day Counter**: Shows current day (1 day = 1 second of real time)
- **Current Price**: Live price in dollars
- **Canvas Chart**: Visual representation of price over time
- **Orange Marker**: Appears after you cash out, showing exit point

**Right Side - Position Panel**
- **Bet Amount Input**: Set your investment size (default: $100)
- **Positions List**: Shows all active investments with entry details
- **Total P/L**: Your combined profit/loss across all positions
- **Cash Out Button**: Exit all positions at current price
- **Double Down Button**: Add second investment at current price

**Bottom**
- **News Ticker**: Humorous crypto-themed fake news (for entertainment)

### Your First Round

1. **Watch the Auto-Investment**
   - The round starts automatically
   - You're invested $100 at $1.00 (Day 1)
   - No action required - it happens automatically

2. **Observe the Opening Chaos**
   - First 1.5-2.5 seconds = extreme volatility
   - Price swings 10-35% in random directions
   - This is normal! Don't panic

3. **Monitor Your Position**
   - Watch the "YOUR POSITION" panel
   - Green numbers = profit
   - Red numbers = loss
   - Position updates in real-time

4. **Decision Time**
   - **Option A**: Click "💰 CASH OUT" to exit at current price
   - **Option B**: Click "⚡ DOUBLE DOWN" to add another $100 at current price
   - **Option C**: Hold and hope for higher prices

5. **The Crash**
   - Every round ends with an instant vertical drop to $0
   - If you haven't cashed out, you lose everything
   - Orange marker shows where you exited (if you did)

6. **Results Screen**
   - Shows your total profit/loss
   - Breaks down each position separately
   - Next round starts automatically in 3 seconds

## Understanding the Mechanics

### Auto-Investment System

**You are automatically invested every round**
- Always enters at $1.00 (Day 1)
- Amount = your bet amount setting
- Cannot opt out
- Forces you to have skin in the game

### Double Down Mechanic

**Add a second position at current price**
- Only allowed once per round
- Cannot double down after cashing out
- Available at ANY time (no restrictions)
- Doubles your exposure and potential profit/loss

**When to double down?**
- Price is lower than your entry ($1.00) = averaging down
- Price is rising fast = increasing leverage
- Strong conviction the round will continue
- **Risk**: If it crashes, you lose 2x bet amount

**When NOT to double down?**
- Already deep in profit (take the win)
- Price is dropping fast (likely instant crash)
- Low balance (preserve capital)
- Uncertain about round continuation

### Cash Out System

**Exit all positions at current price**
- Immediately adds proceeds to balance
- Shows orange marker on chart
- Cannot cash out again this round
- Round continues after you exit

**When to cash out?**
- In profit and nervous about continuation
- Reached target multiplier (e.g., 1.3x)
- Price action looks weak or choppy
- **Better safe than REKT**

### Round Types Explained

**40% - Instant Loss**
- Crashes within 0.5-3.0 seconds
- Rarely reaches profitable prices
- Opening chaos often the only chance
- If you see fast drop = get out immediately

**35% - Small Peak (1.1x-1.3x)**
- Most common profitable outcome
- Typically lasts 4-8 seconds
- Safe, consistent small wins
- Don't get greedy - take the 20-30% gain

**20% - Medium Peak (1.5x-2.0x)**
- Lasts 6-10 seconds
- Solid profit opportunity (50-100% gain)
- Risk increases with hold time
- Good double down opportunity if spotted early

**5% - Moon Shot (3.0x-5.0x)**
- Extremely rare (1 in 20 rounds)
- Lasts 8-12+ seconds
- Life-changing multipliers (200-400% gain)
- Easy to get greedy and lose it all

### Round Duration

**Completely unpredictable by design**
- Ranges from ~0.5 seconds to 18+ seconds
- No visual tells of approaching end
- Double down button stays enabled throughout
- Crash is instant and vertical (no warning)

This prevents players from "timing" the end and ensures genuine risk.

## Gameplay Strategies

### Conservative Strategy (Grind Small Wins)

- Cash out at 1.2x-1.3x multiplier every time
- Never double down
- Preserve capital through consistency
- Boring but statistically "best" (still loses long-term)

### Aggressive Strategy (Chase Moon Shots)

- Hold longer for 2x+ multipliers
- Double down on promising rounds
- Higher variance, more excitement
- Faster balance swings (up or down)

### Balanced Strategy (Recommended)

- Cash out at 1.3x-1.5x on most rounds
- Double down only when price dips below entry
- Take moon shot risks when balance is healthy
- Cut losses immediately on fast drops

### Advanced Tips

1. **Watch the opening chaos**
   - If price drops 30%+ in first 2 seconds = likely instant crash
   - If price climbs steadily after chaos = possible moon shot
   - Violent bidirectional swings = unknown, stay cautious

2. **Use position breakdown**
   - Results screen shows which decision was profitable
   - Learn from your double down timing
   - Adjust strategy based on feedback

3. **Balance management**
   - Starting balance: $1000
   - Default bet: $100 (10% of balance)
   - If balance drops to $200, reduce bet to $20-50
   - Going broke = game over (refresh to restart)

4. **Pattern recognition (doesn't work)**
   - Every chart is randomly generated
   - Previous rounds don't predict future rounds
   - Probabilities are fixed (40/35/20/5)
   - Don't fall for gambler's fallacy

## Troubleshooting

### Game won't load
- Check that `npm run dev` is running
- Verify Node.js is installed (`node --version`)
- Try clearing browser cache
- Check browser console for errors (F12)

### Chart not rendering
- Verify browser supports HTML5 Canvas
- Try a modern browser (Chrome, Firefox, Edge, Safari)
- Check if JavaScript is enabled

### Balance stuck at $0
- Refresh the page to restart with $1000
- This is intentional - going broke ends the game

### Can't double down
- Already doubled down this round? (only once per round)
- Already cashed out? (can't double down after exit)
- Insufficient balance? (need $100+ with default bet)
- Round ended? (wait for next round)

## Understanding the House Edge

**The game is designed so you lose money over time**

Expected value per round:
```
40% chance: -100% (instant loss)
35% chance: +20% (small peak avg)
20% chance: +75% (medium peak avg)
5% chance: +300% (moon shot avg)

Expected Value = -3% per round
```

**What this means:**
- Playing 100 rounds, you'll lose ~3% per round on average
- Starting with $1000 → ~$740 after 100 rounds (if you play perfectly)
- The house always wins in the long run
- This is entertainment, not an investment strategy

**Why you'll lose faster:**
- Emotional decisions (holding too long, panic selling)
- Double down timing (buying at peaks)
- Chasing losses (increasing bet size)
- Greed (not cashing out profits)

## Development

### File Structure Deep Dive

**Core Logic** (`src/core/`)
- `ChartGenerator.js` - Random price curve generation with probabilities
- `GameController.js` - State machine managing round lifecycle
- `InvestmentManager.js` - Position tracking and P/L calculations
- `BalanceManager.js` - Wallet with transaction history
- `RoundTimer.js` - Day counter (1 day = 1 second real time)

**UI Layer** (`src/ui/`)
- `UIRenderer.js` - Canvas chart rendering, DOM updates, button states

**Entry Point** (`src/main.js`)
- Initializes game controller
- Sets up UI renderer
- Binds event handlers (buttons, inputs)
- Starts first round

### Making Changes

**Adjust probabilities:**
Edit `ChartGenerator.js` line ~40:
```javascript
const rand = Math.random();
if (rand < 0.40) return this.generateInstantLoss(...);  // 40%
if (rand < 0.75) return this.generateSmallPeak(...);    // 35%
if (rand < 0.95) return this.generateMediumPeak(...);   // 20%
return this.generateMoonShot(...);                       // 5%
```

**Change starting balance:**
Edit `GameController.js` line ~13:
```javascript
this.balanceManager = new BalanceManager(1000);  // Change to desired amount
```

**Adjust default bet:**
Edit `GameController.js` line ~20:
```javascript
this.betAmount = 100;  // Change to desired default
```

**Modify opening chaos:**
Edit `ChartGenerator.js` line ~282-320 in `generateOpeningChaos()`:
```javascript
const openingDuration = this.random(1.5, 2.5);  // Duration in seconds
const magnitude = this.random(0.10, 0.35);      // 10-35% swings
const reverseChance = 0.70;                     // 70% direction change
```

## Next Steps

1. **Play a few rounds** to understand the feel
2. **Experiment with strategies** (conservative vs aggressive)
3. **Watch your balance** trend over 20-30 rounds
4. **Read the code** if you want to understand the algorithms
5. **Have fun** and don't take it too seriously

Remember: This is a satirical game about crypto volatility and gambling psychology. The house edge is intentional. You will lose money over time. Enjoy the entertainment value, not the financial outcomes!

## Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Questions**: Check the main README.md for technical details
- **Community**: Share your best (or worst) runs with friends

---

**Disclaimer**: This is a parody game for entertainment purposes only. It does not involve real money, real cryptocurrency, or real financial advice. Any resemblance to actual crypto markets is purely satirical.

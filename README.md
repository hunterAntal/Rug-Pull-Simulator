# Rug Pull Simulator

A viral meme-based gambling game where players automatically invest in randomly generated meme coins and must cash out before the inevitable crash. Experience the thrill of crypto volatility without risking real money!

## Features

- **Auto-Investment System**: Automatically invests at $1.00 on every round start
- **Double Down Mechanic**: Optional additional bet at current market price (once per round)
- **Extreme Opening Volatility**: First 1.5-2.5 seconds feature violent 10-35% price swings
- **Random Chart Patterns**: Unpredictable segments make every round unique
- **Cash Out Marker**: Visual indicator shows exactly where you exited on the chart
- **Position Breakdown**: See individual profit/loss for each investment
- **20+ Meme Coins**: Rotating selection including $COPE, $FOMO, $YOLO, and more
- **Real-time Profit Tracking**: Live updates of current position value
- **Instant Crash Endings**: Vertical drop to $0 with no warning (0.2-0.4s before round end)
- **Responsive Design**: Works on desktop and mobile

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## How to Play

1. **Set Your Bet Amount** (default: $100) - This is your initial investment size
2. **Watch the Round Start** - You're automatically invested at $1.00 (Day 1)
3. **Optional: Double Down** - Click "DOUBLE DOWN" to add another bet at the current price (once per round)
4. **Cash Out Before the Crash** - Click "💰 CASH OUT" to secure your profits
5. **Watch the Results** - See your profit/loss breakdown for each position
6. **Repeat** - Next round starts automatically after 3 seconds

### Important Notes

- You **cannot predict** when the round will end - double down is available at any time
- The opening 1.5-2.5 seconds is pure chaos (10-35% swings)
- Every chart is randomly generated with unique segment patterns
- The crash is **instant and vertical** - no warning
- The house edge is built into the probability distribution (40% instant loss rate)
- Your balance carries between rounds - don't go broke!

## Game Mechanics

### Investment System

**Auto-Investment**
- Every round starts with an automatic investment at $1.00 (Day 1)
- You cannot opt out - this forces action every round
- Investment amount is based on your bet amount setting

**Double Down**
- Click "DOUBLE DOWN" to add a second investment at the current market price
- Only allowed once per round
- Cannot double down after cashing out
- Doubles your risk and potential reward
- Available at ANY time during the round (no time restrictions)

**Cash Out**
- Exits all positions at the current market price
- Adds proceeds to your balance
- Shows an orange marker on the chart where you exited
- Cannot cash out after round ends

### Round Types & Probability

The house edge is built into the probability distribution:

- **Instant Loss** (40%): Crashes within 0.5-3.0 seconds, rarely profitable
- **Small Peak** (35%): Reaches 1.1x-1.3x multiplier before crashing
- **Medium Peak** (20%): Reaches 1.5x-2.0x multiplier before crashing
- **Moon Shot** (5%): Reaches 3.0x-5.0x multiplier before crashing

### Chart Generation

**Opening Chaos (First 1.5-2.5 seconds)**
- Extreme volatility with 10-35% price swings
- 70% chance of direction reversal on each tick
- Makes early entry extremely risky
- Designed to punish FOMO

**Random Segments**
- Charts are built from random 0.5-2.0 second segments
- Segment types: flat, spike_up, spike_down, choppy, gradual_climb, gradual_fall
- Each segment has random magnitude (5-25% for spikes, 3-15% for gradual)
- Completely unpredictable patterns - no telegraphing

**Instant Crash**
- Vertical drop to $0.00 with no warning
- Occurs 0.2-0.4 seconds before round duration ends
- Ensures all non-cashed positions lose 100%

### Strategy Tips

- **The house always wins** - 40% instant loss rate ensures negative expected value
- **Don't double down on instant crashes** - If price drops fast, don't chase it
- **Take profits early** - Small consistent wins beat chasing moon shots
- **Watch your balance** - Going broke means game over
- **Opening volatility is a trap** - Don't get shaken out by chaos
- **This is satire, not financial advice** - Treat it as entertainment

## Tech Stack

- **Vanilla JavaScript** (ES6+ modules) - No frameworks, pure performance
- **HTML5 Canvas** - Real-time chart rendering with 60 FPS animation
- **CSS3** - Cyberpunk-inspired gradient backgrounds and animations
- **Vite** - Lightning-fast development server and builds
- **Event-Driven Architecture** - Clean separation between game logic and UI

## Project Structure

```
src/
├── core/
│   ├── ChartGenerator.js    # Price curve algorithm with random segments
│   ├── GameController.js    # Main game orchestrator (state machine)
│   ├── InvestmentManager.js # Position tracking and profit calculations
│   ├── BalanceManager.js    # Wallet management with transaction history
│   └── RoundTimer.js        # Day counter and elapsed time tracking
├── ui/
│   └── UIRenderer.js        # Canvas chart rendering & DOM updates
├── styles/
│   └── main.css            # Responsive styling with dark theme
└── main.js                 # Entry point and event handlers
```

## Technical Deep Dive

### Event System

The `GameController` emits events for clean UI updates:

- `stateChange` - Game state transitions (idle → countdown → active → results)
- `priceUpdate` - Real-time price data for chart rendering
- `roundEnd` - Results data with profit/loss breakdown
- `balanceUpdate` - Wallet balance changes

### Chart Rendering

- Uses `requestAnimationFrame` for smooth 60 FPS updates
- Renders up to 1000 price points with automatic history trimming
- Dynamic y-axis scaling based on price range
- Grid lines and price labels for readability
- Cash out marker (orange dashed line + dot) drawn on successful exit

### Investment Tracking

Each position stores:
- Entry price, entry time, entry day
- Investment amount
- Status (active, cashed_out, lost)
- Type (initial or doubled)

Profit calculation: `value = amount × (currentPrice / entryPrice)`

### House Edge Implementation

The probability distribution creates a built-in house edge:
```
Expected Value = 0.40 × (-100%) + 0.35 × (20%) + 0.20 × (75%) + 0.05 × (300%)
               = -40% + 7% + 15% + 15%
               = -3% (negative EV)
```

Over time, players lose 3% per round on average, ensuring the house wins.

## License

MIT

# Rug Pull Simulator

A viral meme-based gambling game where players invest in randomly generated meme coins and attempt to cash out before the inevitable crash.

## Features

- **Dynamic Price Charts**: Each round features unique price curves with house edge
- **Multiple Investments**: Up to 3 investments per round at different entry points
- **20+ Meme Coins**: Rotating selection including $COPE, $FOMO, $YOLO, and more
- **Real-time Profit Tracking**: See your gains/losses update live
- **News Ticker**: Humorous crypto-themed fake news
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

1. Set your bet amount (default: $100)
2. Wait for the round to start
3. Click "INVEST" when you think the price is good (up to 3 times)
4. Click "CASH OUT" before the inevitable crash to secure profits
5. Try not to get REKT

## Keyboard Shortcuts

- `Space` - Quick invest
- `C` - Cash out

## Game Mechanics

### Round Types
- **Instant Loss** (40%): Crashes immediately, never profitable
- **Small Peak** (35%): Peaks at 1.1x-1.3x multiplier
- **Medium Peak** (20%): Peaks at 1.5x-2.0x multiplier
- **Moon Shot** (5%): Peaks at 3.0x-5.0x multiplier

### Strategy Tips
- Early rounds often crash fast
- Multiple small wins > one big loss
- The house always wins eventually
- This is satire, not financial advice

## Tech Stack

- Vanilla JavaScript (ES6+ modules)
- HTML5 Canvas for charts
- CSS3 with animations
- Vite for development

## Project Structure

```
src/
├── core/
│   ├── ChartGenerator.js    # Price curve algorithm
│   ├── GameController.js    # Main game orchestrator
│   ├── InvestmentManager.js # Player position tracking
│   ├── BalanceManager.js    # Wallet management
│   └── RoundTimer.js        # Day counter
├── ui/
│   └── UIRenderer.js        # Chart rendering & UI updates
├── styles/
│   └── main.css            # Game styling
└── main.js                 # Entry point
```

## License

MIT

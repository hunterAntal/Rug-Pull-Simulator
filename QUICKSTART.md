# Rug Pull Simulator - Quick Start Guide

## Getting Started

### Option 1: Using Python HTTP Server (Recommended for Development)

```bash
# Navigate to project directory
cd /Users/hunterantal/Development/RugPullSimulator

# Start the server
./serve.sh

# Or manually:
python3 -m http.server 8000
```

Then open your browser to: **http://localhost:8000**

### Option 2: Using Node.js/Vite (Requires npm)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Project Structure

```
RugPullSimulator/
├── index.html              # Main HTML file
├── src/
│   ├── main.js            # Game entry point
│   ├── core/
│   │   ├── GameController.js      # Main game orchestrator
│   │   ├── ChartGenerator.js      # Price curve algorithm
│   │   ├── InvestmentManager.js   # Player position tracking
│   │   ├── BalanceManager.js      # Wallet management
│   │   └── RoundTimer.js          # Day counter
│   ├── ui/
│   │   └── UIRenderer.js          # Chart & UI rendering
│   └── styles/
│       └── main.css               # Game styling
├── package.json
├── vite.config.js
└── README.md
```

## How to Play

1. **Set Bet Amount**: Choose how much to invest per transaction (default: $100)

2. **Wait for Round Start**: Each round features a new meme coin ($YOLO, $COPE, etc.)

3. **Invest**: Click "INVEST" or press SPACE
   - You can invest up to 3 times per round
   - Each investment locks in at the current price

4. **Cash Out**: Click "CASH OUT" or press C
   - Sell all positions at current price
   - Lock in your profits (or minimize losses)

5. **Don't Get REKT**: If you don't cash out before the crash, you lose everything

## Game Mechanics

### Round Probabilities
- **40%** - Instant Loss: Never profitable
- **35%** - Small Peak: 1.1x-1.3x max
- **20%** - Medium Peak: 1.5x-2.0x max
- **5%** - Moon Shot: 3.0x-5.0x max

### Key Features
- Round duration: 7-10 seconds (randomized)
- Starting balance: $1,000 play money
- Balance persists in localStorage
- Real-time profit/loss calculations
- News ticker with meme messages

## Keyboard Shortcuts

- `Space` - Quick invest
- `C` - Cash out

## Development

### Testing the Chart Algorithm

Open browser console and run:

```javascript
// Get game instance
const game = window.game.controller;

// View current game state
console.log(game.getState());

// Manually trigger investment
game.invest();

// View chart data
console.log(game.currentRound);
```

### Modifying Probabilities

Edit [src/core/ChartGenerator.js](src/core/ChartGenerator.js:11-16):

```javascript
this.ROUND_TYPES = {
  INSTANT_LOSS: { probability: 0.40, name: 'instant_loss' },
  SMALL_PEAK: { probability: 0.35, name: 'small_peak' },
  MEDIUM_PEAK: { probability: 0.20, name: 'medium_peak' },
  MOON_SHOT: { probability: 0.05, name: 'moon_shot' }
};
```

### Adding New Meme Coins

Edit [src/core/GameController.js](src/core/GameController.js:23-27):

```javascript
this.memeCoins = [
  '$COPE', '$FOMO', '$YOLO', '$MOON', // ... add more
];
```

### Changing Starting Balance

Edit [src/core/GameController.js](src/core/GameController.js:7):

```javascript
this.balanceManager = new BalanceManager(5000); // Change from 1000
```

## Next Steps (Sprint 2)

- [ ] Add sound effects
- [ ] Implement player statistics tracking
- [ ] Add mobile touch gestures
- [ ] Create leaderboard system
- [ ] Add chart pattern variations
- [ ] Implement "reset balance" button
- [ ] Add animation effects for wins/losses

## Troubleshooting

### Charts not displaying
- Check browser console for errors
- Ensure all JavaScript files are loading
- Verify canvas element exists in DOM

### Buttons not working
- Ensure you have sufficient balance
- Check that round is in 'active' state
- Verify you haven't exceeded 3 investments

### Balance reset
- Balance is stored in localStorage
- Clear browser storage to reset
- Or use: `window.game.controller.balanceManager.reset()`

## License

MIT

# 🎰 Tuwaiq Game - Premium Casino

A beautiful, modern gambling game platform inspired by Stake.com featuring multiple casino games with smooth animations and stunning visuals.

## 🎮 Games Included

### 🎲 Dice
- Classic dice roll game with adjustable win chances
- Roll over a target number to win
- Dynamic multiplier based on odds
- Real-time animations

### 🚀 Crash
- Watch the multiplier climb and cash out before it crashes!
- Optional auto-cashout feature
- Live graph visualization
- Thrilling high-risk gameplay

### 🎯 Plinko
- Drop **MULTIPLE BALLS** at once (1-10 balls)!
- Drop balls through pegs to win big
- Three risk levels: Low, Medium, High
- Physics-based ball movement with colorful balls
- Multiple multiplier zones (up to 5x on high risk!)

### 🎰 Slots
- Classic 3-reel slot machine
- 8 different symbols with unique payouts
- Spinning reel animations
- Jackpot up to 100x with Lucky Clovers! 🍀

### 💣 Mines
- Strategic Minesweeper-style gameplay
- Choose from 3, 5, 7, or 10 mines
- Multiplier increases with each gem found
- Cash out anytime or risk it all
- More mines = higher risk and reward

### 🎡 Wheel
- Spin the colorful fortune wheel
- Three risk levels with different payouts
- Smooth spinning animation
- Up to 10x multiplier on high risk!

### 📊 Limbo
- Predict if the result will hit your target multiplier
- Set your target from 1.10x to 1000x
- **HARDER MODE**: Lower win chances and tougher odds
- Higher targets = lower chance but bigger wins
- Fast-paced gameplay with number animations

### 🗼 Tower
- Climb an 8-level tower by choosing safe blocks!
- Three difficulty modes: Easy, Medium, Hard
- Cash out anytime or climb to the top
- Each level increases your multiplier
- Hard mode can reach up to **320x** multiplier!

### 🪙 Coin Flip
- Classic heads or tails game
- Simple double-or-nothing gameplay
- Beautiful 3D coin flip animation
- 50/50 odds, 2x payout on win
- Perfect for quick bets!

### 🎴 Hi-Lo
- Guess if the next card is higher or lower
- Build streaks for bigger multipliers
- Cash out anytime to secure profits
- Each correct guess adds 0.5x to multiplier
- Exciting progressive gameplay!

### 🎱 Keno
- Pick 10 numbers from 1-40
- 20 numbers are drawn randomly
- Match 5+ for wins, up to 500x on perfect match!
- Animated number drawing
- Classic lottery-style casino game

## 🚀 How to Play

1. **Open the game**: Simply open `index.html` in any modern web browser
2. **Choose a game**: Click on the game buttons (Dice, Crash, or Plinko) in the navigation
3. **Set your bet**: Enter your bet amount or use the ½ and 2× buttons
4. **Configure settings**: Adjust game-specific settings (target, risk level, auto-cashout)
5. **Play**: Click the play button and watch the action!
6. **Track your stats**: View your recent plays in the stats panel at the bottom

## 💰 Features

- **Starting Balance**: $1,000 to get you started
- **Balance Management**: Real-time balance updates with smooth animations
- **Bet Modifiers**: Quick ½ and 2× buttons to adjust bets
- **Stats Tracking**: See your last 10 plays with profit/loss tracking
- **Beautiful UI**: Modern gradient design with glassmorphism effects
- **Smooth Animations**: Professional animations and transitions
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🎨 Design Features

- Stunning gradient backgrounds
- Glassmorphism UI elements
- Smooth transitions and animations
- Glowing effects on wins
- Real-time canvas graphics for Crash and Plinko
- Professional color scheme

## 🛠️ Technical Details

- **Pure Vanilla JavaScript**: No frameworks required
- **HTML5 Canvas**: For game graphics and animations
- **CSS3 Animations**: Smooth, GPU-accelerated effects
- **Responsive Design**: Mobile-friendly layout
- **No Dependencies**: Just open and play!

## 📊 Game Details

### 🎲 Dice Game
- **Win Chance**: 2% - 98%
- **Multiplier**: Calculated as 99 / (100 - target)
- **House Edge**: ~1%

### 🚀 Crash Game
- **Crash Point**: Random between 1.1x and 5.1x
- **Auto Cashout**: Optional feature to automatically cash out
- **Strategy**: Balance risk vs reward

### 🎯 Plinko Game
- **Multi-Ball Feature**: Launch 1-10 balls simultaneously!
- **Risk Levels**:
  - **Low**: Safer multipliers (0.5x - 2.0x)
  - **Medium**: Balanced risk (0.3x - 3.0x)
  - **High**: High risk, high reward (0.2x - 5.0x)
- **12 Rows**: More pegs = more randomness
- **Total Bet**: Bet amount × number of balls

### 🎰 Slots Game
- **Payouts**:
  - 🍀🍀🍀 = 100x (Jackpot!)
  - 7️⃣7️⃣7️⃣ = 50x
  - ⭐⭐⭐ = 15x
  - 💎💎💎 = 10x
  - 🔔🔔🔔 = 8x
  - 🍒🍒🍒 = 5x
  - 🍋🍋🍋 = 3x
  - 🍊🍊🍊 = 2x

### 💣 Mines Game
- **Grid**: 5x5 (25 tiles)
- **Mines Options**: 3, 5, 7, or 10 mines
- **Strategy**: More reveals = higher multiplier
- **Multiplier**: Increases ~30% per gem (scales with mine count)
- **Cash Out**: Anytime before hitting a mine

### 🎡 Wheel Game
- **Segments**: 8 colored segments
- **Risk Levels**:
  - **Low**: 0.5x - 2.0x (balanced with losses)
  - **Medium**: 0.2x - 5.0x (high variance)
  - **High**: 0.1x - 10.0x (extreme risk, extreme reward)

### 📊 Limbo Game
- **Target Range**: 1.10x to 1000x (HARDER!)
- **Win Chance**: 95 / target multiplier (reduced from 100)
- **Payout**: If result ≥ target, win bet × target
- **Distribution**: Results are weighted lower (harder to win high multipliers)
- **Examples**:
  - Target 2.00x = ~47.5% chance (was 50%)
  - Target 10.00x = ~9.5% chance (was 10%)
  - Target 100.00x = ~0.95% chance (was 1%)

### 🗼 Tower Game
- **Levels**: 8 levels to climb
- **Difficulty Modes**:
  - **Easy**: 3 blocks, 2 safe (66% chance) - Max: 6.2x
  - **Medium**: 3 blocks, 1 safe (33% chance) - Max: 30.4x
  - **Hard**: 4 blocks, 1 safe (25% chance) - Max: 320x!
- **Strategy**: Cash out early for safe wins, or risk it for massive multipliers
- **Progressive**: Multiplier grows with each level you climb

### 🪙 Coin Flip Game
- **Simple**: Just pick heads or tails
- **Payout**: 2x on correct guess
- **Odds**: 50% chance to win
- **Animation**: Beautiful 3D coin flip with smooth rotation

### 🎴 Hi-Lo Card Game
- **Cards**: Standard deck (A through K)
- **Streak System**: Each correct guess adds 0.5x to multiplier
- **Strategy**: Cash out anytime or keep building your streak
- **Risk**: Wrong guess loses everything
- **High Risk, High Reward**: Long streaks = big multipliers!

### 🎱 Keno Game
- **Board**: 40 numbers to choose from
- **Selection**: Pick exactly 10 numbers
- **Draw**: 20 numbers are randomly drawn
- **Payouts**:
  - 5 matches = 2x
  - 6 matches = 5x
  - 7 matches = 10x
  - 8 matches = 25x
  - 9 matches = 100x
  - 10 matches = 500x (JACKPOT!)

## 🎯 Tips for Playing

1. **Start Small**: Test each game with small bets first
2. **Manage Bankroll**: Don't bet more than you can afford to lose
3. **Use Auto-Cashout**: In Crash game, set a target to secure profits
4. **Try Different Risks**: In Plinko and Wheel, different risk levels offer different experiences
5. **Track Stats**: Use the stats panel to review your performance
6. **Multi-Ball Plinko**: Launch multiple balls for more action and averaged results
7. **Mines Strategy**: Cash out early for safe wins, or push for maximum multiplier
8. **Limbo High Risk**: Higher targets mean lower chances but massive payouts (now harder!)
9. **Tower Climbing**: Start on Easy to learn, then try Hard mode for extreme multipliers
10. **Cash Out Feature**: Both Mines, Tower, and Hi-Lo let you cash out anytime for safer wins
11. **Coin Flip Quick**: Perfect for fast double-or-nothing action
12. **Hi-Lo Streaks**: Build long streaks for exponential multiplier growth
13. **Keno Strategy**: Choose numbers wisely and aim for 5+ matches for guaranteed wins

## 🌟 Game Count

**11 Complete Casino Games!**
- 🎲 Dice
- 🚀 Crash  
- 🎯 Plinko (Multi-Ball)
- 🎰 Slots
- 💣 Mines
- 🎡 Wheel
- 📊 Limbo (HARDER!)
- 🗼 Tower
- 🪙 Coin Flip (NEW!)
- 🎴 Hi-Lo (NEW!)
- 🎱 Keno (NEW!)

## 🎨 Special Features

- **Multi-Ball Plinko**: The only Plinko game where you can launch up to 10 balls at once with different colors!
- **Interactive Mines**: Strategic reveal-based gameplay with multiplier building
- **Spinning Wheel**: Beautiful canvas-rendered wheel with smooth rotation
- **Tower Climbing**: Progressive risk/reward gameplay with up to 320x multiplier
- **Harder Limbo**: More challenging than ever with weighted results
- **3D Coin Flip**: Stunning 3D coin animation with realistic physics
- **Hi-Lo Streaks**: Progressive multiplier system with cash-out options
- **Animated Keno**: Watch numbers being drawn with smooth animations
- **Real-time Stats**: Track all your wins and losses across all games

## 🌟 Future Enhancements

Potential features to add:
- Sound effects and music
- Achievements and challenges
- Leaderboards
- Save/load game state
- Provably fair verification
- Cryptocurrency integration
- More game modes and variations

## 📝 License

This is a demo gambling game for entertainment purposes only. Not for real money gambling.

## 🎮 Enjoy the Game!

Have fun and gamble responsibly! Remember, this is just for entertainment and uses virtual currency.


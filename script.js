// Game State
let balance = 1000;
let currentGame = 'dice';
let isPlaying = false;
let stats = [];

// DOM Elements
const balanceElement = document.getElementById('balance');
const navButtons = document.querySelectorAll('.nav-btn');
const gamePanels = document.querySelectorAll('.game-panel');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateBalance();
    initNavigation();
    initDiceGame();
    initCrashGame();
    initPlinkoGame();
    initSlotsGame();
    initMinesGame();
    initWheelGame();
    initLimboGame();
    initTowerGame();
    initCoinFlipGame();
    initHiLoGame();
    initKenoGame();
    initModifierButtons();
});

// Navigation
function initNavigation() {
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const game = btn.dataset.game;
            switchGame(game);
        });
    });
}

function switchGame(game) {
    currentGame = game;
    
    // Update nav buttons
    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.game === game);
    });
    
    // Update game panels
    gamePanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `${game}-game`);
    });
}

// Balance Management
function updateBalance() {
    balanceElement.textContent = `$${balance.toFixed(2)}`;
    balanceElement.classList.add('glowing');
    setTimeout(() => balanceElement.classList.remove('glowing'), 500);
}

function addToStats(game, bet, result, multiplier) {
    const profit = result === 'win' ? bet * multiplier - bet : -bet;
    stats.unshift({
        game,
        bet,
        result,
        profit,
        multiplier
    });
    
    if (stats.length > 10) stats.pop();
    
    updateStatsDisplay();
}

function updateStatsDisplay() {
    const statsList = document.getElementById('stats-list');
    
    if (stats.length === 0) {
        statsList.innerHTML = '<div class="stats-placeholder">Play a game to see stats here!</div>';
        return;
    }
    
    statsList.innerHTML = stats.map(stat => `
        <div class="stat-item ${stat.result}">
            <div>
                <span class="stat-game">${stat.game.toUpperCase()}</span>
                <span style="opacity: 0.7; margin-left: 10px;">${stat.multiplier.toFixed(2)}x</span>
            </div>
            <span class="stat-amount ${stat.result}">${stat.profit >= 0 ? '+' : ''}$${stat.profit.toFixed(2)}</span>
        </div>
    `).join('');
}

// Modifier Buttons
function initModifierButtons() {
    document.querySelectorAll('.btn-modifier').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const input = btn.parentElement.querySelector('input[type="number"]');
            let value = parseFloat(input.value) || 0;
            
            if (action === 'half') {
                value = Math.max(1, value / 2);
            } else if (action === 'double') {
                value = Math.min(balance, value * 2);
            }
            
            input.value = Math.round(value);
            
            // Update total bet display for Plinko
            if (input.id === 'plinko-bet' || input.id === 'plinko-balls') {
                updatePlinkoBetDisplay();
            }
        });
    });
}

// ============= DICE GAME =============
function initDiceGame() {
    const targetInput = document.getElementById('dice-target');
    const targetValue = document.getElementById('dice-target-value');
    const chanceValue = document.getElementById('dice-chance');
    const multiplierDisplay = document.getElementById('dice-multiplier');
    const playButton = document.getElementById('dice-play');
    
    targetInput.addEventListener('input', () => {
        const target = parseFloat(targetInput.value);
        targetValue.textContent = target.toFixed(2);
        
        const chance = 100 - target;
        chanceValue.textContent = `${chance.toFixed(0)}%`;
        
        const multiplier = 99 / chance;
        multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;
    });
    
    playButton.addEventListener('click', playDice);
}

function playDice() {
    if (isPlaying) return;
    
    const bet = parseFloat(document.getElementById('dice-bet').value);
    const target = parseFloat(document.getElementById('dice-target').value);
    const resultElement = document.getElementById('dice-game-result');
    
    if (bet > balance) {
        showResult(resultElement, 'Insufficient balance!', 'lose');
        return;
    }
    
    if (bet <= 0 || isNaN(bet)) {
        showResult(resultElement, 'Invalid bet amount!', 'lose');
        return;
    }
    
    isPlaying = true;
    balance -= bet;
    updateBalance();
    
    // Animation
    const diceNumber = document.getElementById('dice-result');
    diceNumber.classList.add('rolling');
    
    let counter = 0;
    const animationInterval = setInterval(() => {
        diceNumber.textContent = (Math.random() * 100).toFixed(2);
        counter++;
        
        if (counter > 20) {
            clearInterval(animationInterval);
            
            // Generate result
            const roll = Math.random() * 100;
            diceNumber.textContent = roll.toFixed(2);
            diceNumber.classList.remove('rolling');
            
            const chance = 100 - target;
            const multiplier = 99 / chance;
            const won = roll > target;
            
            if (won) {
                const winAmount = bet * multiplier;
                balance += winAmount;
                updateBalance();
                showResult(resultElement, `You won $${winAmount.toFixed(2)}!`, 'win');
                addToStats('dice', bet, 'win', multiplier);
            } else {
                showResult(resultElement, `You lost $${bet.toFixed(2)}`, 'lose');
                addToStats('dice', bet, 'lose', 0);
            }
            
            isPlaying = false;
        }
    }, 50);
}

// ============= CRASH GAME =============
let crashCanvas, crashCtx;
let crashMultiplier = 1.00;
let crashActive = false;
let crashBet = 0;
let crashCashedOut = false;

function initCrashGame() {
    crashCanvas = document.getElementById('crash-canvas');
    crashCtx = crashCanvas.getContext('2d');
    
    const playButton = document.getElementById('crash-play');
    playButton.addEventListener('click', playCrash);
    
    drawCrashGame();
}

function playCrash() {
    if (isPlaying) {
        // Cash out
        if (crashActive && !crashCashedOut) {
            cashOut();
        }
        return;
    }
    
    const bet = parseFloat(document.getElementById('crash-bet').value);
    const resultElement = document.getElementById('crash-game-result');
    const playButton = document.getElementById('crash-play');
    
    if (bet > balance) {
        showResult(resultElement, 'Insufficient balance!', 'lose');
        return;
    }
    
    if (bet <= 0 || isNaN(bet)) {
        showResult(resultElement, 'Invalid bet amount!', 'lose');
        return;
    }
    
    isPlaying = true;
    crashActive = true;
    crashCashedOut = false;
    crashBet = bet;
    balance -= bet;
    updateBalance();
    
    playButton.innerHTML = '<span>Cash Out</span>';
    
    // Start crash animation
    startCrashRound(resultElement);
}

function startCrashRound(resultElement) {
    crashMultiplier = 1.00;
    const crashPoint = Math.random() * 4 + 1.1; // Random crash between 1.1x and 5.1x
    const autoCashout = parseFloat(document.getElementById('crash-autocashout').value);
    
    let points = [];
    let startTime = Date.now();
    
    const animate = () => {
        if (!crashActive) return;
        
        const elapsed = (Date.now() - startTime) / 1000;
        crashMultiplier = Math.pow(1.1, elapsed * 2);
        
        points.push({ x: elapsed, y: crashMultiplier });
        
        // Auto cashout
        if (autoCashout && crashMultiplier >= autoCashout && !crashCashedOut) {
            cashOut();
            return;
        }
        
        // Crash point reached
        if (crashMultiplier >= crashPoint) {
            crash(resultElement);
            return;
        }
        
        drawCrashGame(points, crashMultiplier);
        requestAnimationFrame(animate);
    };
    
    animate();
}

function cashOut() {
    if (!crashActive || crashCashedOut) return;
    
    crashCashedOut = true;
    crashActive = false;
    
    const winAmount = crashBet * crashMultiplier;
    balance += winAmount;
    updateBalance();
    
    const resultElement = document.getElementById('crash-game-result');
    showResult(resultElement, `Cashed out at ${crashMultiplier.toFixed(2)}x! Won $${winAmount.toFixed(2)}`, 'win');
    addToStats('crash', crashBet, 'win', crashMultiplier);
    
    const playButton = document.getElementById('crash-play');
    playButton.innerHTML = '<span>Place Bet</span>';
    isPlaying = false;
}

function crash(resultElement) {
    crashActive = false;
    
    if (!crashCashedOut) {
        showResult(resultElement, `Crashed at ${crashMultiplier.toFixed(2)}x! Lost $${crashBet.toFixed(2)}`, 'lose');
        addToStats('crash', crashBet, 'lose', 0);
    }
    
    const playButton = document.getElementById('crash-play');
    playButton.innerHTML = '<span>Place Bet</span>';
    isPlaying = false;
}

function drawCrashGame(points = [], multiplier = 1.00) {
    const width = crashCanvas.width;
    const height = crashCanvas.height;
    
    // Clear canvas
    crashCtx.fillStyle = 'rgba(15, 12, 41, 0.3)';
    crashCtx.fillRect(0, 0, width, height);
    
    // Draw grid
    crashCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    crashCtx.lineWidth = 1;
    
    for (let i = 0; i < 10; i++) {
        const y = (height / 10) * i;
        crashCtx.beginPath();
        crashCtx.moveTo(0, y);
        crashCtx.lineTo(width, y);
        crashCtx.stroke();
    }
    
    // Draw line
    if (points.length > 1) {
        const maxX = Math.max(...points.map(p => p.x));
        const maxY = Math.max(...points.map(p => p.y));
        
        crashCtx.strokeStyle = crashActive ? '#4ade80' : '#ef4444';
        crashCtx.lineWidth = 3;
        crashCtx.beginPath();
        
        points.forEach((point, i) => {
            const x = (point.x / maxX) * width * 0.9;
            const y = height - (point.y / maxY) * height * 0.8 - 50;
            
            if (i === 0) {
                crashCtx.moveTo(x, y);
            } else {
                crashCtx.lineTo(x, y);
            }
        });
        
        crashCtx.stroke();
    }
    
    // Update multiplier display
    document.getElementById('crash-multiplier').textContent = `${multiplier.toFixed(2)}x`;
    document.getElementById('crash-multiplier').style.color = crashActive ? '#4ade80' : '#ef4444';
}

// ============= PLINKO GAME (MULTI-BALL) =============
let plinkoCanvas, plinkoCtx;
let plinkoBalls = [];
let plinkoPegs = [];
let plinkoRisk = 'low';
let plinkoTotalWinnings = 0;
let plinkoBallsDropped = 0;
let plinkoTotalBallsToBeDropped = 0;

const PLINKO_ROWS = 12;
const PLINKO_MULTIPLIERS = {
    low: [0.5, 0.7, 1.0, 1.2, 1.5, 2.0, 1.5, 1.2, 1.0, 0.7, 0.5],
    medium: [0.3, 0.5, 0.8, 1.5, 2.0, 3.0, 2.0, 1.5, 0.8, 0.5, 0.3],
    high: [0.2, 0.3, 0.5, 1.0, 2.0, 5.0, 2.0, 1.0, 0.5, 0.3, 0.2]
};

function initPlinkoGame() {
    plinkoCanvas = document.getElementById('plinko-canvas');
    plinkoCtx = plinkoCanvas.getContext('2d');
    
    setupPlinkoPegs();
    
    const playButton = document.getElementById('plinko-play');
    playButton.addEventListener('click', playPlinko);
    
    // Risk buttons
    document.querySelectorAll('.risk-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.risk-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            plinkoRisk = btn.dataset.risk;
            drawPlinkoBoard();
        });
    });
    
    // Update total bet display
    const betInput = document.getElementById('plinko-bet');
    const ballsInput = document.getElementById('plinko-balls');
    
    betInput.addEventListener('input', updatePlinkoBetDisplay);
    ballsInput.addEventListener('input', updatePlinkoBetDisplay);
    
    drawPlinkoBoard();
    animatePlinko();
}

function updatePlinkoBetDisplay() {
    const bet = parseFloat(document.getElementById('plinko-bet').value) || 0;
    const balls = parseInt(document.getElementById('plinko-balls').value) || 1;
    const total = bet * balls;
    document.getElementById('plinko-total-bet').textContent = total.toFixed(2);
}

function setupPlinkoPegs() {
    plinkoPegs = [];
    const pegSpacing = 50;
    const startX = 100;
    const startY = 50;
    
    for (let row = 0; row < PLINKO_ROWS; row++) {
        for (let col = 0; col <= row; col++) {
            const x = startX + col * pegSpacing + (PLINKO_ROWS - row) * pegSpacing / 2;
            const y = startY + row * pegSpacing;
            plinkoPegs.push({ x, y });
        }
    }
}

function playPlinko() {
    if (isPlaying) return;
    
    const bet = parseFloat(document.getElementById('plinko-bet').value);
    const numBalls = parseInt(document.getElementById('plinko-balls').value) || 1;
    const totalBet = bet * numBalls;
    const resultElement = document.getElementById('plinko-game-result');
    
    if (totalBet > balance) {
        showResult(resultElement, 'Insufficient balance!', 'lose');
        return;
    }
    
    if (bet <= 0 || isNaN(bet)) {
        showResult(resultElement, 'Invalid bet amount!', 'lose');
        return;
    }
    
    if (numBalls < 1 || numBalls > 10) {
        showResult(resultElement, 'Select 1-10 balls!', 'lose');
        return;
    }
    
    isPlaying = true;
    balance -= totalBet;
    updateBalance();
    
    plinkoTotalWinnings = 0;
    plinkoBallsDropped = 0;
    plinkoTotalBallsToBeDropped = numBalls;
    
    // Drop balls with delay
    for (let i = 0; i < numBalls; i++) {
        setTimeout(() => {
            dropPlinkoBall(bet, resultElement);
        }, i * 200); // 200ms delay between each ball
    }
}

function dropPlinkoBall(bet, resultElement) {
    const ball = {
        x: 300 + (Math.random() - 0.5) * 20,
        y: 20,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        radius: 8,
        bet: bet,
        resultElement: resultElement,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
    };
    
    plinkoBalls.push(ball);
}

function animatePlinko() {
    drawPlinkoBoard();
    
    plinkoBalls.forEach((ball, index) => {
        // Physics
        ball.vy += 0.5; // Gravity
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        // Collision with pegs
        plinkoPegs.forEach(peg => {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < ball.radius + 5) {
                const angle = Math.atan2(dy, dx);
                ball.vx = Math.cos(angle) * 3;
                ball.vy = Math.sin(angle) * 3;
            }
        });
        
        // Draw ball
        plinkoCtx.beginPath();
        plinkoCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        plinkoCtx.fillStyle = ball.color;
        plinkoCtx.shadowBlur = 15;
        plinkoCtx.shadowColor = ball.color;
        plinkoCtx.fill();
        plinkoCtx.shadowBlur = 0;
        
        // Check if ball reached bottom
        if (ball.y > 650) {
            const slot = Math.floor((ball.x - 100) / 45);
            const clampedSlot = Math.max(0, Math.min(10, slot));
            const multiplier = PLINKO_MULTIPLIERS[plinkoRisk][clampedSlot];
            
            const winAmount = ball.bet * multiplier;
            balance += winAmount;
            updateBalance();
            
            plinkoTotalWinnings += winAmount - ball.bet;
            plinkoBallsDropped++;
            
            // Show result when all balls are done
            if (plinkoBallsDropped === plinkoTotalBallsToBeDropped) {
                if (plinkoTotalWinnings > 0) {
                    showResult(ball.resultElement, `Total Win: +$${plinkoTotalWinnings.toFixed(2)}!`, 'win');
                    addToStats('plinko', ball.bet * plinkoTotalBallsToBeDropped, 'win', (plinkoTotalWinnings + ball.bet * plinkoTotalBallsToBeDropped) / (ball.bet * plinkoTotalBallsToBeDropped));
                } else {
                    showResult(ball.resultElement, `Total Loss: $${Math.abs(plinkoTotalWinnings).toFixed(2)}`, 'lose');
                    addToStats('plinko', ball.bet * plinkoTotalBallsToBeDropped, 'lose', 0);
                }
                isPlaying = false;
            }
            
            plinkoBalls.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animatePlinko);
}

function drawPlinkoBoard() {
    const width = plinkoCanvas.width;
    const height = plinkoCanvas.height;
    
    // Clear canvas
    plinkoCtx.fillStyle = 'rgba(15, 12, 41, 0.3)';
    plinkoCtx.fillRect(0, 0, width, height);
    
    // Draw pegs
    plinkoPegs.forEach(peg => {
        plinkoCtx.beginPath();
        plinkoCtx.arc(peg.x, peg.y, 5, 0, Math.PI * 2);
        plinkoCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        plinkoCtx.fill();
    });
    
    // Draw multiplier boxes
    const multipliers = PLINKO_MULTIPLIERS[plinkoRisk];
    const boxWidth = 45;
    const boxHeight = 40;
    const startX = 97;
    const startY = 655;
    
    multipliers.forEach((mult, i) => {
        const x = startX + i * boxWidth;
        
        // Color based on multiplier
        let color;
        if (mult >= 3) color = '#4ade80';
        else if (mult >= 1.5) color = '#60a5fa';
        else if (mult >= 1) color = '#a78bfa';
        else color = '#ef4444';
        
        plinkoCtx.fillStyle = color;
        plinkoCtx.globalAlpha = 0.3;
        plinkoCtx.fillRect(x, startY, boxWidth, boxHeight);
        plinkoCtx.globalAlpha = 1;
        
        plinkoCtx.strokeStyle = color;
        plinkoCtx.lineWidth = 2;
        plinkoCtx.strokeRect(x, startY, boxWidth, boxHeight);
        
        plinkoCtx.fillStyle = '#fff';
        plinkoCtx.font = 'bold 12px Arial';
        plinkoCtx.textAlign = 'center';
        plinkoCtx.fillText(`${mult}x`, x + boxWidth / 2, startY + boxHeight / 2 + 4);
    });
}

// ============= SLOTS GAME =============
const SLOT_SYMBOLS = ['🍒', '🍋', '🍊', '💎', '🔔', '⭐', '7️⃣', '🍀'];
const SLOT_PAYOUTS = {
    '🍒': 5, '🍋': 3, '🍊': 2, '💎': 10, '🔔': 8, '⭐': 15, '7️⃣': 50, '🍀': 100
};

function initSlotsGame() {
    const playButton = document.getElementById('slots-play');
    playButton.addEventListener('click', playSlots);
}

function playSlots() {
    if (isPlaying) return;
    
    const bet = parseFloat(document.getElementById('slots-bet').value);
    const resultElement = document.getElementById('slots-game-result');
    
    if (bet > balance) {
        showResult(resultElement, 'Insufficient balance!', 'lose');
        return;
    }
    
    if (bet <= 0 || isNaN(bet)) {
        showResult(resultElement, 'Invalid bet amount!', 'lose');
        return;
    }
    
    isPlaying = true;
    balance -= bet;
    updateBalance();
    
    // Spin animation
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];
    
    reels.forEach(reel => reel.classList.add('spinning'));
    
    const results = [];
    
    // Stop reels one by one
    reels.forEach((reel, index) => {
        setTimeout(() => {
            reel.classList.remove('spinning');
            const symbol = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
            reel.querySelector('.slot-symbol').textContent = symbol;
            results.push(symbol);
            
            // Check result after all reels stopped
            if (index === 2) {
                setTimeout(() => checkSlotsResult(results, bet, resultElement), 500);
            }
        }, 1000 + index * 500);
    });
}

function checkSlotsResult(results, bet, resultElement) {
    if (results[0] === results[1] && results[1] === results[2]) {
        const symbol = results[0];
        const multiplier = SLOT_PAYOUTS[symbol];
        const winAmount = bet * multiplier;
        
        balance += winAmount;
        updateBalance();
        showResult(resultElement, `JACKPOT! ${symbol}${symbol}${symbol} = ${multiplier}x! Won $${winAmount.toFixed(2)}!`, 'win');
        addToStats('slots', bet, 'win', multiplier);
    } else {
        showResult(resultElement, `No match. Lost $${bet.toFixed(2)}`, 'lose');
        addToStats('slots', bet, 'lose', 0);
    }
    
    isPlaying = false;
}

// ============= MINES GAME =============
let minesGameActive = false;
let minesBet = 0;
let minesCount = 3;
let minesRevealed = 0;
let minesPositions = [];

function initMinesGame() {
    const playButton = document.getElementById('mines-play');
    const cashoutButton = document.getElementById('mines-cashout');
    
    playButton.addEventListener('click', startMinesGame);
    cashoutButton.addEventListener('click', cashoutMines);
    
    // Mines count buttons
    document.querySelectorAll('.mines-count-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (minesGameActive) return;
            document.querySelectorAll('.mines-count-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            minesCount = parseInt(btn.dataset.mines);
        });
    });
    
    createMinesGrid();
}

function createMinesGrid() {
    const grid = document.getElementById('mines-grid');
    if (!grid) {
        console.error('Mines grid not found!');
        return;
    }
    grid.innerHTML = '';
    
    for (let i = 0; i < 25; i++) {
        const tile = document.createElement('div');
        tile.className = 'mine-tile';
        tile.dataset.index = i;
        tile.style.cursor = 'pointer';
        
        // Use a closure to capture the correct index
        (function(index) {
            tile.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Tile clicked:', index);
                revealMineTile(index);
            });
        })(i);
        
        grid.appendChild(tile);
    }
    console.log('Mines grid created with 25 tiles');
}

function startMinesGame() {
    if (minesGameActive || isPlaying) return;
    
    const bet = parseFloat(document.getElementById('mines-bet').value);
    const resultElement = document.getElementById('mines-game-result');
    
    if (bet > balance) {
        showResult(resultElement, 'Insufficient balance!', 'lose');
        return;
    }
    
    if (bet <= 0 || isNaN(bet)) {
        showResult(resultElement, 'Invalid bet amount!', 'lose');
        return;
    }
    
    isPlaying = true;
    minesGameActive = true;
    minesBet = bet;
    minesRevealed = 0;
    balance -= bet;
    updateBalance();
    
    // Place mines
    minesPositions = [];
    while (minesPositions.length < minesCount) {
        const pos = Math.floor(Math.random() * 25);
        if (!minesPositions.includes(pos)) {
            minesPositions.push(pos);
        }
    }
    
    createMinesGrid();
    document.getElementById('mines-play').style.display = 'none';
    document.getElementById('mines-cashout').style.display = 'block';
    updateMinesMultiplier();
}

function revealMineTile(index) {
    console.log('revealMineTile called with index:', index, 'gameActive:', minesGameActive);
    
    if (!minesGameActive) {
        console.log('Game not active, returning');
        return;
    }
    
    const tiles = document.querySelectorAll('.mine-tile');
    console.log('Total tiles found:', tiles.length);
    
    const tile = tiles[index];
    if (!tile) {
        console.error('Tile not found at index:', index);
        return;
    }
    
    if (tile.classList.contains('revealed')) {
        console.log('Tile already revealed');
        return;
    }
    
    tile.classList.add('revealed');
    
    if (minesPositions.includes(index)) {
        // Hit a mine!
        console.log('Hit a mine!');
        tile.classList.add('mine');
        tile.textContent = '💣';
        endMinesGame(false);
    } else {
        // Found a gem!
        console.log('Found a gem!');
        tile.classList.add('gem');
        tile.textContent = '💎';
        minesRevealed++;
        updateMinesMultiplier();
        
        // Check if won all
        if (minesRevealed === 25 - minesCount) {
            cashoutMines();
        }
    }
}

function updateMinesMultiplier() {
    const totalTiles = 25 - minesCount;
    const multiplier = 1 + (minesRevealed * 0.3 * (minesCount / 3));
    document.getElementById('mines-current-mult').textContent = `${multiplier.toFixed(2)}x`;
}

function cashoutMines() {
    if (!minesGameActive) return;
    
    const multiplier = 1 + (minesRevealed * 0.3 * (minesCount / 3));
    const winAmount = minesBet * multiplier;
    
    balance += winAmount;
    updateBalance();
    
    const resultElement = document.getElementById('mines-game-result');
    showResult(resultElement, `Cashed out ${minesRevealed} gems! Won $${winAmount.toFixed(2)}!`, 'win');
    addToStats('mines', minesBet, 'win', multiplier);
    
    endMinesGame(true);
}

function endMinesGame(won) {
    minesGameActive = false;
    isPlaying = false;
    
    if (!won) {
        const resultElement = document.getElementById('mines-game-result');
        showResult(resultElement, `Hit a mine! Lost $${minesBet.toFixed(2)}`, 'lose');
        addToStats('mines', minesBet, 'lose', 0);
    }
    
    // Reveal all mines
    minesPositions.forEach(pos => {
        const tile = document.querySelectorAll('.mine-tile')[pos];
        if (!tile.classList.contains('revealed')) {
            tile.classList.add('revealed', 'mine');
            tile.textContent = '💣';
        }
    });
    
    document.getElementById('mines-play').style.display = 'block';
    document.getElementById('mines-cashout').style.display = 'none';
    
    setTimeout(() => {
        createMinesGrid();
        document.getElementById('mines-current-mult').textContent = '1.00x';
    }, 3000);
}

// ============= WHEEL GAME =============
let wheelCanvas, wheelCtx;
let wheelRotation = 0;
let wheelSpinning = false;

const WHEEL_MULTIPLIERS = {
    low: [0.5, 1.2, 0.8, 1.5, 0.5, 1.2, 0.8, 2.0],
    medium: [0.2, 1.0, 0.5, 2.0, 0.2, 1.5, 0.5, 5.0],
    high: [0.1, 0.5, 0.2, 2.0, 0.1, 1.0, 0.5, 10.0]
};

let wheelRisk = 'low';

function initWheelGame() {
    wheelCanvas = document.getElementById('wheel-canvas');
    wheelCtx = wheelCanvas.getContext('2d');
    
    const playButton = document.getElementById('wheel-play');
    playButton.addEventListener('click', playWheel);
    
    // Risk buttons
    document.querySelectorAll('#wheel-game .risk-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (wheelSpinning) return;
            document.querySelectorAll('#wheel-game .risk-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            wheelRisk = btn.dataset.risk;
            drawWheel();
        });
    });
    
    drawWheel();
}

function playWheel() {
    if (isPlaying || wheelSpinning) return;
    
    const bet = parseFloat(document.getElementById('wheel-bet').value);
    const resultElement = document.getElementById('wheel-game-result');
    
    if (bet > balance) {
        showResult(resultElement, 'Insufficient balance!', 'lose');
        return;
    }
    
    if (bet <= 0 || isNaN(bet)) {
        showResult(resultElement, 'Invalid bet amount!', 'lose');
        return;
    }
    
    isPlaying = true;
    wheelSpinning = true;
    balance -= bet;
    updateBalance();
    
    const spins = 5 + Math.random() * 3;
    const targetRotation = spins * 360 + Math.random() * 360;
    const duration = 3000;
    const startTime = Date.now();
    const startRotation = wheelRotation;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        wheelRotation = startRotation + targetRotation * eased;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            wheelSpinning = false;
            
            // Determine result
            const normalizedRotation = wheelRotation % 360;
            const segmentAngle = 360 / 8;
            const segmentIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % 8;
            const multiplier = WHEEL_MULTIPLIERS[wheelRisk][segmentIndex];
            
            if (multiplier > 1) {
                const winAmount = bet * multiplier;
                balance += winAmount;
                updateBalance();
                showResult(resultElement, `Landed on ${multiplier}x! Won $${winAmount.toFixed(2)}!`, 'win');
                addToStats('wheel', bet, 'win', multiplier);
            } else {
                showResult(resultElement, `Landed on ${multiplier}x. Lost $${(bet - bet * multiplier).toFixed(2)}`, 'lose');
                addToStats('wheel', bet, 'lose', multiplier);
                balance += bet * multiplier;
                updateBalance();
            }
            
            isPlaying = false;
        }
    }
    
    animate();
}

function drawWheel() {
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = 250;
    const multipliers = WHEEL_MULTIPLIERS[wheelRisk];
    const segmentAngle = (2 * Math.PI) / multipliers.length;
    
    wheelCtx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    wheelCtx.save();
    wheelCtx.translate(centerX, centerY);
    wheelCtx.rotate((wheelRotation * Math.PI) / 180);
    
    multipliers.forEach((mult, i) => {
        const startAngle = i * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        
        // Color based on multiplier
        let color;
        if (mult >= 5) color = '#4ade80';
        else if (mult >= 2) color = '#60a5fa';
        else if (mult >= 1) color = '#a78bfa';
        else color = '#ef4444';
        
        wheelCtx.beginPath();
        wheelCtx.moveTo(0, 0);
        wheelCtx.arc(0, 0, radius, startAngle, endAngle);
        wheelCtx.closePath();
        wheelCtx.fillStyle = color;
        wheelCtx.fill();
        wheelCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        wheelCtx.lineWidth = 3;
        wheelCtx.stroke();
        
        // Draw text
        wheelCtx.save();
        wheelCtx.rotate(startAngle + segmentAngle / 2);
        wheelCtx.textAlign = 'center';
        wheelCtx.fillStyle = '#fff';
        wheelCtx.font = 'bold 24px Arial';
        wheelCtx.fillText(`${mult}x`, radius * 0.7, 8);
        wheelCtx.restore();
    });
    
    // Draw center circle
    wheelCtx.beginPath();
    wheelCtx.arc(0, 0, 40, 0, 2 * Math.PI);
    wheelCtx.fillStyle = '#0f0c29';
    wheelCtx.fill();
    wheelCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    wheelCtx.lineWidth = 3;
    wheelCtx.stroke();
    
    wheelCtx.restore();
}

// ============= LIMBO GAME =============
function initLimboGame() {
    const targetInput = document.getElementById('limbo-target');
    const playButton = document.getElementById('limbo-play');
    
    targetInput.addEventListener('input', () => {
        const target = parseFloat(targetInput.value);
        document.getElementById('limbo-target-display').textContent = `${target.toFixed(2)}x`;
        
        // Harder calculation - lower win chance
        const chance = (95 / target);
        document.getElementById('limbo-chance').textContent = `${chance.toFixed(2)}%`;
    });
    
    playButton.addEventListener('click', playLimbo);
}

function playLimbo() {
    if (isPlaying) return;
    
    const bet = parseFloat(document.getElementById('limbo-bet').value);
    const target = parseFloat(document.getElementById('limbo-target').value);
    const resultElement = document.getElementById('limbo-game-result');
    
    if (bet > balance) {
        showResult(resultElement, 'Insufficient balance!', 'lose');
        return;
    }
    
    if (bet <= 0 || isNaN(bet)) {
        showResult(resultElement, 'Invalid bet amount!', 'lose');
        return;
    }
    
    if (target < 1.10) {
        showResult(resultElement, 'Target must be at least 1.10x!', 'lose');
        return;
    }
    
    isPlaying = true;
    balance -= bet;
    updateBalance();
    
    const limboResult = document.getElementById('limbo-result');
    
    // Animation
    let counter = 0;
    const animationInterval = setInterval(() => {
        const randomMult = (Math.random() * 10 + 1).toFixed(2);
        limboResult.textContent = `${randomMult}x`;
        counter++;
        
        if (counter > 20) {
            clearInterval(animationInterval);
            
            // Generate result using exponential distribution - HARDER
            // Lower results are more common
            const result = Math.exp(Math.random() * Math.random() * Math.log(50));
            limboResult.textContent = `${result.toFixed(2)}x`;
            
            if (result >= target) {
                const winAmount = bet * target;
                balance += winAmount;
                updateBalance();
                showResult(resultElement, `${result.toFixed(2)}x >= ${target.toFixed(2)}x! Won $${winAmount.toFixed(2)}!`, 'win');
                addToStats('limbo', bet, 'win', target);
            } else {
                showResult(resultElement, `${result.toFixed(2)}x < ${target.toFixed(2)}x. Lost $${bet.toFixed(2)}`, 'lose');
                addToStats('limbo', bet, 'lose', 0);
            }
            
            isPlaying = false;
        }
    }, 50);
}

// ============= TOWER GAME =============
let towerGameActive = false;
let towerBet = 0;
let towerLevel = 0;
let towerDifficulty = 'easy';
let towerCurrentRow = [];

const TOWER_LEVELS = 8;
const TOWER_DIFFICULTY = {
    easy: { blocks: 3, safe: 2 },    // 2 safe, 1 danger per row
    medium: { blocks: 3, safe: 1 },  // 1 safe, 2 danger per row
    hard: { blocks: 4, safe: 1 }     // 1 safe, 3 danger per row
};

const TOWER_MULTIPLIERS = {
    easy: [1.3, 1.6, 2.0, 2.5, 3.1, 3.9, 4.9, 6.2],
    medium: [1.8, 2.7, 4.0, 6.0, 9.0, 13.5, 20.3, 30.4],
    hard: [2.5, 5.0, 10.0, 20.0, 40.0, 80.0, 160.0, 320.0]
};

function initTowerGame() {
    const playButton = document.getElementById('tower-play');
    const cashoutButton = document.getElementById('tower-cashout');
    
    playButton.addEventListener('click', startTowerGame);
    cashoutButton.addEventListener('click', cashoutTower);
    
    // Difficulty buttons
    document.querySelectorAll('#tower-game .risk-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (towerGameActive) return;
            document.querySelectorAll('#tower-game .risk-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            towerDifficulty = btn.dataset.difficulty;
        });
    });
}

function startTowerGame() {
    if (towerGameActive || isPlaying) return;
    
    const bet = parseFloat(document.getElementById('tower-bet').value);
    const resultElement = document.getElementById('tower-game-result');
    
    if (bet > balance) {
        showResult(resultElement, 'Insufficient balance!', 'lose');
        return;
    }
    
    if (bet <= 0 || isNaN(bet)) {
        showResult(resultElement, 'Invalid bet amount!', 'lose');
        return;
    }
    
    isPlaying = true;
    towerGameActive = true;
    towerBet = bet;
    towerLevel = 0;
    balance -= bet;
    updateBalance();
    
    createTowerGrid();
    document.getElementById('tower-play').style.display = 'none';
    document.getElementById('tower-cashout').style.display = 'block';
    
    updateTowerDisplay();
}

function createTowerGrid() {
    const grid = document.getElementById('tower-grid');
    grid.innerHTML = '';
    
    const config = TOWER_DIFFICULTY[towerDifficulty];
    
    // Create 8 levels
    for (let level = 0; level < TOWER_LEVELS; level++) {
        const row = document.createElement('div');
        row.className = 'tower-row';
        row.dataset.level = level;
        
        // Create blocks for this row
        const safePositions = [];
        while (safePositions.length < config.safe) {
            const pos = Math.floor(Math.random() * config.blocks);
            if (!safePositions.includes(pos)) {
                safePositions.push(pos);
            }
        }
        
        for (let i = 0; i < config.blocks; i++) {
            const block = document.createElement('div');
            block.className = 'tower-block';
            block.dataset.level = level;
            block.dataset.position = i;
            block.dataset.safe = safePositions.includes(i) ? 'true' : 'false';
            
            // Only first row is clickable initially
            if (level !== 0) {
                block.classList.add('disabled');
            }
            
            block.addEventListener('click', function() {
                clickTowerBlock(parseInt(this.dataset.level), parseInt(this.dataset.position));
            });
            
            row.appendChild(block);
        }
        
        grid.appendChild(row);
    }
}

function clickTowerBlock(level, position) {
    if (!towerGameActive || level !== towerLevel) return;
    
    const blocks = document.querySelectorAll(`.tower-block[data-level="${level}"]`);
    const clickedBlock = blocks[position];
    
    if (clickedBlock.classList.contains('revealed') || clickedBlock.classList.contains('disabled')) {
        return;
    }
    
    const isSafe = clickedBlock.dataset.safe === 'true';
    
    // Reveal all blocks in current row
    blocks.forEach(block => {
        block.classList.add('revealed');
        if (block.dataset.safe === 'true') {
            block.classList.add('safe');
            block.textContent = '✓';
        } else {
            block.classList.add('danger');
            block.textContent = '✗';
        }
    });
    
    if (isSafe) {
        // Success! Move to next level
        towerLevel++;
        updateTowerDisplay();
        
        // Mark current row as completed
        blocks.forEach(block => {
            block.classList.add('completed');
        });
        
        if (towerLevel >= TOWER_LEVELS) {
            // Won the whole tower!
            setTimeout(() => cashoutTower(), 1000);
        } else {
            // Enable next row
            setTimeout(() => {
                const nextBlocks = document.querySelectorAll(`.tower-block[data-level="${towerLevel}"]`);
                nextBlocks.forEach(block => {
                    block.classList.remove('disabled');
                });
            }, 500);
        }
    } else {
        // Hit a danger block!
        endTowerGame(false);
    }
}

function updateTowerDisplay() {
    document.getElementById('tower-level').textContent = towerLevel;
    
    const multiplier = towerLevel > 0 ? TOWER_MULTIPLIERS[towerDifficulty][towerLevel - 1] : 1.00;
    document.getElementById('tower-multiplier').textContent = `${multiplier.toFixed(2)}x`;
}

function cashoutTower() {
    if (!towerGameActive || towerLevel === 0) return;
    
    const multiplier = TOWER_MULTIPLIERS[towerDifficulty][towerLevel - 1];
    const winAmount = towerBet * multiplier;
    
    balance += winAmount;
    updateBalance();
    
    const resultElement = document.getElementById('tower-game-result');
    showResult(resultElement, `Climbed ${towerLevel} level${towerLevel > 1 ? 's' : ''}! Won $${winAmount.toFixed(2)}!`, 'win');
    addToStats('tower', towerBet, 'win', multiplier);
    
    endTowerGame(true);
}

function endTowerGame(won) {
    towerGameActive = false;
    isPlaying = false;
    
    if (!won && towerLevel === 0) {
        const resultElement = document.getElementById('tower-game-result');
        showResult(resultElement, `Hit danger! Lost $${towerBet.toFixed(2)}`, 'lose');
        addToStats('tower', towerBet, 'lose', 0);
    }
    
    // Reveal all remaining danger blocks
    const allBlocks = document.querySelectorAll('.tower-block');
    allBlocks.forEach(block => {
        if (!block.classList.contains('revealed')) {
            block.classList.add('revealed', 'disabled');
            if (block.dataset.safe === 'false') {
                block.classList.add('danger');
                block.textContent = '✗';
            }
        }
    });
    
    document.getElementById('tower-play').style.display = 'block';
    document.getElementById('tower-cashout').style.display = 'none';
    
    setTimeout(() => {
        document.getElementById('tower-level').textContent = '0';
        document.getElementById('tower-multiplier').textContent = '1.00x';
    }, 3000);
}

// ============= COIN FLIP GAME =============
let coinSide = 'heads';

function initCoinFlipGame() {
    const playButton = document.getElementById('coinflip-play');
    playButton.addEventListener('click', playCoinFlip);
    
    // Side selection buttons
    document.querySelectorAll('#coinflip-game .risk-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#coinflip-game .risk-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            coinSide = btn.dataset.side;
        });
    });
}

function playCoinFlip() {
    if (isPlaying) return;
    
    const bet = parseFloat(document.getElementById('coinflip-bet').value);
    const resultElement = document.getElementById('coinflip-game-result');
    
    if (bet > balance) {
        showResult(resultElement, 'Insufficient balance!', 'lose');
        return;
    }
    
    if (bet <= 0 || isNaN(bet)) {
        showResult(resultElement, 'Invalid bet amount!', 'lose');
        return;
    }
    
    isPlaying = true;
    balance -= bet;
    updateBalance();
    
    const coin = document.getElementById('coin');
    const coinResultText = document.getElementById('coin-result-text');
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    
    // Reset and animate coin flip
    coin.style.animation = 'none';
    coin.style.transform = '';
    coinResultText.textContent = 'Flipping...';
    coinResultText.style.color = 'rgba(255, 255, 255, 0.5)';
    
    setTimeout(() => {
        coin.style.animation = 'coinFlip 1s ease-out';
    }, 10);
    
    setTimeout(() => {
        // Set final position
        coin.style.animation = 'none';
        if (result === 'heads') {
            coin.style.transform = 'rotateY(0deg)';
            coinResultText.textContent = '🙂 HEADS!';
            coinResultText.style.color = '#fbbf24';
        } else {
            coin.style.transform = 'rotateY(180deg)';
            coinResultText.textContent = '👑 TAILS!';
            coinResultText.style.color = '#9ca3af';
        }
        
        const won = result === coinSide;
        
        if (won) {
            const winAmount = bet * 2;
            balance += winAmount;
            updateBalance();
            showResult(resultElement, `${result.toUpperCase()}! You won $${winAmount.toFixed(2)}!`, 'win');
            addToStats('coinflip', bet, 'win', 2);
        } else {
            showResult(resultElement, `${result.toUpperCase()}! You lost $${bet.toFixed(2)}`, 'lose');
            addToStats('coinflip', bet, 'lose', 0);
        }
        
        isPlaying = false;
    }, 1200);
}

// ============= HI-LO CARD GAME =============
let hiloGameActive = false;
let hiloBet = 0;
let hiloCurrentCard = 7;
let hiloStreak = 0;
let hiloMultiplier = 1.0;

const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const CARD_SUITS = ['♥️', '♦️', '♣️', '♠️'];

function initHiLoGame() {
    const playButton = document.getElementById('hilo-play');
    const cashoutButton = document.getElementById('hilo-cashout');
    const higherButton = document.getElementById('hilo-higher');
    const lowerButton = document.getElementById('hilo-lower');
    
    playButton.addEventListener('click', startHiLoGame);
    cashoutButton.addEventListener('click', cashoutHiLo);
    higherButton.addEventListener('click', () => guessHiLo('higher'));
    lowerButton.addEventListener('click', () => guessHiLo('lower'));
}

function startHiLoGame() {
    if (hiloGameActive || isPlaying) return;
    
    const bet = parseFloat(document.getElementById('hilo-bet').value);
    const resultElement = document.getElementById('hilo-game-result');
    
    if (bet > balance) {
        showResult(resultElement, 'Insufficient balance!', 'lose');
        return;
    }
    
    if (bet <= 0 || isNaN(bet)) {
        showResult(resultElement, 'Invalid bet amount!', 'lose');
        return;
    }
    
    isPlaying = true;
    hiloGameActive = true;
    hiloBet = bet;
    hiloStreak = 0;
    hiloMultiplier = 1.0;
    balance -= bet;
    updateBalance();
    
    // Draw first card
    hiloCurrentCard = Math.floor(Math.random() * 13) + 1;
    displayHiLoCard('current', hiloCurrentCard);
    
    document.getElementById('hilo-play').style.display = 'none';
    document.getElementById('hilo-cashout').style.display = 'block';
    document.querySelector('.hilo-buttons-group').style.display = 'block';
    document.getElementById('hilo-streak-count').textContent = hiloStreak;
}

function guessHiLo(guess) {
    if (!hiloGameActive) return;
    
    const nextCard = Math.floor(Math.random() * 13) + 1;
    displayHiLoCard('next', nextCard);
    
    setTimeout(() => {
        let correct = false;
        if (guess === 'higher' && nextCard > hiloCurrentCard) correct = true;
        if (guess === 'lower' && nextCard < hiloCurrentCard) correct = true;
        
        if (correct) {
            hiloStreak++;
            hiloMultiplier = 1 + (hiloStreak * 0.5);
            document.getElementById('hilo-streak-count').textContent = hiloStreak;
            
            // Move next card to current
            setTimeout(() => {
                hiloCurrentCard = nextCard;
                displayHiLoCard('current', hiloCurrentCard);
                hideHiLoNextCard();
            }, 1000);
        } else {
            // Lost!
            endHiLoGame(false);
        }
    }, 500);
}

function displayHiLoCard(position, cardValue) {
    const cardElement = position === 'current' 
        ? document.getElementById('hilo-current-card')
        : document.getElementById('hilo-next-card');
    
    const suit = CARD_SUITS[Math.floor(Math.random() * 4)];
    const value = CARD_VALUES[cardValue - 1];
    
    cardElement.classList.remove('hilo-card-hidden');
    cardElement.innerHTML = `
        <div class="card-value">${value}</div>
        <div class="card-suit">${suit}</div>
    `;
    cardElement.classList.add('card-reveal');
    setTimeout(() => cardElement.classList.remove('card-reveal'), 500);
}

function hideHiLoNextCard() {
    const nextCard = document.getElementById('hilo-next-card');
    nextCard.classList.add('hilo-card-hidden');
    nextCard.innerHTML = '<div class="card-back">?</div>';
}

function cashoutHiLo() {
    if (!hiloGameActive || hiloStreak === 0) return;
    endHiLoGame(true);
}

function endHiLoGame(won) {
    hiloGameActive = false;
    isPlaying = false;
    
    const resultElement = document.getElementById('hilo-game-result');
    
    if (won) {
        const winAmount = hiloBet * hiloMultiplier;
        balance += winAmount;
        updateBalance();
        showResult(resultElement, `${hiloStreak} streak! Won $${winAmount.toFixed(2)}!`, 'win');
        addToStats('hilo', hiloBet, 'win', hiloMultiplier);
    } else {
        showResult(resultElement, `Wrong guess! Lost $${hiloBet.toFixed(2)}`, 'lose');
        addToStats('hilo', hiloBet, 'lose', 0);
    }
    
    document.getElementById('hilo-play').style.display = 'block';
    document.getElementById('hilo-cashout').style.display = 'none';
    document.querySelector('.hilo-buttons-group').style.display = 'none';
    
    setTimeout(() => {
        hiloStreak = 0;
        document.getElementById('hilo-streak-count').textContent = '0';
        hideHiLoNextCard();
    }, 2000);
}

// ============= KENO GAME =============
let kenoSelectedNumbers = [];
let kenoDrawnNumbers = [];

function initKenoGame() {
    const playButton = document.getElementById('keno-play');
    const clearButton = document.getElementById('keno-clear');
    
    playButton.addEventListener('click', playKeno);
    clearButton.addEventListener('click', clearKenoSelection);
    
    createKenoBoard();
}

function createKenoBoard() {
    const board = document.getElementById('keno-board');
    if (!board) {
        console.error('Keno board element not found!');
        return;
    }
    board.innerHTML = '';
    
    for (let i = 1; i <= 40; i++) {
        const number = document.createElement('div');
        number.className = 'keno-number';
        number.textContent = i;
        number.dataset.number = i;
        
        number.addEventListener('click', function() {
            toggleKenoNumber(i, this);
        });
        
        board.appendChild(number);
    }
    console.log('Keno board created with 40 numbers');
}

function toggleKenoNumber(num, element) {
    if (isPlaying) return;
    
    const index = kenoSelectedNumbers.indexOf(num);
    
    if (index > -1) {
        // Deselect
        kenoSelectedNumbers.splice(index, 1);
        element.classList.remove('selected');
    } else {
        // Select (max 10)
        if (kenoSelectedNumbers.length < 10) {
            kenoSelectedNumbers.push(num);
            element.classList.add('selected');
        }
    }
    
    document.getElementById('keno-selected').textContent = kenoSelectedNumbers.length;
}

function clearKenoSelection() {
    if (isPlaying) return;
    
    kenoSelectedNumbers = [];
    kenoDrawnNumbers = [];
    document.querySelectorAll('.keno-number').forEach(num => {
        num.classList.remove('selected', 'hit', 'miss', 'drawn');
    });
    document.getElementById('keno-selected').textContent = '0';
    document.getElementById('keno-matches').textContent = '0';
}

function playKeno() {
    if (isPlaying) return;
    
    const bet = parseFloat(document.getElementById('keno-bet').value);
    const resultElement = document.getElementById('keno-game-result');
    
    if (kenoSelectedNumbers.length !== 10) {
        showResult(resultElement, 'Please select exactly 10 numbers!', 'lose');
        return;
    }
    
    if (bet > balance) {
        showResult(resultElement, 'Insufficient balance!', 'lose');
        return;
    }
    
    if (bet <= 0 || isNaN(bet)) {
        showResult(resultElement, 'Invalid bet amount!', 'lose');
        return;
    }
    
    isPlaying = true;
    balance -= bet;
    updateBalance();
    
    // Draw 20 random numbers
    kenoDrawnNumbers = [];
    while (kenoDrawnNumbers.length < 20) {
        const num = Math.floor(Math.random() * 40) + 1;
        if (!kenoDrawnNumbers.includes(num)) {
            kenoDrawnNumbers.push(num);
        }
    }
    
    // Animate drawing
    let drawIndex = 0;
    const drawInterval = setInterval(() => {
        if (drawIndex < kenoDrawnNumbers.length) {
            const drawnNum = kenoDrawnNumbers[drawIndex];
            const numElement = document.querySelector(`.keno-number[data-number="${drawnNum}"]`);
            
            numElement.classList.add('drawn');
            
            if (kenoSelectedNumbers.includes(drawnNum)) {
                numElement.classList.add('hit');
            }
            
            drawIndex++;
        } else {
            clearInterval(drawInterval);
            calculateKenoResult(bet, resultElement);
        }
    }, 100);
}

function calculateKenoResult(bet, resultElement) {
    const matches = kenoSelectedNumbers.filter(num => kenoDrawnNumbers.includes(num)).length;
    document.getElementById('keno-matches').textContent = matches;
    
    // Payout table for 10 picks
    const payouts = {
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0,
        5: 2, 6: 5, 7: 10, 8: 25, 9: 100, 10: 500
    };
    
    const multiplier = payouts[matches];
    
    if (multiplier > 0) {
        const winAmount = bet * multiplier;
        balance += winAmount;
        updateBalance();
        showResult(resultElement, `${matches} matches! Won $${winAmount.toFixed(2)}!`, 'win');
        addToStats('keno', bet, 'win', multiplier);
    } else {
        showResult(resultElement, `Only ${matches} matches. Lost $${bet.toFixed(2)}`, 'lose');
        addToStats('keno', bet, 'lose', 0);
    }
    
    isPlaying = false;
    
    setTimeout(() => {
        clearKenoSelection();
        document.getElementById('keno-matches').textContent = '0';
    }, 3000);
}

// Helper Functions
function showResult(element, message, type) {
    element.textContent = message;
    element.className = `game-result show ${type}`;
    
    setTimeout(() => {
        element.classList.remove('show');
    }, 3000);
}

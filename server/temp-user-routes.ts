import { Router } from 'express';

const router = Router();

// Temporary investment data
const tempInvestments: any[] = [
  {
    id: 1,
    userId: 1,
    walletAddress: '0x1234...5678',
    monthlyAmount: '500.00',
    totalInvested: '6000.00',
    hktTokens: '60000',
    currentValue: '6900.00',
    profit: '900.00',
    roi: '15.00',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    startDate: '2024-01-01',
    monthsInvested: 12
  }
];

// Temporary HKT stats
const tempHktStats = {
  currentPrice: 0.10,
  priceChange24h: 2.5,
  marketCap: 1000000,
  volume24h: 50000,
  totalSupply: 10000000
};

// Temporary wallet data
const tempWallets = [
  {
    id: 1,
    userId: 1,
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    chainId: '1',
    chainName: 'Ethereum',
    isPrimary: true,
    isVerified: true,
    verifiedAt: new Date().toISOString()
  }
];

// Dashboard data
router.get('/dashboard', (req, res) => {
  try {
    const totalInvested = tempInvestments.reduce((sum, inv) => sum + parseFloat(inv.totalInvested), 0);
    const totalTokens = tempInvestments.reduce((sum, inv) => sum + parseFloat(inv.hktTokens), 0);
    const totalValue = tempInvestments.reduce((sum, inv) => sum + parseFloat(inv.currentValue), 0);
    const totalProfit = totalValue - totalInvested;
    const avgROI = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    res.json({
      investments: tempInvestments,
      summary: {
        totalInvested: totalInvested.toFixed(2),
        totalTokens: totalTokens.toFixed(0),
        totalValue: totalValue.toFixed(2),
        totalProfit: totalProfit.toFixed(2),
        avgROI: avgROI.toFixed(2)
      },
      hktStats: tempHktStats
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// HKT price data
router.get('/hkt-price', (req, res) => {
  try {
    res.json(tempHktStats);
  } catch (error) {
    console.error('HKT price error:', error);
    res.status(500).json({ error: 'Failed to fetch HKT price' });
  }
});

// Investment projections
router.post('/investment-projections', (req, res) => {
  try {
    const { monthlyAmount, months } = req.body;
    const hktPrice = tempHktStats.currentPrice;
    const annualGrowth = 0.15; // 15% annual growth
    
    const projections = [];
    let totalInvested = 0;
    let totalTokens = 0;

    for (let month = 1; month <= months; month++) {
      totalInvested += monthlyAmount;
      const tokensThisMonth = monthlyAmount / hktPrice;
      totalTokens += tokensThisMonth;
      
      // Calculate appreciation (compound monthly)
      const monthlyGrowthRate = Math.pow(1 + annualGrowth, 1/12) - 1;
      const appreciatedPrice = hktPrice * Math.pow(1 + monthlyGrowthRate, month);
      const currentValue = totalTokens * appreciatedPrice;
      const profit = currentValue - totalInvested;
      const roi = (profit / totalInvested) * 100;

      projections.push({
        month,
        totalInvested: totalInvested.toFixed(2),
        totalTokens: totalTokens.toFixed(0),
        tokenPrice: appreciatedPrice.toFixed(4),
        currentValue: currentValue.toFixed(2),
        profit: profit.toFixed(2),
        roi: roi.toFixed(2)
      });
    }

    res.json({ projections });
  } catch (error) {
    console.error('Investment projection error:', error);
    res.status(500).json({ error: 'Failed to calculate projections' });
  }
});

// Create investment
router.post('/create-investment', (req, res) => {
  try {
    const { walletAddress, monthlyAmount } = req.body;
    
    const investment = {
      id: tempInvestments.length + 1,
      userId: 1,
      walletAddress,
      monthlyAmount: monthlyAmount.toString(),
      totalInvested: '0.00',
      hktTokens: '0',
      currentValue: '0.00',
      profit: '0.00',
      roi: '0.00',
      isActive: true,
      createdAt: new Date(),
      startDate: new Date().toISOString().split('T')[0],
      monthsInvested: 0
    };
    
    tempInvestments.push(investment);
    console.log('[TEMP] Investment created:', investment.id);
    
    res.json({ success: true, investment });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ error: 'Failed to create investment' });
  }
});

// User wallets
router.get('/user-wallets', (req, res) => {
  try {
    res.json(tempWallets);
  } catch (error) {
    console.error('User wallets error:', error);
    res.status(500).json({ error: 'Failed to fetch wallets' });
  }
});

// Generate wallet challenge
router.post('/generate-challenge', (req, res) => {
  try {
    const { walletAddress } = req.body;
    const challenge = `Please sign this message to verify ownership of wallet ${walletAddress}: ${Date.now()}`;
    
    console.log('[TEMP] Challenge generated for:', walletAddress);
    res.json({ challenge });
  } catch (error) {
    console.error('Generate challenge error:', error);
    res.status(500).json({ error: 'Failed to generate challenge' });
  }
});

// Verify signature
router.post('/verify-signature', (req, res) => {
  try {
    const { walletAddress, signature, challenge } = req.body;
    
    // Simulate verification success
    const wallet = {
      id: tempWallets.length + 1,
      userId: 1,
      walletAddress,
      chainId: '1',
      chainName: 'Ethereum',
      isPrimary: tempWallets.length === 0,
      isVerified: true,
      verifiedAt: new Date().toISOString()
    };
    
    tempWallets.push(wallet);
    console.log('[TEMP] Wallet verified:', walletAddress);
    
    res.json({ success: true, wallet });
  } catch (error) {
    console.error('Verify signature error:', error);
    res.status(500).json({ error: 'Failed to verify signature' });
  }
});

// Set primary wallet
router.post('/set-primary', (req, res) => {
  try {
    const { walletId } = req.body;
    
    // Reset all wallets to not primary
    tempWallets.forEach(wallet => {
      wallet.isPrimary = false;
    });
    
    // Set the selected wallet as primary
    const wallet = tempWallets.find(w => w.id === walletId);
    if (wallet) {
      wallet.isPrimary = true;
      console.log('[TEMP] Primary wallet set:', wallet.walletAddress);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Wallet not found' });
    }
  } catch (error) {
    console.error('Set primary wallet error:', error);
    res.status(500).json({ error: 'Failed to set primary wallet' });
  }
});

// Remove wallet
router.delete('/remove-wallet/:walletId', (req, res) => {
  try {
    const { walletId } = req.params;
    const walletIndex = tempWallets.findIndex(w => w.id === parseInt(walletId));
    
    if (walletIndex !== -1) {
      tempWallets.splice(walletIndex, 1);
      console.log('[TEMP] Wallet removed:', walletId);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Wallet not found' });
    }
  } catch (error) {
    console.error('Remove wallet error:', error);
    res.status(500).json({ error: 'Failed to remove wallet' });
  }
});

// Swap routes
router.post('/swap/quote', (req, res) => {
  try {
    const { fromToken, toToken, amount } = req.body;
    
    // Mock swap quote
    const rate = fromToken === 'ETH' ? 3000 : 0.0003; // ETH/HKT rate
    const outputAmount = fromToken === 'ETH' ? amount * rate : amount / rate;
    
    res.json({
      inputAmount: amount,
      outputAmount,
      rate,
      slippage: 0.5,
      fees: amount * 0.003, // 0.3% fee
      route: [fromToken, toToken]
    });
  } catch (error) {
    console.error('Swap quote error:', error);
    res.status(500).json({ error: 'Failed to get swap quote' });
  }
});

router.post('/swap/execute', (req, res) => {
  try {
    const { fromToken, toToken, amount, slippage } = req.body;
    
    // Mock swap execution
    const transactionHash = `0x${Math.random().toString(16).substring(2)}`;
    
    console.log('[TEMP] Swap executed:', { fromToken, toToken, amount, transactionHash });
    
    res.json({
      success: true,
      transactionHash,
      status: 'completed'
    });
  } catch (error) {
    console.error('Swap execution error:', error);
    res.status(500).json({ error: 'Failed to execute swap' });
  }
});

export default router;
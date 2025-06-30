import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  RefreshCw, 
  Clock, 
  Users,
  Activity,
  BarChart3,
  Zap,
  Shield
} from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function SecondaryMarket() {
  useScrollToTop();
  
  const [orderType, setOrderType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const currentPrice = 0.178;
  const priceChange = 0.012;
  const priceChangePercent = 7.2;
  const volume24h = 245670;
  const marketCap = 23156000;

  const priceHistory = [
    { time: '00:00', price: 0.166, volume: 12400 },
    { time: '04:00', price: 0.172, volume: 15600 },
    { time: '08:00', price: 0.169, volume: 18900 },
    { time: '12:00', price: 0.175, volume: 22100 },
    { time: '16:00', price: 0.181, volume: 19800 },
    { time: '20:00', price: 0.178, volume: 16700 },
  ];

  const orderBook = {
    bids: [
      { price: 0.177, amount: 15420, total: 2729.34 },
      { price: 0.176, amount: 8950, total: 1575.20 },
      { price: 0.175, amount: 12300, total: 2152.50 },
      { price: 0.174, amount: 6750, total: 1174.50 },
      { price: 0.173, amount: 9200, total: 1591.60 },
    ],
    asks: [
      { price: 0.179, amount: 11200, total: 2004.80 },
      { price: 0.180, amount: 7800, total: 1404.00 },
      { price: 0.181, amount: 13500, total: 2443.50 },
      { price: 0.182, amount: 5600, total: 1019.20 },
      { price: 0.183, amount: 8900, total: 1628.70 },
    ]
  };

  const recentTrades = [
    { time: '15:42:33', price: 0.178, amount: 1250, type: 'buy' },
    { time: '15:41:15', price: 0.177, amount: 800, type: 'sell' },
    { time: '15:40:22', price: 0.178, amount: 2100, type: 'buy' },
    { time: '15:39:45', price: 0.177, amount: 950, type: 'sell' },
    { time: '15:38:12', price: 0.179, amount: 1500, type: 'buy' },
    { time: '15:37:33', price: 0.178, amount: 750, type: 'sell' },
  ];

  const myOpenOrders = [
    { id: 1, type: 'buy', amount: 5000, price: 0.175, filled: 0, status: 'open', date: '2024-06-21 14:30' },
    { id: 2, type: 'sell', amount: 2500, price: 0.185, filled: 0, status: 'open', date: '2024-06-21 12:15' },
    { id: 3, type: 'buy', amount: 1000, price: 0.170, filled: 650, status: 'partial', date: '2024-06-20 16:45' },
  ];

  const liquidityPools = [
    { pair: 'HKT/USDC', tvl: 1250000, apy: 12.5, volume24h: 89400, fee: 0.3 },
    { pair: 'HKT/ETH', tvl: 890000, apy: 15.2, volume24h: 65200, fee: 0.3 },
    { pair: 'HKT/BTC', tvl: 456000, apy: 8.9, volume24h: 34100, fee: 0.3 },
  ];

  const handlePlaceOrder = () => {
    // Handle order placement
    console.log('Placing order:', { orderType, amount, price });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">HKT Secondary Market</h1>
              <p className="text-gray-600 dark:text-gray-300">Trade HKT tokens with other investors</p>
            </div>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              Live Trading
            </Badge>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">HKT Price</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${currentPrice.toFixed(4)}
                  </p>
                  <p className={`text-sm ${priceChangePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}% (+${priceChange.toFixed(4)})
                  </p>
                </div>
                {priceChangePercent >= 0 ? 
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" /> :
                  <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">24h Volume</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {volume24h.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">HKT tokens</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Market Cap</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${(marketCap / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Circulating supply</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Traders</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    1,247
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last 24h</p>
                </div>
                <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Price Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  HKT/USD Price Chart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="time" />
                      <YAxis domain={['dataMin - 0.001', 'dataMax + 0.001']} />
                      <Tooltip formatter={(value, name) => [name === 'price' ? `$${value}` : value, name]} />
                      <Area type="monotone" dataKey="price" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Book */}
          <Card>
            <CardHeader>
              <CardTitle>Order Book</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Asks (Sell Orders)</div>
                  <div className="space-y-1">
                    {orderBook.asks.reverse().map((ask, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-red-600 dark:text-red-400">${ask.price.toFixed(3)}</span>
                        <span>{ask.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-b py-2">
                  <div className="text-center font-bold text-lg">
                    ${currentPrice.toFixed(4)}
                  </div>
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    Current Price
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Bids (Buy Orders)</div>
                  <div className="space-y-1">
                    {orderBook.bids.map((bid, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-green-600 dark:text-green-400">${bid.price.toFixed(3)}</span>
                        <span>{bid.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Place Order */}
          <Card>
            <CardHeader>
              <CardTitle>Place Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Tabs value={orderType} onValueChange={setOrderType}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy">Buy HKT</TabsTrigger>
                    <TabsTrigger value="sell">Sell HKT</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div>
                  <label className="text-sm font-medium">Amount (HKT)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Price (USD)</label>
                  <Input
                    type="number"
                    placeholder="0.0000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.0001"
                  />
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total: ${(parseFloat(amount || '0') * parseFloat(price || '0')).toFixed(2)}
                </div>
                
                <Button 
                  className={`w-full ${orderType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  onClick={handlePlaceOrder}
                  disabled={!amount || !price}
                >
                  {orderType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="trades" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trades">Recent Trades</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidity Pools</TabsTrigger>
            <TabsTrigger value="analytics">Market Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="trades">
            <Card>
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b pb-2">
                    <span>Time</span>
                    <span>Price</span>
                    <span>Amount</span>
                    <span>Type</span>
                  </div>
                  {recentTrades.map((trade, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                      <span className="text-gray-500 dark:text-gray-400">{trade.time}</span>
                      <span className={trade.type === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        ${trade.price.toFixed(4)}
                      </span>
                      <span>{trade.amount.toLocaleString()}</span>
                      <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'}>
                        {trade.type.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Open Orders</CardTitle>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myOpenOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={order.type === 'buy' ? 'default' : 'destructive'}>
                            {order.type.toUpperCase()}
                          </Badge>
                          <Badge variant={order.status === 'open' ? 'secondary' : 'default'}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {order.amount.toLocaleString()} HKT @ ${order.price.toFixed(4)}
                        </div>
                        <div className="text-xs text-gray-400">{order.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          Filled: {order.filled.toLocaleString()} / {order.amount.toLocaleString()}
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="liquidity">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Liquidity Pools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {liquidityPools.map((pool, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="text-center space-y-4">
                            <h3 className="text-lg font-semibold">{pool.pair}</h3>
                            <div>
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {pool.apy}%
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">APY</div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>TVL:</span>
                                <span>${(pool.tvl / 1000000).toFixed(1)}M</span>
                              </div>
                              <div className="flex justify-between">
                                <span>24h Volume:</span>
                                <span>${(pool.volume24h / 1000).toFixed(0)}K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Fee:</span>
                                <span>{pool.fee}%</span>
                              </div>
                            </div>
                            <Button className="w-full">
                              <Shield className="h-4 w-4 mr-2" />
                              Add Liquidity
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trading Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="volume" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Market Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">24h High:</span>
                      <span className="font-semibold">$0.1847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">24h Low:</span>
                      <span className="font-semibold">$0.1652</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">All Time High:</span>
                      <span className="font-semibold">$0.2156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Total Supply:</span>
                      <span className="font-semibold">130M HKT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Circulating Supply:</span>
                      <span className="font-semibold">52.4M HKT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Market Cap Rank:</span>
                      <span className="font-semibold">#247</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
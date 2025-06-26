// In-memory cache for HKT price data when database is unavailable
interface HktPriceData {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  totalSupply: number;
  lastUpdated: Date;
}

class PriceCache {
  private cache: HktPriceData | null = null;
  private lastUpdateAttempt: Date = new Date(0);
  private updateInterval = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Initialize with default values
    this.cache = {
      price: 0.10,
      priceChange24h: 0,
      marketCap: 100000000,
      volume24h: 1000000,
      totalSupply: 1000000000,
      lastUpdated: new Date()
    };
  }

  updatePrice(data: Partial<HktPriceData>): void {
    if (this.cache) {
      this.cache = {
        ...this.cache,
        ...data,
        lastUpdated: new Date()
      };
    }
    this.lastUpdateAttempt = new Date();
  }

  getPrice(): HktPriceData | null {
    return this.cache;
  }

  shouldUpdate(): boolean {
    const now = new Date();
    const timeSinceLastAttempt = now.getTime() - this.lastUpdateAttempt.getTime();
    return timeSinceLastAttempt > this.updateInterval;
  }

  isStale(): boolean {
    if (!this.cache) return true;
    const now = new Date();
    const timeSinceUpdate = now.getTime() - this.cache.lastUpdated.getTime();
    return timeSinceUpdate > this.updateInterval;
  }
}

export const priceCache = new PriceCache();
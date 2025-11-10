// 交易服务 - 处理买卖逻辑
class TradingService {
  constructor(initialCash = 1000000) {
    this.initialCash = initialCash;
    this.reset();
  }

  reset() {
    this.cash = this.initialCash;
    this.holdings = 0; // 持仓数量
    this.transactions = []; // 交易记录
    this.dailyAssets = []; // 每日资产记录
  }

  // 买入
  buy(price, shares, date) {
    const cost = price * shares;
    if (cost > this.cash) {
      return {
        success: false,
        message: '资金不足'
      };
    }

    this.cash -= cost;
    this.holdings += shares;

    this.transactions.push({
      type: 'buy',
      date,
      price,
      shares,
      amount: cost,
      cash: this.cash,
      holdings: this.holdings
    });

    return {
      success: true,
      message: `买入成功：${shares}股 @ ¥${price.toFixed(2)}`
    };
  }

  // 卖出
  sell(price, shares, date) {
    if (shares > this.holdings) {
      return {
        success: false,
        message: '持仓不足'
      };
    }

    const revenue = price * shares;
    this.cash += revenue;
    this.holdings -= shares;

    this.transactions.push({
      type: 'sell',
      date,
      price,
      shares,
      amount: revenue,
      cash: this.cash,
      holdings: this.holdings
    });

    return {
      success: true,
      message: `卖出成功：${shares}股 @ ¥${price.toFixed(2)}`
    };
  }

  // 记录每日资产
  recordDailyAsset(date, currentPrice) {
    const marketValue = this.holdings * currentPrice;
    const totalAsset = this.cash + marketValue;

    this.dailyAssets.push({
      date,
      cash: this.cash,
      holdings: this.holdings,
      currentPrice,
      marketValue,
      totalAsset,
      profit: totalAsset - this.initialCash,
      profitRate: ((totalAsset - this.initialCash) / this.initialCash * 100).toFixed(2)
    });
  }

  // 获取当前总资产
  getTotalAsset(currentPrice) {
    return this.cash + this.holdings * currentPrice;
  }

  // 获取收益率
  getProfitRate(currentPrice) {
    const totalAsset = this.getTotalAsset(currentPrice);
    return ((totalAsset - this.initialCash) / this.initialCash * 100).toFixed(2);
  }

  // 获取统计信息
  getStatistics(currentPrice) {
    const totalAsset = this.getTotalAsset(currentPrice);
    const profit = totalAsset - this.initialCash;
    const profitRate = this.getProfitRate(currentPrice);

    const buyCount = this.transactions.filter(t => t.type === 'buy').length;
    const sellCount = this.transactions.filter(t => t.type === 'sell').length;

    return {
      initialCash: this.initialCash,
      currentCash: this.cash,
      holdings: this.holdings,
      marketValue: this.holdings * currentPrice,
      totalAsset,
      profit,
      profitRate,
      transactionCount: this.transactions.length,
      buyCount,
      sellCount
    };
  }

  // 获取交易记录
  getTransactions() {
    return [...this.transactions];
  }

  // 获取每日资产记录
  getDailyAssets() {
    return [...this.dailyAssets];
  }

  // 保存到localStorage
  save() {
    const data = {
      cash: this.cash,
      holdings: this.holdings,
      transactions: this.transactions,
      dailyAssets: this.dailyAssets,
      initialCash: this.initialCash
    };
    localStorage.setItem('tradingData', JSON.stringify(data));
  }

  // 从localStorage加载
  load() {
    const data = localStorage.getItem('tradingData');
    if (data) {
      const parsed = JSON.parse(data);
      this.cash = parsed.cash;
      this.holdings = parsed.holdings;
      this.transactions = parsed.transactions;
      this.dailyAssets = parsed.dailyAssets;
      this.initialCash = parsed.initialCash;
      return true;
    }
    return false;
  }
}

export default TradingService;

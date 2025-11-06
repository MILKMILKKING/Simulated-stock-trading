import React, { useState, useEffect } from 'react';
import KLineChart from './components/KLineChart';
import AccountInfo from './components/AccountInfo';
import TradingPanel from './components/TradingPanel';
import ReviewModal from './components/ReviewModal';
import TradingService from './services/tradingService';
import { getRandomStock } from './services/stockAPI';

function App() {
  const [tradingService] = useState(() => new TradingService(1000000));
  const [stockData, setStockData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(5);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [gameStatus, setGameStatus] = useState('ready'); // ready, playing, finished

  // 初始化游戏
  const initGame = () => {
    const stock = getRandomStock();
    setStockData(stock);
    setCurrentIndex(stock.currentIndex);
    tradingService.reset();
    setGameStatus('playing');

    // 记录初始几天的资产
    for (let i = 0; i <= stock.currentIndex; i++) {
      const dayData = stock.data[i];
      tradingService.recordDailyAsset(dayData.date, dayData.close);
    }
  };

  useEffect(() => {
    initGame();
  }, []);

  // 获取当前显示的数据
  const getCurrentData = () => {
    if (!stockData) return [];
    return stockData.data.slice(0, currentIndex + 1);
  };

  const getCurrentPrice = () => {
    if (!stockData || currentIndex >= stockData.data.length) return 0;
    return stockData.data[currentIndex].close;
  };

  // 下一天
  const handleNext = () => {
    if (!stockData || currentIndex >= stockData.data.length - 1) {
      setGameStatus('finished');
      setIsReviewOpen(true);
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    // 记录当天资产
    const dayData = stockData.data[nextIndex];
    tradingService.recordDailyAsset(dayData.date, dayData.close);
    tradingService.save();
  };

  // 买入
  const handleBuy = (shares) => {
    const currentPrice = getCurrentPrice();
    const currentDate = stockData.data[currentIndex].date;
    const result = tradingService.buy(currentPrice, shares, currentDate);
    tradingService.save();
    return result;
  };

  // 卖出
  const handleSell = (shares) => {
    const currentPrice = getCurrentPrice();
    const currentDate = stockData.data[currentIndex].date;
    const result = tradingService.sell(currentPrice, shares, currentDate);
    tradingService.save();
    return result;
  };

  // 重新开始
  const handleRestart = () => {
    setIsReviewOpen(false);
    initGame();
  };

  const currentPrice = getCurrentPrice();
  const statistics = tradingService.getStatistics(currentPrice);

  if (!stockData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  const isGameFinished = gameStatus === 'finished';
  const progress = ((currentIndex + 1) / stockData.data.length * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* 头部 */}
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              模拟股票交易系统
            </h1>
            <p className="text-slate-400">
              通过K线分析训练交易能力
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsReviewOpen(true)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded transition"
            >
              查看复盘
            </button>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded transition"
            >
              重新开始
            </button>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mt-4 bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-slate-400">
            第 {currentIndex + 1} / {stockData.data.length} 天
          </span>
          <span className="text-slate-400">
            进度: {progress}%
          </span>
        </div>

        {isGameFinished && (
          <div className="mt-4 bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-xl">🎉</span>
              <span className="text-yellow-300 font-medium">
                交易已结束！查看复盘了解你的交易表现。
              </span>
            </div>
          </div>
        )}
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* K线图 */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-white">
                {stockData.name} ({stockData.code})
              </h2>
              <KLineChart
                data={getCurrentData()}
                transactions={tradingService.getTransactions()}
              />
            </div>
          </div>

          {/* 右侧面板 */}
          <div className="space-y-6">
            <AccountInfo
              statistics={statistics}
              stockName={stockData.name}
              currentPrice={currentPrice}
            />

            <TradingPanel
              currentPrice={currentPrice}
              cash={statistics.currentCash}
              holdings={statistics.holdings}
              onBuy={handleBuy}
              onSell={handleSell}
              onNext={handleNext}
            />
          </div>
        </div>
      </main>

      {/* 复盘弹窗 */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        statistics={statistics}
        transactions={tradingService.getTransactions()}
        dailyAssets={tradingService.getDailyAssets()}
      />

      {/* 页脚 */}
      <footer className="max-w-7xl mx-auto mt-12 text-center text-slate-500 text-sm">
        <p>© 2024 模拟股票交易系统 | 仅供学习交流使用</p>
      </footer>
    </div>
  );
}

export default App;

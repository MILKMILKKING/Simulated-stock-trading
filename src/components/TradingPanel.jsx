import React, { useState } from 'react';

const TradingPanel = ({
  currentPrice,
  cash,
  holdings,
  onBuy,
  onSell,
  onNext
}) => {
  const [buyShares, setBuyShares] = useState('');
  const [sellShares, setSellShares] = useState('');
  const [message, setMessage] = useState('');

  const maxBuyShares = Math.floor(cash / currentPrice);
  const maxSellShares = holdings;

  const handleBuy = () => {
    const shares = parseInt(buyShares);
    if (!shares || shares <= 0) {
      showMessage('请输入有效的买入数量', 'error');
      return;
    }
    if (shares > maxBuyShares) {
      showMessage('资金不足', 'error');
      return;
    }

    const result = onBuy(shares);
    showMessage(result.message, result.success ? 'success' : 'error');
    if (result.success) {
      setBuyShares('');
    }
  };

  const handleSell = () => {
    const shares = parseInt(sellShares);
    if (!shares || shares <= 0) {
      showMessage('请输入有效的卖出数量', 'error');
      return;
    }
    if (shares > maxSellShares) {
      showMessage('持仓不足', 'error');
      return;
    }

    const result = onSell(shares);
    showMessage(result.message, result.success ? 'success' : 'error');
    if (result.success) {
      setSellShares('');
    }
  };

  const showMessage = (msg, type) => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const quickBuy = (percentage) => {
    const shares = Math.floor(maxBuyShares * percentage);
    setBuyShares(shares.toString());
  };

  const quickSell = (percentage) => {
    const shares = Math.floor(maxSellShares * percentage);
    setSellShares(shares.toString());
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-white">交易操作</h2>

      {/* 消息提示 */}
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success'
            ? 'bg-green-900/50 text-green-300 border border-green-700'
            : 'bg-red-900/50 text-red-300 border border-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* 买入区域 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-slate-300 font-medium">买入</label>
          <span className="text-sm text-slate-400">
            最多可买：{maxBuyShares.toLocaleString()} 股
          </span>
        </div>

        <div className="flex gap-2 mb-2">
          <input
            type="number"
            value={buyShares}
            onChange={(e) => setBuyShares(e.target.value)}
            placeholder="输入买入数量"
            className="flex-1 bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-stock-green"
          />
          <button
            onClick={handleBuy}
            disabled={!currentPrice}
            className="px-6 py-2 bg-stock-green hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded transition"
          >
            买入
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => quickBuy(0.25)} className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded">
            1/4
          </button>
          <button onClick={() => quickBuy(0.5)} className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded">
            1/2
          </button>
          <button onClick={() => quickBuy(0.75)} className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded">
            3/4
          </button>
          <button onClick={() => quickBuy(1)} className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded">
            全部
          </button>
        </div>
      </div>

      {/* 卖出区域 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-slate-300 font-medium">卖出</label>
          <span className="text-sm text-slate-400">
            持仓：{maxSellShares.toLocaleString()} 股
          </span>
        </div>

        <div className="flex gap-2 mb-2">
          <input
            type="number"
            value={sellShares}
            onChange={(e) => setSellShares(e.target.value)}
            placeholder="输入卖出数量"
            className="flex-1 bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-stock-red"
          />
          <button
            onClick={handleSell}
            disabled={!currentPrice || holdings === 0}
            className="px-6 py-2 bg-stock-red hover:bg-red-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded transition"
          >
            卖出
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => quickSell(0.25)} className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded">
            1/4
          </button>
          <button onClick={() => quickSell(0.5)} className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded">
            1/2
          </button>
          <button onClick={() => quickSell(0.75)} className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded">
            3/4
          </button>
          <button onClick={() => quickSell(1)} className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded">
            全部
          </button>
        </div>
      </div>

      {/* 下一天按钮 */}
      <div className="border-t border-slate-700 pt-4">
        <button
          onClick={onNext}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition text-lg"
        >
          下一天 →
        </button>
      </div>
    </div>
  );
};

export default TradingPanel;

import React from 'react';

const AccountInfo = ({ statistics, stockName, currentPrice }) => {
  const {
    currentCash,
    holdings,
    marketValue,
    totalAsset,
    profit,
    profitRate
  } = statistics;

  const isProfit = profit >= 0;

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-white">账户信息</h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">当前股票</span>
          <span className="text-white font-medium">{stockName}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">当前价格</span>
          <span className="text-white font-bold text-lg">
            ¥{currentPrice?.toFixed(2) || '0.00'}
          </span>
        </div>

        <div className="border-t border-slate-700 pt-3 mt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400">可用资金</span>
            <span className="text-white">
              ¥{currentCash.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400">持仓数量</span>
            <span className="text-white">{holdings.toLocaleString()} 股</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">持仓市值</span>
            <span className="text-white">
              ¥{marketValue.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-3 mt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400">总资产</span>
            <span className="text-white font-bold text-lg">
              ¥{totalAsset.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">盈亏</span>
            <div className="text-right">
              <div className={`font-bold ${isProfit ? 'text-stock-green' : 'text-stock-red'}`}>
                {isProfit ? '+' : ''}¥{profit.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
              </div>
              <div className={`text-sm ${isProfit ? 'text-stock-green' : 'text-stock-red'}`}>
                {isProfit ? '+' : ''}{profitRate}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;

import React from 'react';

const ReviewModal = ({ isOpen, onClose, statistics, transactions, dailyAssets }) => {
  if (!isOpen) return null;

  const {
    initialCash,
    totalAsset,
    profit,
    profitRate,
    transactionCount,
    buyCount,
    sellCount
  } = statistics;

  const isProfit = profit >= 0;

  // 计算一些额外的统计指标
  const avgBuyPrice = transactions
    .filter(t => t.type === 'buy')
    .reduce((sum, t) => sum + t.price * t.shares, 0) /
    transactions.filter(t => t.type === 'buy').reduce((sum, t) => sum + t.shares, 0) || 0;

  const avgSellPrice = transactions
    .filter(t => t.type === 'sell')
    .reduce((sum, t) => sum + t.price * t.shares, 0) /
    transactions.filter(t => t.type === 'sell').reduce((sum, t) => sum + t.shares, 0) || 0;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 标题 */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">交易复盘</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* 总览 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">交易总览</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700 rounded p-4">
                <div className="text-slate-400 text-sm mb-1">初始资金</div>
                <div className="text-white font-bold text-lg">
                  ¥{initialCash.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-700 rounded p-4">
                <div className="text-slate-400 text-sm mb-1">最终资产</div>
                <div className="text-white font-bold text-lg">
                  ¥{totalAsset.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-slate-700 rounded p-4">
                <div className="text-slate-400 text-sm mb-1">盈亏金额</div>
                <div className={`font-bold text-lg ${isProfit ? 'text-stock-green' : 'text-stock-red'}`}>
                  {isProfit ? '+' : ''}¥{profit.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-slate-700 rounded p-4">
                <div className="text-slate-400 text-sm mb-1">收益率</div>
                <div className={`font-bold text-lg ${isProfit ? 'text-stock-green' : 'text-stock-red'}`}>
                  {isProfit ? '+' : ''}{profitRate}%
                </div>
              </div>
            </div>
          </div>

          {/* 交易统计 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">交易统计</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-slate-700 rounded p-4">
                <div className="text-slate-400 text-sm mb-1">总交易次数</div>
                <div className="text-white font-bold text-lg">{transactionCount}</div>
              </div>
              <div className="bg-slate-700 rounded p-4">
                <div className="text-slate-400 text-sm mb-1">买入次数</div>
                <div className="text-stock-green font-bold text-lg">{buyCount}</div>
              </div>
              <div className="bg-slate-700 rounded p-4">
                <div className="text-slate-400 text-sm mb-1">卖出次数</div>
                <div className="text-stock-red font-bold text-lg">{sellCount}</div>
              </div>
              <div className="bg-slate-700 rounded p-4">
                <div className="text-slate-400 text-sm mb-1">平均买入价</div>
                <div className="text-white font-bold text-lg">
                  {avgBuyPrice > 0 ? `¥${avgBuyPrice.toFixed(2)}` : '-'}
                </div>
              </div>
              <div className="bg-slate-700 rounded p-4">
                <div className="text-slate-400 text-sm mb-1">平均卖出价</div>
                <div className="text-white font-bold text-lg">
                  {avgSellPrice > 0 ? `¥${avgSellPrice.toFixed(2)}` : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* 交易记录 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">交易记录</h3>
            <div className="bg-slate-700 rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-300 text-sm font-medium">日期</th>
                      <th className="px-4 py-3 text-left text-slate-300 text-sm font-medium">类型</th>
                      <th className="px-4 py-3 text-right text-slate-300 text-sm font-medium">价格</th>
                      <th className="px-4 py-3 text-right text-slate-300 text-sm font-medium">数量</th>
                      <th className="px-4 py-3 text-right text-slate-300 text-sm font-medium">金额</th>
                      <th className="px-4 py-3 text-right text-slate-300 text-sm font-medium">持仓</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-600">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                          暂无交易记录
                        </td>
                      </tr>
                    ) : (
                      transactions.map((t, index) => (
                        <tr key={index} className="hover:bg-slate-600/50">
                          <td className="px-4 py-3 text-slate-300 text-sm">{t.date}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              t.type === 'buy'
                                ? 'bg-green-900/50 text-stock-green'
                                : 'bg-red-900/50 text-stock-red'
                            }`}>
                              {t.type === 'buy' ? '买入' : '卖出'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-300 text-sm">
                            ¥{t.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-300 text-sm">
                            {t.shares.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-300 text-sm">
                            ¥{t.amount.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-300 text-sm">
                            {t.holdings.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 资产曲线 */}
          {dailyAssets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">资产变化</h3>
              <div className="bg-slate-700 rounded p-4 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-600">
                    <tr>
                      <th className="px-4 py-2 text-left text-slate-300 text-sm">日期</th>
                      <th className="px-4 py-2 text-right text-slate-300 text-sm">总资产</th>
                      <th className="px-4 py-2 text-right text-slate-300 text-sm">盈亏</th>
                      <th className="px-4 py-2 text-right text-slate-300 text-sm">收益率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-600">
                    {dailyAssets.slice(-10).map((day, index) => (
                      <tr key={index} className="hover:bg-slate-600/50">
                        <td className="px-4 py-2 text-slate-300 text-sm">{day.date}</td>
                        <td className="px-4 py-2 text-right text-slate-300 text-sm">
                          ¥{day.totalAsset.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
                        </td>
                        <td className={`px-4 py-2 text-right text-sm ${
                          day.profit >= 0 ? 'text-stock-green' : 'text-stock-red'
                        }`}>
                          {day.profit >= 0 ? '+' : ''}¥{day.profit.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
                        </td>
                        <td className={`px-4 py-2 text-right text-sm ${
                          day.profitRate >= 0 ? 'text-stock-green' : 'text-stock-red'
                        }`}>
                          {day.profitRate >= 0 ? '+' : ''}{day.profitRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

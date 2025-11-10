import axios from 'axios';

// A股股票代码列表（示例）
const A_STOCKS = [
  { code: '000001.SS', name: '上证指数' },
  { code: '600519.SS', name: '贵州茅台' },
  { code: '000858.SZ', name: '五粮液' },
  { code: '601318.SS', name: '中国平安' },
  { code: '600036.SS', name: '招商银行' },
  { code: '000333.SZ', name: '美的集团' },
  { code: '002475.SZ', name: '立讯精密' },
  { code: '300750.SZ', name: '宁德时代' },
];

// 生成模拟K线数据
function generateMockKLineData(days = 100) {
  const data = [];
  let basePrice = 50 + Math.random() * 100;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // 跳过周末
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }

    const change = (Math.random() - 0.5) * basePrice * 0.08;
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.05);
    const low = Math.min(open, close) * (1 - Math.random() * 0.05);
    const volume = Math.floor(10000000 + Math.random() * 50000000);

    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      volume
    });

    basePrice = close;
  }

  return data;
}

// 随机选择股票和时间区间
export function getRandomStock() {
  const stock = A_STOCKS[Math.floor(Math.random() * A_STOCKS.length)];
  const allData = generateMockKLineData(200);

  // 随机选择一个起始点，确保至少有30天数据
  const minDays = 30;
  const maxDays = 100;
  const days = minDays + Math.floor(Math.random() * (maxDays - minDays));
  const startIndex = Math.floor(Math.random() * (allData.length - days));
  const data = allData.slice(startIndex, startIndex + days);

  return {
    ...stock,
    data,
    currentIndex: 5 // 初始显示前5天
  };
}

// 获取Yahoo Finance数据（备用方案）
export async function fetchYahooFinanceData(symbol, startDate, endDate) {
  try {
    // 注意：由于CORS限制，浏览器直接调用可能失败
    // 这里提供代码结构，实际使用需要代理服务器
    const period1 = Math.floor(new Date(startDate).getTime() / 1000);
    const period2 = Math.floor(new Date(endDate).getTime() / 1000);

    const url = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${period1}&period2=${period2}&interval=1d&events=history`;

    const response = await axios.get(url);
    // 解析CSV数据
    const lines = response.data.split('\n');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(',');
      if (line.length >= 6) {
        data.push({
          date: line[0],
          open: parseFloat(line[1]),
          high: parseFloat(line[2]),
          low: parseFloat(line[3]),
          close: parseFloat(line[4]),
          volume: parseInt(line[6])
        });
      }
    }

    return data;
  } catch (error) {
    console.error('获取Yahoo Finance数据失败:', error);
    return null;
  }
}

export { A_STOCKS };

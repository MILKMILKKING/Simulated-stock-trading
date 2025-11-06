import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const KLineChart = ({ data, transactions = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 准备数据
    const dates = data.map(item => item.date);
    const klineData = data.map(item => [item.open, item.close, item.low, item.high]);
    const volumes = data.map(item => item.volume);

    // 标记买卖点
    const buyPoints = [];
    const sellPoints = [];

    transactions.forEach(t => {
      const index = dates.indexOf(t.date);
      if (index !== -1) {
        const point = {
          name: t.type === 'buy' ? '买' : '卖',
          coord: [t.date, t.price],
          value: t.shares,
          itemStyle: {
            color: t.type === 'buy' ? '#22c55e' : '#ef4444'
          }
        };

        if (t.type === 'buy') {
          buyPoints.push(point);
        } else {
          sellPoints.push(point);
        }
      }
    });

    const option = {
      backgroundColor: 'transparent',
      animation: true,
      legend: {
        data: ['K线', '成交量'],
        textStyle: {
          color: '#e2e8f0'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: '#334155',
        textStyle: {
          color: '#e2e8f0'
        },
        formatter: function (params) {
          const dataIndex = params[0].dataIndex;
          const kline = data[dataIndex];
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">${kline.date}</div>
              <div>开盘：${kline.open.toFixed(2)}</div>
              <div>收盘：${kline.close.toFixed(2)}</div>
              <div>最高：${kline.high.toFixed(2)}</div>
              <div>最低：${kline.low.toFixed(2)}</div>
              <div>成交量：${(kline.volume / 10000).toFixed(2)}万</div>
              ${params[0].value > params[1].value
                ? '<div style="color: #ef4444;">跌 ' + ((params[0].value - params[1].value) / params[0].value * 100).toFixed(2) + '%</div>'
                : '<div style="color: #22c55e;">涨 ' + ((params[1].value - params[0].value) / params[0].value * 100).toFixed(2) + '%</div>'
              }
            </div>
          `;
        }
      },
      grid: [
        {
          left: '10%',
          right: '8%',
          top: '10%',
          height: '55%'
        },
        {
          left: '10%',
          right: '8%',
          top: '70%',
          height: '18%'
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: dates,
          scale: true,
          boundaryGap: true,
          axisLine: {
            lineStyle: { color: '#475569' }
          },
          axisLabel: {
            color: '#94a3b8',
            formatter: function(value) {
              return value.substring(5);
            }
          },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        },
        {
          type: 'category',
          gridIndex: 1,
          data: dates,
          scale: true,
          boundaryGap: true,
          axisLine: { lineStyle: { color: '#475569' } },
          axisLabel: { show: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        }
      ],
      yAxis: [
        {
          scale: true,
          axisLine: { lineStyle: { color: '#475569' } },
          axisLabel: { color: '#94a3b8' },
          splitLine: {
            lineStyle: { color: '#1e293b' }
          }
        },
        {
          scale: true,
          gridIndex: 1,
          axisLine: { lineStyle: { color: '#475569' } },
          axisLabel: { show: false },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 0,
          end: 100
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          top: '90%',
          start: 0,
          end: 100,
          backgroundColor: '#1e293b',
          borderColor: '#475569',
          fillerColor: 'rgba(100, 116, 139, 0.3)',
          textStyle: {
            color: '#94a3b8'
          }
        }
      ],
      series: [
        {
          name: 'K线',
          type: 'candlestick',
          data: klineData,
          itemStyle: {
            color: '#ef4444',
            color0: '#22c55e',
            borderColor: '#ef4444',
            borderColor0: '#22c55e'
          },
          markPoint: {
            label: {
              formatter: function(param) {
                return param.name + '\n' + param.value + '股';
              }
            },
            data: [...buyPoints, ...sellPoints]
          }
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes,
          itemStyle: {
            color: function(params) {
              const index = params.dataIndex;
              if (index === 0) return '#64748b';
              return klineData[index][1] >= klineData[index][0] ? '#ef4444' : '#22c55e';
            }
          }
        }
      ]
    };

    chartInstance.current.setOption(option, true);

    // 响应式调整
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, transactions]);

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: '100%', minHeight: '500px' }}
    />
  );
};

export default KLineChart;

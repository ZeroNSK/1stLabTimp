import React from 'react';
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

const statusMap = {
  'Завершено': 1,
  'В процессе': 2,
  'Обнаружены нарушения': 3,
};

const severityMap = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

const xTickMap = {
  1: 'Завершено',
  2: 'В процессе',
  3: 'Обнаружены нарушения',
};

const yTickMap = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Critical',
};

function buildChartData(items) {
  const grouped = {};

  items.forEach((item) => {
    const baseX = statusMap[item.status] || 0;
    const y = severityMap[item.severity] || 0;
    const key = `${baseX}-${y}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push({
      id: item.id,
      title: item.title,
      object: item.object,
      status: item.status,
      severity: item.severity,
      baseX,
      y,
      z: 120,
    });
  });

  const result = [];

  Object.values(grouped).forEach((points) => {
    const step = 0.12;
    const middle = (points.length - 1) / 2;

    points.forEach((point, index) => {
      result.push({
        ...point,
        x: point.baseX + (index - middle) * step,
      });
    });
  });

  return result;
}

function buildLineData(chartData) {
  return chartData.flatMap((point) => [
    { x: point.x, y: 0, pointId: `${point.id}-start` },
    { x: point.x, y: point.y, pointId: `${point.id}-end` },
    { x: null, y: null, pointId: `${point.id}-break` },
  ]);
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #d9dfe7',
        borderRadius: '8px',
        padding: '10px 12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div><b>{data.title}</b></div>
      <div>Объект: {data.object}</div>
      <div>Статус: {data.status}</div>
      <div>Критичность: {data.severity}</div>
    </div>
  );
};

const DotShape = ({ cx, cy }) => {
  if (typeof cx !== 'number' || typeof cy !== 'number') {
    return null;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill="#0077cc"
      stroke="#ffffff"
      strokeWidth={2}
    />
  );
};

const ItemsStatusSeverityChart = ({ items }) => {
  const chartData = buildChartData(items);
  const lineData = buildLineData(chartData);

  if (!items.length) {
    return (
      <div className="chart-card">
        <h2>График узлов</h2>
        <p>Нет данных для построения графика.</p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h2>График узлов</h2>
      <p className="chart-subtitle">
        По X показан статус, по Y показана критичность.
      </p>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={380}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 55 }}>
            <CartesianGrid strokeDasharray="4 4" />

            <XAxis
              type="number"
              dataKey="x"
              domain={[0.5, 3.5]}
              ticks={[1, 2, 3]}
              tickFormatter={(value) => xTickMap[value] || ''}
              allowDecimals={false}
              label={{
                value: 'Статус',
                position: 'bottom',
                offset: 12,
              }}
            />

            <YAxis
              type="number"
              dataKey="y"
              domain={[0.5, 4.5]}
              ticks={[1, 2, 3, 4]}
              tickFormatter={(value) => yTickMap[value] || ''}
              allowDecimals={false}
              width={90}
              label={{
                value: 'Критичность',
                angle: -90,
                position: 'insideLeft',
                offset: -28,
                style: { textAnchor: 'middle' },
              }}
            />

            <ZAxis type="number" dataKey="z" range={[120, 120]} />

            <Line
              type="linear"
              data={lineData}
              dataKey="y"
              stroke="#0077cc"
              strokeOpacity={0.35}
              strokeWidth={2}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              connectNulls={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Scatter
              data={chartData}
              shape={<DotShape />}
              isAnimationActive={false}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ItemsStatusSeverityChart;
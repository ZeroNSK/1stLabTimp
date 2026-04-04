import React from 'react';
import {
  CartesianGrid,
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
  return items.map((item, index) => ({
    id: item.id,
    title: item.title,
    object: item.object,
    status: item.status,
    severity: item.severity,
    x: statusMap[item.status] || 0,
    y: severityMap[item.severity] || 0,
    z: 120,
    index,
  }));
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

const RayDot = (props) => {
  const { cx, cy, payload } = props;

  if (typeof cx !== 'number' || typeof cy !== 'number') {
    return null;
  }

  const bottomY = 300;

  return (
    <g>
      <line
        x1={cx}
        y1={bottomY}
        x2={cx}
        y2={cy}
        stroke="#0077cc"
        strokeWidth="2"
        strokeOpacity="0.35"
      />
      <circle
        cx={cx}
        cy={cy}
        r="7"
        fill="#0077cc"
        stroke="#ffffff"
        strokeWidth="2"
      />
      <text
        x={cx}
        y={cy - 12}
        textAnchor="middle"
        fontSize="11"
        fill="#1f2d3d"
      >
        {payload.id}
      </text>
    </g>
  );
};

const ItemsStatusSeverityChart = ({ items }) => {
  const chartData = buildChartData(items);

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
        <ResponsiveContainer width="100%" height={360}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0.5, 3.5]}
              ticks={[1, 2, 3]}
              tickFormatter={(value) => xTickMap[value] || ''}
              label={{ value: 'Статус', position: 'bottom', offset: 15 }}
              allowDecimals={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0.5, 4.5]}
              ticks={[1, 2, 3, 4]}
              tickFormatter={(value) => yTickMap[value] || ''}
              label={{ value: 'Критичность', angle: -90, position: 'insideLeft' }}
              allowDecimals={false}
            />
            <ZAxis type="number" dataKey="z" range={[120, 120]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '4 4' }} />
            <Scatter data={chartData} shape={<RayDot />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ItemsStatusSeverityChart;
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const severityMap = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

const statusMap = {
  'Завершено': 1,
  'В процессе': 2,
  'Обнаружены нарушения': 4,
};

function buildChartData(items) {
  return items.map((item) => {
    const severityValue = severityMap[item.severity] || 0;
    const statusValue = statusMap[item.status] || 0;

    return {
      id: item.id,
      name: item.title,
      object: item.object,
      severity: item.severity,
      status: item.status,
      score: severityValue + statusValue,
    };
  });
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #d9dfe7',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div><b>{data.name}</b></div>
      <div>Объект: {data.object}</div>
      <div>Критичность: {data.severity}</div>
      <div>Статус: {data.status}</div>
      <div>Индекс риска: {data.score}</div>
    </div>
  );
};

const ItemsRadarChart = ({ items }) => {
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
        Чем длиннее луч, тем выше суммарный риск по критичности и статусу.
      </p>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={420}>
          <RadarChart data={chartData} outerRadius="72%">
            <PolarGrid />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 8]} tickCount={5} />
            <Radar
              name="Риск"
              dataKey="score"
              fill="#0077cc"
              fillOpacity={0.35}
              stroke="#0077cc"
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ItemsRadarChart;
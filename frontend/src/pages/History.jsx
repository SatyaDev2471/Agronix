import React, { useState } from 'react';
import { Spinner, Row, Col } from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistoryData } from '../hooks/useHistoryData';

const History = () => {
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = useState(200); // default 200 points
  const { data, loading, error } = useHistoryData(timeframe);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '1.5rem', color: '#174E32' }}>
        <Spinner animation="border" variant="success" />
        <p>Loading Historical IoT Data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '2rem', background: '#FEF2F2', borderLeft: '4px solid #EF4444', margin: '2rem', color: '#991B1B', borderRadius: '12px' }}>
        <p>{error || "Failed to load history"}</p>
      </div>
    );
  }

  const { channelInfo, analytics } = data;
  const rawFeeds = analytics?.rawFeeds || [];

  // Parse strings to floats for Recharts
  const chartData = rawFeeds.map(feed => ({
    date: feed.created_at,
    moisture: parseFloat(feed.field1),
    temperature: parseFloat(feed.field2),
    humidity: parseFloat(feed.field3),
    ph: parseFloat(feed.field5)
  })).filter(d => !isNaN(d.moisture) && !isNaN(d.temperature)); // Filter out nulls

  const renderChart = (dataKey, color, name, domain = ['auto', 'auto']) => (
    <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)', height: '300px', marginBottom: '1.5rem' }}>
      <h5 style={{ color: '#111827', fontWeight: 600, marginBottom: '1rem', fontSize: '1.1rem' }}>{name} History</h5>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#6B7280' }} 
            minTickGap={50}
            tickFormatter={(val) => {
              const d = new Date(val);
              return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
            }}
          />
          <YAxis 
            domain={domain}
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#6B7280' }} 
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
            labelFormatter={(val) => new Date(val).toLocaleString()}
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#color${dataKey})`} name={name} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#174E32', margin: 0 }}>{t('nav.history') || 'IoT Data History'}</h2>
          <p style={{ color: '#6B7280', margin: '0.5rem 0 0 0' }}>Channel: {channelInfo?.name || 'Smart Farm'} | Live feeds from ThingSpeak</p>
        </div>
        <select 
          value={timeframe} 
          onChange={(e) => setTimeframe(Number(e.target.value))}
          style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', fontWeight: 600, color: '#174E32', cursor: 'pointer' }}
        >
          <option value={100}>Last 100 Readings</option>
          <option value={200}>Last 200 Readings</option>
          <option value={500}>Last 500 Readings</option>
          <option value={1000}>Last 1000 Readings</option>
        </select>
      </div>
      
      <Row>
        <Col md={6}>
          {renderChart('moisture', '#3B82F6', 'Soil Moisture (%)', [0, 100])}
        </Col>
        <Col md={6}>
          {renderChart('temperature', '#EF4444', 'Temperature (°C)')}
        </Col>
        <Col md={6}>
          {renderChart('humidity', '#10B981', 'Humidity (%)', [0, 100])}
        </Col>
        <Col md={6}>
          {renderChart('ph', '#8B5CF6', 'Soil pH Level', [0, 14])}
        </Col>
      </Row>
    </div>
  );
};

export default History;

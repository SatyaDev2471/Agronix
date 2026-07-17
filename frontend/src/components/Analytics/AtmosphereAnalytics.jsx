import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styles from './MoistureTrends.module.css'; // Reusing layout CSS

const AtmosphereAnalytics = ({ rawFeeds }) => {
  const data = rawFeeds.map(feed => ({
    time: new Date(feed.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temperature: parseFloat(feed.field1) || 0,
    humidity: parseFloat(feed.field2) || 0
  }));

  return (
    <div className={`premium-card ${styles.chartCard}`}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Atmosphere Analytics</h3>
          <p className={styles.subtitle}>Temperature & Humidity correlation</p>
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              minTickGap={30}
            />
            <YAxis 
              yAxisId="left" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="temperature" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={false}
              name="Temperature (°C)" 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="humidity" 
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={false}
              name="Humidity (%)" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AtmosphereAnalytics;

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './MoistureTrends.module.css';

const MoistureTrends = ({ rawFeeds }) => {
  // Transform ThingSpeak data (field3 is moisture)
  const data = rawFeeds.map(feed => ({
    time: new Date(feed.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    moisture: parseFloat(feed.field3) || 0
  }));

  return (
    <div className={`premium-card ${styles.chartCard}`}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Soil Moisture Trend</h3>
          <p className={styles.subtitle}>24-hour historical feed</p>
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              dy={10} 
              minTickGap={30}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              domain={['dataMin - 5', 'dataMax + 5']}
              dx={-10}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }}
              itemStyle={{ color: '#3b82f6', fontWeight: 600 }}
            />
            <Area 
              type="monotone" 
              dataKey="moisture" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorMoisture)" 
              name="Moisture (%)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoistureTrends;

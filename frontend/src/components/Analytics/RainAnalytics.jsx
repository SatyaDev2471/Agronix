import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './RainAnalytics.module.css';

const RainAnalytics = ({ rawFeeds }) => {
  // Aggregate rain data per hour for the chart
  const rainData = [];
  let currentHour = -1;
  let rainSum = 0;

  rawFeeds.forEach(feed => {
    const date = new Date(feed.created_at);
    const hour = date.getHours();
    
    if (hour !== currentHour) {
      if (currentHour !== -1) {
        rainData.push({
          time: `${currentHour}:00`,
          rain: rainSum > 0 ? 1 : 0 // Simplified: 1 if it rained that hour
        });
      }
      currentHour = hour;
      rainSum = 0;
    }
    rainSum += parseInt(feed.field4 || "0");
  });

  return (
    <div className={`premium-card ${styles.rainCard}`}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Rainfall & Irrigation Impact</h3>
          <p className={styles.subtitle}>Historical precipitation events</p>
        </div>
        <div className={styles.statBadge}>
          Total Events: {rainData.filter(d => d.rain > 0).length}
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rainData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              minTickGap={20}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              domain={[0, 1]}
              ticks={[0, 1]}
              tickFormatter={(val) => val === 1 ? 'Rain' : 'Dry'}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }}
            />
            <Bar dataKey="rain" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RainAnalytics;

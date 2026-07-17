import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './WeatherAnalytics.module.css';

const WeatherAnalytics = ({ hourly }) => {
  // Format data for Recharts
  const data = hourly.slice(0, 24).map(h => ({
    time: new Date(h.dt * 1000).toLocaleTimeString([], { hour: 'numeric' }),
    temp: Math.round(h.temp),
    humidity: h.humidity || Math.round(60 + Math.random() * 20), // fallback if humidity missing in mock
  }));

  return (
    <div className={`premium-card ${styles.analyticsCard}`}>
      <h3 className={styles.title}>24-Hour Temperature & Humidity Trends</h3>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />
            <Area type="monotone" dataKey="temp" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTemp)" name="Temperature (°C)" />
            <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHum)" name="Humidity (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherAnalytics;

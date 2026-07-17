import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import styles from './FarmHealthRadar.module.css';

const FarmHealthRadar = ({ healthScore, kpis }) => {
  // Normalize values to a 0-100 scale for the radar chart
  const data = [
    { subject: 'Moisture', A: Math.min(100, (kpis.moisture.current / 60) * 100), fullMark: 100 },
    { subject: 'Temp', A: Math.min(100, (kpis.temperature.current / 35) * 100), fullMark: 100 },
    { subject: 'Humidity', A: Math.min(100, (kpis.humidity.current / 80) * 100), fullMark: 100 },
    { subject: 'pH', A: Math.min(100, (kpis.ph.current / 14) * 100), fullMark: 100 },
    { subject: 'Nitrogen', A: Math.min(100, (kpis.nitrogen.current / 150) * 100), fullMark: 100 },
    { subject: 'Phosphorus', A: Math.min(100, (kpis.phosphorus.current / 60) * 100), fullMark: 100 },
  ];

  return (
    <div className={`premium-card ${styles.radarCard}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Farm Health</h3>
        <div className={styles.scoreBadge}>
          <span className={styles.scoreValue}>{healthScore.toFixed(0)}</span>
          <span className={styles.scoreTotal}>/100</span>
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Current Farm"
              dataKey="A"
              stroke="var(--primary-color)"
              fill="var(--primary-color)"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.footer}>
        <div className={styles.statusDot}></div>
        <span>Overall conditions are {healthScore > 80 ? 'optimal' : healthScore > 60 ? 'fair' : 'critical'}</span>
      </div>
    </div>
  );
};

export default FarmHealthRadar;

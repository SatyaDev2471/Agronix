import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './SoilNutrientDash.module.css';

const SoilNutrientDash = ({ kpis }) => {
  // Mock healthy ranges for NPK
  const npkData = [
    { name: 'Nitrogen (N)', value: kpis.nitrogen.current, optimal: 120, max: 150 },
    { name: 'Phosphorus (P)', value: kpis.phosphorus.current, optimal: 45, max: 60 },
    { name: 'Potassium (K)', value: kpis.potassium.current, optimal: 80, max: 100 },
  ];

  // Colors based on proximity to optimal
  const getColor = (val, opt) => {
    const diff = Math.abs(val - opt) / opt;
    if (diff < 0.1) return '#16a34a'; // Green (Optimal)
    if (diff < 0.25) return '#f59e0b'; // Yellow (Warning)
    return '#dc2626'; // Red (Critical)
  };

  return (
    <div className={`premium-card ${styles.nutrientCard}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Soil Nutrition</h3>
        <span className={styles.phBadge}>pH Level: {kpis.ph.current.toFixed(2)}</span>
      </div>

      <div className={styles.npkGrid}>
        {npkData.map(item => (
          <div key={item.name} className={styles.npkStat}>
            <span className={styles.npkLabel}>{item.name}</span>
            <span className={styles.npkValue} style={{ color: getColor(item.value, item.optimal) }}>
              {item.value.toFixed(0)} <span className={styles.unit}>mg/kg</span>
            </span>
          </div>
        ))}
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={npkData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis type="number" hide domain={[0, 'dataMax + 20']} />
            <YAxis dataKey="name" type="category" hide />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
              {npkData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.value, entry.optimal)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className={styles.aiText}>
        <strong>AI Insight:</strong> NPK levels are within 15% of the optimal range. Current pH ({kpis.ph.current.toFixed(1)}) perfectly supports nutrient absorption.
      </p>
    </div>
  );
};

export default SoilNutrientDash;

import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import styles from './KPIGrid.module.css';

const KPICard = ({ title, data, unit, inverseLogic }) => {
  const diff = data.current - data.prev;
  const percentChange = data.prev !== 0 ? (diff / data.prev) * 100 : 0;
  
  let TrendIcon = FiMinus;
  let trendClass = styles.trendNeutral;
  
  if (diff > 0) {
    TrendIcon = FiTrendingUp;
    trendClass = inverseLogic ? styles.trendNegative : styles.trendPositive;
  } else if (diff < 0) {
    TrendIcon = FiTrendingDown;
    trendClass = inverseLogic ? styles.trendPositive : styles.trendNegative;
  }

  return (
    <div className={`premium-card ${styles.kpiCard}`}>
      <span className={styles.kpiTitle}>{title}</span>
      <div className={styles.kpiMain}>
        <h3 className={styles.kpiValue}>
          {data.current.toFixed(1)}<span className={styles.kpiUnit}>{unit}</span>
        </h3>
        <div className={`${styles.trendBadge} ${trendClass}`}>
          <TrendIcon size={14} />
          <span>{Math.abs(percentChange).toFixed(1)}%</span>
        </div>
      </div>
      <div className={styles.kpiFooter}>
        <span className={styles.prevText}>vs {data.prev.toFixed(1)} yesterday</span>
      </div>
    </div>
  );
};

const KPIGrid = ({ kpis }) => {
  return (
    <div className={styles.kpiGrid}>
      <KPICard title="Avg Moisture" data={kpis.moisture} unit="%" />
      <KPICard title="Avg Temperature" data={kpis.temperature} unit="°C" inverseLogic={true} />
      <KPICard title="Avg Humidity" data={kpis.humidity} unit="%" />
      <KPICard title="Soil Nitrogen (N)" data={kpis.nitrogen} unit=" mg/kg" />
    </div>
  );
};

export default KPIGrid;

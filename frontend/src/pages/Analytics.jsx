import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useAnalytics } from '../hooks/useAnalytics';
import KPIGrid from '../components/Analytics/KPIGrid';
import FarmHealthRadar from '../components/Analytics/FarmHealthRadar';
import MoistureTrends from '../components/Analytics/MoistureTrends';
import AtmosphereAnalytics from '../components/Analytics/AtmosphereAnalytics';
import SoilNutrientDash from '../components/Analytics/SoilNutrientDash';
import RainAnalytics from '../components/Analytics/RainAnalytics';
import AIInsightsPanel from '../components/Analytics/AIInsightsPanel';
import styles from './Analytics.module.css';

const Analytics = () => {
  const { data, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <Spinner animation="border" variant="success" />
        <p>Crunching sensor data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.pageTitle}>Farm Analytics</h2>
          <p className={styles.pageSubtitle}>Live insights generated from ThingSpeak IoT sensors.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.exportBtn}>Export Report</button>
        </div>
      </div>

      <AIInsightsPanel insights={data.insights} />

      <KPIGrid kpis={data.kpis} />

      <div className={styles.gridRow2}>
        <div className={styles.colLarge}>
          <MoistureTrends rawFeeds={data.rawFeeds} />
        </div>
        <div className={styles.colSmall}>
          <FarmHealthRadar healthScore={data.healthScore} kpis={data.kpis} />
        </div>
      </div>

      <div className={styles.gridRow2}>
        <div className={styles.colHalf}>
          <AtmosphereAnalytics rawFeeds={data.rawFeeds} />
        </div>
        <div className={styles.colHalf}>
          <SoilNutrientDash kpis={data.kpis} />
        </div>
      </div>

      <div className={styles.gridRow1}>
        <div className={styles.colFull}>
          <RainAnalytics rawFeeds={data.rawFeeds} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;

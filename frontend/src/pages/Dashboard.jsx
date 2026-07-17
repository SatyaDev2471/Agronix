import React from 'react';
import { Row, Col } from 'react-bootstrap';
import LiveSensorGrid from '../components/LiveSensorGrid';
import AIRecommendationEngine from '../components/AIRecommendationEngine';
import WeatherModule from '../components/WeatherModule';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h2 className={styles.welcomeText}>{getGreeting()}, Harsh</h2>
          <p className={styles.subtitle}>Here is your farm overview for today.</p>
        </div>
        
        <div className={styles.heroStats}>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>Farm Health Score</div>
            <div className={styles.statValue}>94%</div>
            <div className={styles.statTrend}>+2.4% this week</div>
          </div>
        </div>
      </section>

      {/* Main Grid: Sensors and Weather */}
      <Row className="g-4">
        <Col lg={8} xl={9}>
          <section>
            <h3 className={styles.sectionTitle}>Live Sensor Dashboard</h3>
            <LiveSensorGrid />
          </section>
        </Col>
        <Col lg={4} xl={3}>
          <section>
            <h3 className={styles.sectionTitle}>Local Weather</h3>
            <WeatherModule />
          </section>
        </Col>
      </Row>

      {/* AI Recommendations */}
      <section>
        <AIRecommendationEngine />
      </section>
    </div>
  );
};

export default Dashboard;

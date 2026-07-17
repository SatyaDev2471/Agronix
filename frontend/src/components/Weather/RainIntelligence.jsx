import React from 'react';
import { Row, Col, ProgressBar } from 'react-bootstrap';
import { WiUmbrella, WiRaindrops, WiStormShowers } from 'react-icons/wi';
import { MdWaterDrop } from 'react-icons/md';
import styles from './RainIntelligence.module.css';

const RainIntelligence = ({ current, hourly }) => {
  // Mock logic to extract rain intelligence from hourly data
  const upcomingRainHour = hourly.find(h => h.pop > 0.5);
  const rainProbability = upcomingRainHour ? Math.round(upcomingRainHour.pop * 100) : 10;
  
  return (
    <div className={`premium-card ${styles.rainCard}`}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconWrapper}>
            <WiUmbrella size={24} />
          </div>
          <h3 className={styles.title}>Rain Intelligence</h3>
        </div>
        <div className={styles.statusBadge}>
          {rainProbability > 50 ? 'Rain Expected' : 'Dry Conditions'}
        </div>
      </div>

      <div className={styles.mainMetrics}>
        <div className={styles.mainProb}>
          <span className={styles.probValue}>{rainProbability}%</span>
          <span className={styles.probLabel}>Rain Probability Today</span>
        </div>
        
        <div className={styles.progressBarWrapper}>
          <ProgressBar 
            now={rainProbability} 
            variant={rainProbability > 50 ? "primary" : "success"} 
            className={styles.customProgress} 
          />
        </div>
      </div>

      <Row className={styles.detailsGrid}>
        <Col xs={6} className={styles.detailItem}>
          <WiRaindrops size={28} color="#3b82f6" />
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Expected Rainfall</span>
            <span className={styles.detailValue}>{rainProbability > 50 ? '12 mm' : '0 mm'}</span>
          </div>
        </Col>
        <Col xs={6} className={styles.detailItem}>
          <MdWaterDrop size={20} color="#3b82f6" style={{ margin: '4px' }} />
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Intensity</span>
            <span className={styles.detailValue}>{rainProbability > 50 ? 'Moderate' : 'None'}</span>
          </div>
        </Col>
        <Col xs={6} className={styles.detailItem}>
          <WiStormShowers size={28} color="#f59e0b" />
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Storm Risk</span>
            <span className={styles.detailValue}>Low (15%)</span>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RainIntelligence;

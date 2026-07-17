import React from 'react';
import { FiCheckCircle, FiClock, FiDroplet } from 'react-icons/fi';
import styles from './IrrigationPlanner.module.css';

const IrrigationPlanner = ({ current, hourly }) => {
  return (
    <div className={`premium-card ${styles.plannerCard}`}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <FiDroplet size={20} />
        </div>
        <h3 className={styles.title}>Irrigation Planner</h3>
      </div>

      <div className={styles.planOverview}>
        <div className={styles.planStatus}>
          <FiCheckCircle size={24} color="var(--success-color)" />
          <span>Optimal Conditions Today</span>
        </div>
      </div>

      <div className={styles.timingSection}>
        <div className={styles.timingItem}>
          <span className={styles.timingLabel}>Best Time</span>
          <span className={`${styles.timingValue} ${styles.success}`}>06:00 PM</span>
        </div>
        <div className={styles.timingItem}>
          <span className={styles.timingLabel}>Worst Time</span>
          <span className={`${styles.timingValue} ${styles.danger}`}>01:00 PM</span>
        </div>
      </div>

      <div className={styles.recommendationBox}>
        <div className={styles.recRow}>
          <span className={styles.recLabel}>Recommended Duration</span>
          <span className={styles.recValue}>45 mins</span>
        </div>
        <div className={styles.recRow}>
          <span className={styles.recLabel}>Expected Water Saving</span>
          <span className={`${styles.recValue} ${styles.highlight}`}>~120 Liters</span>
        </div>
      </div>

      <div className={styles.aiExplanation}>
        <FiClock size={16} className={styles.aiIcon} />
        <p><strong>AI Insight:</strong> Evaporation rate is lowest after sunset. Waiting until 6 PM avoids the peak heat of 32°C at 1 PM.</p>
      </div>
    </div>
  );
};

export default IrrigationPlanner;

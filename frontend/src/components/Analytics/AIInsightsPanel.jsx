import React from 'react';
import { FiCpu, FiCheckCircle } from 'react-icons/fi';
import styles from './AIInsightsPanel.module.css';

const AIInsightsPanel = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className={styles.aiPanel}>
      <div className={styles.aiHeader}>
        <div className={styles.aiIconWrapper}>
          <FiCpu size={20} />
        </div>
        <h3 className={styles.aiTitle}>Agronix Intelligence</h3>
      </div>
      <div className={styles.insightsList}>
        {insights.map((insight, idx) => (
          <div key={idx} className={styles.insightItem}>
            <FiCheckCircle className={styles.checkIcon} size={16} />
            <p>{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsPanel;

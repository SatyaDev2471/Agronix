import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiAlertCircle, FiCpu } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './AITradingAdvisor.module.css';

const AITradingAdvisor = ({ recommendation }) => {
  const { t } = useLanguage();
  if (!recommendation) return null;

  const isHold = recommendation.action === 'HOLD';
  const isSell = recommendation.action === 'SELL NOW';
  
  let badgeClass = styles.badgeStable;
  if (isHold) badgeClass = styles.badgeHold;
  if (isSell) badgeClass = styles.badgeSell;

  return (
    <motion.div 
      className={styles.advisorCard}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className={styles.header}>
        <div className={styles.aiBadge}>
          <FiCpu size={22} className={styles.aiIcon} />
          {t('advisor.ai_advisor') || 'Agronix AI Market Advisor'}
        </div>
        <div className={`${styles.actionBadge} ${badgeClass}`}>
          {recommendation.action}
        </div>
      </div>

      <div className={styles.mainContent}>
        <p className={styles.reason}>{recommendation.reason}</p>
        
        <div className={styles.metricsBox}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>{t('advisor.expected_impact') || 'Expected Impact'}</span>
            <span className={`${styles.metricValue} ${isSell ? styles.textRed : styles.textGreen}`}>
              {recommendation.profit_estimate}
            </span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>{t('advisor.ai_confidence') || 'Confidence Score'}</span>
            <div className={styles.confidenceRow}>
              <FiTarget size={20} className={styles.targetIcon} />
              <span className={styles.confidenceValue}>{recommendation.confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <FiAlertCircle size={14} />
        <span>{t('advisor.disclaimer') || 'AI recommendations are based on predictive modeling and historical data.'}</span>
      </div>
    </motion.div>
  );
};

export default AITradingAdvisor;

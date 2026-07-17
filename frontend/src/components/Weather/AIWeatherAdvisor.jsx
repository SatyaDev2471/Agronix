import React from 'react';
import { FiCpu, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import styles from './AIWeatherAdvisor.module.css';

const AIWeatherAdvisor = ({ current, hourly, daily }) => {
  // Mock AI generation based on live data
  const generateInsights = () => {
    const insights = [];
    const isRainy = current.weather[0].main.toLowerCase().includes('rain');
    const isHot = current.temp > 30;
    
    if (isRainy) {
      insights.push({
        id: 1,
        priority: 'High',
        title: 'Rain Expected',
        reason: 'Precipitation is currently ongoing or expected shortly.',
        action: 'Delay any planned irrigation immediately.',
        benefit: 'Prevents waterlogging and saves ~50L of water.',
        confidence: 94
      });
    } else if (isHot) {
      insights.push({
        id: 2,
        priority: 'Medium',
        title: 'High Evaporation Risk',
        reason: 'Current temperature is above 30°C.',
        action: 'Shift irrigation schedule to early morning or late evening.',
        benefit: 'Reduces evaporative water loss by up to 25%.',
        confidence: 88
      });
    } else {
      insights.push({
        id: 3,
        priority: 'Low',
        title: 'Ideal Farming Conditions',
        reason: 'Temperature and humidity are within optimal ranges.',
        action: 'Proceed with standard automated irrigation schedules.',
        benefit: 'Maintains steady crop growth.',
        confidence: 98
      });
    }

    if (current.wind_speed > 15) {
      insights.push({
        id: 4,
        priority: 'Medium',
        title: 'Strong Winds Detected',
        reason: `Wind speed is ${current.wind_speed} m/s.`,
        action: 'Avoid pesticide or foliar fertilizer spraying today.',
        benefit: 'Prevents chemical drift and ensures proper application.',
        confidence: 91
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High': return styles.highPriority;
      case 'Medium': return styles.mediumPriority;
      default: return styles.lowPriority;
    }
  };

  return (
    <div className={`premium-card ${styles.advisorCard}`}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.aiIcon}>
            <FiCpu size={24} />
          </div>
          <div>
            <h3 className={styles.title}>Agronix AI Weather Advisor</h3>
            <p className={styles.subtitle}>Actionable farming insights powered by live weather data.</p>
          </div>
        </div>
      </div>

      <div className={styles.insightsList}>
        {insights.map(insight => (
          <div key={insight.id} className={styles.insightItem}>
            <div className={`${styles.priorityBadge} ${getPriorityStyle(insight.priority)}`}>
              {insight.priority} Priority
            </div>
            
            <h4 className={styles.insightTitle}>{insight.title}</h4>
            
            <div className={styles.insightDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Reason</span>
                <span className={styles.detailText}>{insight.reason}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Action</span>
                <span className={styles.detailText}><strong>{insight.action}</strong></span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Benefit</span>
                <span className={`${styles.detailText} ${styles.success}`}>{insight.benefit}</span>
              </div>
            </div>

            <div className={styles.confidenceScore}>
              <FiTrendingUp size={14} />
              <span>AI Confidence Score: {insight.confidence}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIWeatherAdvisor;

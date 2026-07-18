import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Spinner } from 'react-bootstrap';
import { FiCpu, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import styles from './AIRecommendationEngine.module.css';
import { useLanguage } from '../contexts/LanguageContext';

const AIRecommendationEngine = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get(`/analytics?results=1&language=${language}`);
        if (response.data && response.data.success && response.data.analytics?.recommendations) {
          setRecommendations(response.data.analytics.recommendations);
        }
      } catch (error) {
        console.error("Failed to fetch AI recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
    const interval = setInterval(fetchRecommendations, 30000);
    return () => clearInterval(interval);
  }, [language]);

  // Map icon strings/types to actual React Icons
  const getIcon = (type) => {
    switch(type) {
      case 'danger':
      case 'warning': return <FiAlertTriangle size={24} />;
      case 'success': return <FiCheckCircle size={24} />;
      default: return <FiInfo size={24} />;
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'warning': return { color: '#f59e0b', bg: '#fef3c7' };
      case 'danger': return { color: '#ef4444', bg: '#fee2e2' };
      case 'success': return { color: '#10b981', bg: '#d1fae5' };
      default: return { color: '#3b82f6', bg: '#dbeafe' };
    }
  };

  return (
    <div className={`premium-card ${styles.aiContainer}`}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.aiIcon}>
            <FiCpu size={24} />
          </div>
          <div>
            <h3 className={styles.title}>Agronix AI Advisor</h3>
            <p className={styles.subtitle}>Real-time actionable insights based on live farm data.</p>
          </div>
        </div>
        <div className={styles.pulseIndicator}>
          <span className={styles.pulseDot}></span>
          Live Analysis Active
        </div>
      </div>

      <div className={styles.recommendationList}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
            <Spinner animation="border" variant="success" size="sm" style={{ marginRight: '10px' }} />
            Analyzing live sensors...
          </div>
        ) : recommendations.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
            No recommendations at this time.
          </div>
        ) : recommendations.map(rec => {
          const typeStyle = getTypeStyle(rec.type);
          return (
            <div key={rec.id} className={styles.recommendationItem}>
              <div className={styles.recIcon} style={{ color: typeStyle.color, backgroundColor: typeStyle.bg }}>
                {getIcon(rec.type)}
              </div>
              <div className={styles.recContent}>
                <div className={styles.recHeader}>
                  <h4 className={styles.recTitle}>{rec.title}</h4>
                  <span className={styles.priorityBadge} style={{ backgroundColor: typeStyle.bg, color: typeStyle.color }}>
                    {rec.priority} Priority
                  </span>
                </div>
                <div className={styles.recBody}>
                  <p><strong>Reason:</strong> {rec.reason}</p>
                  <p><strong>Suggested Action:</strong> {rec.action}</p>
                  <p><strong>Expected Benefit:</strong> <span className={styles.benefitText}>{rec.benefit}</span></p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIRecommendationEngine;

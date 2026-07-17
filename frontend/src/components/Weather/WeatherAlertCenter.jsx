import React from 'react';
import { FiAlertOctagon, FiClock } from 'react-icons/fi';
import styles from './WeatherAlertCenter.module.css';

const WeatherAlertCenter = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  const formatTime = (ts) => new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.alertContainer}>
      {alerts.map((alert, idx) => (
        <div key={idx} className={styles.alertCard}>
          <div className={styles.alertIcon}>
            <FiAlertOctagon size={24} />
          </div>
          <div className={styles.alertContent}>
            <div className={styles.alertHeader}>
              <h4 className={styles.alertTitle}>{alert.event}</h4>
              <span className={styles.alertBadge}>Critical Priority</span>
            </div>
            <p className={styles.alertDescription}>{alert.description}</p>
            <div className={styles.alertTime}>
              <FiClock size={14} />
              <span>Valid: {formatTime(alert.start)} - {formatTime(alert.end)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherAlertCenter;

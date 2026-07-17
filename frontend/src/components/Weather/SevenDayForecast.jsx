import React from 'react';
import { WiDaySunny, WiCloudy, WiRain } from 'react-icons/wi';
import { IoWaterOutline } from 'react-icons/io5';
import styles from './SevenDayForecast.module.css';

const SevenDayForecast = ({ daily }) => {
  const formatDay = (ts) => {
    return new Date(ts * 1000).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getWeatherIcon = (main) => {
    if (main === 'Rain') return <WiRain size={32} color="#3b82f6" />;
    if (main === 'Clouds') return <WiCloudy size={32} color="#94a3b8" />;
    return <WiDaySunny size={32} color="#f59e0b" />;
  };

  return (
    <div className={`premium-card ${styles.dailyCard}`}>
      <h3 className={styles.title}>7-Day Forecast</h3>
      
      <div className={styles.listContainer}>
        {daily.map((day, idx) => (
          <div key={idx} className={styles.dayRow}>
            <span className={styles.dayName}>{idx === 0 ? 'Today' : formatDay(day.dt)}</span>
            
            <div className={styles.iconPopGroup}>
              {getWeatherIcon(day.weather[0].main)}
              {day.pop > 0 && (
                <span className={styles.popText}>{Math.round(day.pop * 100)}%</span>
              )}
            </div>

            <div className={styles.tempRange}>
              <span className={styles.minTemp}>{Math.round(day.temp.min)}°</span>
              <div className={styles.tempBar}>
                {/* Visual bar can be dynamically sized based on min/max across the week */}
                <div className={styles.tempBarFill}></div>
              </div>
              <span className={styles.maxTemp}>{Math.round(day.temp.max)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SevenDayForecast;

import React from 'react';
import { WiDaySunny, WiCloudy, WiRain } from 'react-icons/wi';
import { IoWaterOutline } from 'react-icons/io5';
import styles from './HourlyForecast.module.css';

const HourlyForecast = ({ hourly }) => {
  const formatHour = (ts) => {
    return new Date(ts * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true });
  };

  const getWeatherIcon = (main) => {
    if (main === 'Rain') return <WiRain size={36} color="#3b82f6" />;
    if (main === 'Clouds') return <WiCloudy size={36} color="#94a3b8" />;
    return <WiDaySunny size={36} color="#f59e0b" />;
  };

  return (
    <div className={`premium-card ${styles.hourlyCard}`}>
      <h3 className={styles.title}>24-Hour Forecast</h3>
      
      <div className={styles.scrollContainer}>
        {hourly.slice(0, 24).map((hour, idx) => (
          <div key={idx} className={styles.hourItem}>
            <span className={styles.time}>{idx === 0 ? 'Now' : formatHour(hour.dt)}</span>
            <div className={styles.iconWrapper}>
              {getWeatherIcon(hour.weather[0].main)}
            </div>
            <span className={styles.temp}>{Math.round(hour.temp)}°</span>
            <div className={styles.popWrapper}>
              <IoWaterOutline color="#3b82f6" />
              <span>{Math.round(hour.pop * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;

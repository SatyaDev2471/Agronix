import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { WiHumidity, WiBarometer, WiStrongWind, WiDaySunny, WiCloudy, WiRain, WiSunrise, WiSunset } from 'react-icons/wi';
import { MdOutlineAir, MdVisibility } from 'react-icons/md';
import styles from './WeatherHero.module.css';

const WeatherHero = ({ current, locationName }) => {
  // Determine gradient based on weather condition (mocked simply)
  const isRainy = current.weather[0].main.toLowerCase().includes('rain');
  const isCloudy = current.weather[0].main.toLowerCase().includes('cloud');
  
  let bgClass = styles.bgSunny;
  let WeatherIcon = WiDaySunny;
  
  if (isRainy) {
    bgClass = styles.bgRainy;
    WeatherIcon = WiRain;
  } else if (isCloudy) {
    bgClass = styles.bgCloudy;
    WeatherIcon = WiCloudy;
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`${styles.heroCard} ${bgClass}`}>
      <div className={styles.heroOverlay}></div>
      
      <div className={styles.heroContent}>
        <div className={styles.mainInfo}>
          <div className={styles.tempGroup}>
            <h1 className={styles.temperature}>{Math.round(current.temp)}°</h1>
            <div className={styles.tempDetails}>
              <span className={styles.condition}>{current.weather[0].description}</span>
              <span className={styles.feelsLike}>Feels like {Math.round(current.feels_like)}°</span>
            </div>
          </div>
          <div className={styles.heroIconWrapper}>
            <WeatherIcon size={120} className={styles.animatedIcon} />
          </div>
        </div>

        <Row className={styles.metricsGrid}>
          <Col xs={6} md={3} className={styles.metricItem}>
            <WiHumidity size={24} />
            <div className={styles.metricText}>
              <span className={styles.metricLabel}>Humidity</span>
              <span className={styles.metricValue}>{current.humidity}%</span>
            </div>
          </Col>
          <Col xs={6} md={3} className={styles.metricItem}>
            <WiStrongWind size={24} />
            <div className={styles.metricText}>
              <span className={styles.metricLabel}>Wind Speed</span>
              <span className={styles.metricValue}>{current.wind_speed} m/s</span>
            </div>
          </Col>
          <Col xs={6} md={3} className={styles.metricItem}>
            <WiBarometer size={24} />
            <div className={styles.metricText}>
              <span className={styles.metricLabel}>Pressure</span>
              <span className={styles.metricValue}>{current.pressure} hPa</span>
            </div>
          </Col>
          <Col xs={6} md={3} className={styles.metricItem}>
            <MdVisibility size={20} />
            <div className={styles.metricText}>
              <span className={styles.metricLabel}>Visibility</span>
              <span className={styles.metricValue}>{(current.visibility / 1000).toFixed(1)} km</span>
            </div>
          </Col>
          <Col xs={6} md={3} className={styles.metricItem}>
            <WiSunrise size={24} />
            <div className={styles.metricText}>
              <span className={styles.metricLabel}>Sunrise</span>
              <span className={styles.metricValue}>{formatTime(current.sunrise)}</span>
            </div>
          </Col>
          <Col xs={6} md={3} className={styles.metricItem}>
            <WiSunset size={24} />
            <div className={styles.metricText}>
              <span className={styles.metricLabel}>Sunset</span>
              <span className={styles.metricValue}>{formatTime(current.sunset)}</span>
            </div>
          </Col>
          <Col xs={6} md={3} className={styles.metricItem}>
            <WiDaySunny size={24} />
            <div className={styles.metricText}>
              <span className={styles.metricLabel}>UV Index</span>
              <span className={styles.metricValue}>{current.uvi}</span>
            </div>
          </Col>
          <Col xs={6} md={3} className={styles.metricItem}>
            <MdOutlineAir size={24} />
            <div className={styles.metricText}>
              <span className={styles.metricLabel}>Cloud Cover</span>
              <span className={styles.metricValue}>{current.clouds}%</span>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default WeatherHero;

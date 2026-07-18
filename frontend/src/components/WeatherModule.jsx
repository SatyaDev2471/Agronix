import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Row, Col, Spinner } from 'react-bootstrap';
import { WiDaySunny, WiCloudy, WiRain, WiStrongWind, WiSunrise, WiSunset, WiSnow, WiThunderstorm, WiDayFog } from 'react-icons/wi';
import styles from './WeatherModule.module.css';

// Helper to map OpenWeatherMap icons to React-Icons
const getWeatherIcon = (iconCode, size = 24) => {
  if (iconCode.includes('01')) return <WiDaySunny size={size} color="#f59e0b" />;
  if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return <WiCloudy size={size} color="#9CA3AF" />;
  if (iconCode.includes('09') || iconCode.includes('10')) return <WiRain size={size} color="#3B82F6" />;
  if (iconCode.includes('11')) return <WiThunderstorm size={size} color="#6B7280" />;
  if (iconCode.includes('13')) return <WiSnow size={size} color="#93C5FD" />;
  if (iconCode.includes('50')) return <WiDayFog size={size} color="#9CA3AF" />;
  return <WiDaySunny size={size} color="#f59e0b" />;
};

const WeatherModule = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await api.get('/weather');
        setWeatherData(response.data);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Failed to load live weather.");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className={`premium-card ${styles.weatherCard}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className={`premium-card ${styles.weatherCard}`}>
        <p className="text-danger text-center">{error || "Weather unavailable"}</p>
      </div>
    );
  }

  const { current, daily } = weatherData;
  const currentCondition = current.weather[0]?.description || 'Clear';
  const currentIconCode = current.weather[0]?.icon || '01d';

  // Format times
  const sunriseTime = new Date(current.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date(current.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Get next 5 days for forecast
  const next5Days = daily.slice(1, 6).map(day => {
    const date = new Date(day.dt * 1000);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      temp: Math.round(day.temp.max),
      iconCode: day.weather[0]?.icon
    };
  });

  return (
    <div className={`premium-card ${styles.weatherCard}`}>
      <div className={styles.currentWeather}>
        <div className={styles.locationInfo}>
          <h3 className={styles.city}>Farm Sector Alpha</h3>
          <p className={styles.condition} style={{ textTransform: 'capitalize' }}>{currentCondition}</p>
        </div>
        <div className={styles.mainTempInfo}>
          {getWeatherIcon(currentIconCode, 64)}
          <h1 className={styles.temperature}>{Math.round(current.temp)}°</h1>
        </div>
      </div>

      <Row className={styles.weatherDetails}>
        <Col xs={4} className={styles.detailItem}>
          <WiStrongWind size={24} />
          <span>{Math.round(current.wind_speed * 3.6)} km/h</span>
          <small>Wind</small>
        </Col>
        <Col xs={4} className={styles.detailItem}>
          <WiSunrise size={24} />
          <span>{sunriseTime}</span>
          <small>Sunrise</small>
        </Col>
        <Col xs={4} className={styles.detailItem}>
          <WiSunset size={24} />
          <span>{sunsetTime}</span>
          <small>Sunset</small>
        </Col>
      </Row>

      <div className={styles.forecastList}>
        {next5Days.map((day, idx) => (
          <div key={idx} className={styles.forecastItem}>
            <span className={styles.dayLabel}>{day.day}</span>
            <div className={styles.forecastIcon}>{getWeatherIcon(day.iconCode, 28)}</div>
            <span className={styles.forecastTemp}>{day.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherModule;

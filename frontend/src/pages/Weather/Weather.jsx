import React, { useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useWeather } from '../../hooks/useWeather';
import WeatherHero from '../../components/Weather/WeatherHero';
import HourlyForecast from '../../components/Weather/HourlyForecast';
import SevenDayForecast from '../../components/Weather/SevenDayForecast';
import RainIntelligence from '../../components/Weather/RainIntelligence';
import WeatherAlertCenter from '../../components/Weather/WeatherAlertCenter';
import AIWeatherAdvisor from '../../components/Weather/AIWeatherAdvisor';
import IrrigationPlanner from '../../components/Weather/IrrigationPlanner';
import WeatherAnalytics from '../../components/Weather/WeatherAnalytics';
import styles from './Weather.module.css';

const Weather = () => {
  // Hardcoding default location to New Delhi for demonstration.
  const [location] = useState({ lat: 28.6139, lon: 77.2090, name: 'Farm Sector Alpha, New Delhi' });
  const { data, loading, error } = useWeather(location.lat, location.lon);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner animation="border" variant="success" />
        <p>Loading Live Weather Intelligence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={styles.weatherPage}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>Weather Intelligence Center</h2>
        <div className={styles.locationBadge}>
          {location.name} ({location.lat.toFixed(2)}, {location.lon.toFixed(2)})
        </div>
      </div>

      {data.alerts && data.alerts.length > 0 && (
        <WeatherAlertCenter alerts={data.alerts} />
      )}

      <WeatherHero current={data.current} locationName={location.name} />

      <Row className="g-4 mt-1">
        <Col lg={8}>
          <AIWeatherAdvisor current={data.current} hourly={data.hourly} daily={data.daily} />
          
          <div className="mt-4">
            <HourlyForecast hourly={data.hourly} />
          </div>
          
          <div className="mt-4">
            <WeatherAnalytics hourly={data.hourly} />
          </div>
          
          <div className="mt-4">
            <RainIntelligence current={data.current} hourly={data.hourly} />
          </div>
        </Col>
        
        <Col lg={4}>
          <IrrigationPlanner current={data.current} hourly={data.hourly} />
          <div className="mt-4">
            <SevenDayForecast daily={data.daily} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Weather;

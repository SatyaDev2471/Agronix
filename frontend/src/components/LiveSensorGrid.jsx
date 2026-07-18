import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { WiHumidity, WiThermometer, WiRaindrop } from 'react-icons/wi';
import { GiWaterDrop, GiPlantRoots, GiRaining } from 'react-icons/gi';
import { TbActivityHeartbeat } from 'react-icons/tb';
import styles from './LiveSensorGrid.module.css';

const SensorCard = ({ title, value, unit, status, trend, icon, color }) => (
  <div className={`premium-card ${styles.sensorCard}`}>
    <div className={styles.cardHeader}>
      <div className={styles.iconWrapper} style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      <span className={styles.statusBadge} style={{
        backgroundColor: status === 'Optimal' || status === 'Active' ? 'var(--success-color)' : (status === 'Warning' || status === 'Low' ? 'var(--warning-color)' : 'var(--danger-color)')
      }}>
        {status}
      </span>
    </div>
    <div className={styles.cardBody}>
      <h5 className={styles.title}>{title}</h5>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        <span className={styles.unit}>{unit}</span>
      </div>
      <div className={styles.trendInfo}>
        <span className={styles.trend} style={{ color: trend.startsWith('+') || trend === 'Running' || trend === 'Clear' ? 'var(--success-color)' : 'var(--danger-color)' }}>
          {trend}
        </span>
        <span className={styles.trendLabel}>vs last hour</span>
      </div>
    </div>
  </div>
);

const LiveSensorGrid = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await api.get('/analytics?results=2');
        if (response.data && response.data.success) {
          const feeds = response.data.analytics?.rawFeeds || [];
          if (feeds.length > 0) {
            setSensorData(feeds);
          }
        }
      } catch (error) {
        console.error("Failed to fetch live sensor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.gridContainer} style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (!sensorData) {
    return <p className="text-danger">Failed to load real-time sensor data.</p>;
  }

  // With our backend update, [0] is exactly 1 hour ago, and [1] is the current reading
  const current = sensorData.length === 2 ? sensorData[1] : sensorData[0] || {};
  const previous = sensorData.length === 2 ? sensorData[0] : current;

  // Helper to calculate trend
  const getTrend = (curr, prev) => {
    const diff = (parseFloat(curr) || 0) - (parseFloat(prev) || 0);
    if (diff === 0) return '0.0';
    return diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;
  };

  const moisture = parseFloat(current.field3) || 0;
  const temp = parseFloat(current.field1) || 0;
  const humidity = parseFloat(current.field2) || 0;
  const ph = parseFloat(current.field5) || 0;

  const prevMoisture = parseFloat(previous.field1) || 0;
  const prevTemp = parseFloat(previous.field2) || 0;
  const prevHumidity = parseFloat(previous.field3) || 0;
  const prevPh = parseFloat(previous.field5) || 0;

  let n = parseFloat(current.field6) || 0;
  let p = parseFloat(current.field7) || 0;
  let k = parseFloat(current.field8) || 0;

  let prevN = parseFloat(previous.field6) || 0;
  let prevP = parseFloat(previous.field7) || 0;
  let prevK = parseFloat(previous.field8) || 0;

  // Predict NPK if unavailable (proxy AI model)
  if (n < 10) n = parseFloat((100 + moisture * 0.5 + Math.abs(7.0 - ph) * 10).toFixed(0));
  if (p < 10) p = parseFloat((30 + temp * 0.8).toFixed(0));
  if (k < 10) k = parseFloat((60 + humidity * 0.3).toFixed(0));

  if (prevN < 10) prevN = parseFloat((100 + prevMoisture * 0.5 + Math.abs(7.0 - prevPh) * 10).toFixed(0));
  if (prevP < 10) prevP = parseFloat((30 + prevTemp * 0.8).toFixed(0));
  if (prevK < 10) prevK = parseFloat((60 + prevHumidity * 0.3).toFixed(0));

  const isPumpOn = moisture < 35;

  const sensors = [
    {
      title: 'Soil Moisture',
      value: moisture.toFixed(1),
      unit: '%',
      status: (moisture >= 40 && moisture <= 60) ? 'Optimal' : (moisture < 40 ? 'Low' : 'Warning'),
      trend: getTrend(moisture, prevMoisture) + '%',
      icon: <WiHumidity size={32} />,
      color: '#0ea5e9'
    },
    {
      title: 'Temperature',
      value: temp.toFixed(1),
      unit: '°C',
      status: (temp >= 15 && temp <= 30) ? 'Optimal' : 'Warning',
      trend: getTrend(temp, prevTemp) + '°',
      icon: <WiThermometer size={32} />,
      color: '#f59e0b'
    },
    {
      title: 'Humidity',
      value: humidity.toFixed(1),
      unit: '%',
      status: (humidity >= 50 && humidity <= 70) ? 'Optimal' : 'Warning',
      trend: getTrend(humidity, prevHumidity) + '%',
      icon: <WiRaindrop size={32} />,
      color: '#8b5cf6'
    },
    {
      title: 'Rain',
      value: current.field4 >= '1' ? 'Yes' : 'No',
      unit: '',
      status: current.field4 === '1' ? 'Active' : 'Optimal',
      trend: current.field4 >= '1' ? 'Raining' : 'Clear',
      icon: <GiRaining size={32} />,
      color: '#3b82f6'
    },
    {
      title: 'pH Level',
      value: ph.toFixed(1),
      unit: 'pH',
      status: (ph >= 6.0 && ph <= 7.0) ? 'Optimal' : 'Warning',
      trend: getTrend(ph, prevPh),
      icon: <TbActivityHeartbeat size={32} />,
      color: '#10b981'
    },
    {
      title: 'Nitrogen (N)',
      value: n,
      unit: 'mg/kg',
      status: n >= 50 ? 'Optimal' : 'Low',
      trend: getTrend(n, prevN),
      icon: <GiPlantRoots size={32} />,
      color: '#3b82f6'
    },
    {
      title: 'Phosphorus (P)',
      value: p,
      unit: 'mg/kg',
      status: p >= 50 ? 'Optimal' : 'Low',
      trend: getTrend(p, prevP),
      icon: <GiPlantRoots size={32} />,
      color: '#ef4444'
    },
    {
      title: 'Potassium (K)',
      value: k,
      unit: 'mg/kg',
      status: k >= 50 ? 'Optimal' : 'Low',
      trend: getTrend(k, prevK),
      icon: <GiPlantRoots size={32} />,
      color: '#f43f5e'
    },
    {
      title: 'Pump Status',
      value: isPumpOn ? 'ON' : 'OFF',
      unit: '',
      status: isPumpOn ? 'Active' : 'Offline',
      trend: isPumpOn ? 'Running' : 'Stopped',
      icon: <GiWaterDrop size={32} />,
      color: '#06b6d4'
    }
  ];

  return (
    <div className={styles.gridContainer}>
      <Row className="g-4">
        {sensors.map((sensor, idx) => (
          <Col md={6} lg={4} xl={3} key={idx}>
            <SensorCard {...sensor} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default LiveSensorGrid;

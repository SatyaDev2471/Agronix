import { useState, useEffect } from 'react';
import { weatherService } from '../services/api';

export const useWeather = (lat, lon) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const response = await weatherService.getFullWeather(lat, lon);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      setError('Failed to fetch weather data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lat && lon) {
      fetchWeather();
      // Poll every 15 minutes as requested
      const interval = setInterval(fetchWeather, 15 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [lat, lon]);

  return { data, loading, error, refetch: fetchWeather };
};

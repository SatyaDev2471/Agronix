import { useState, useEffect } from 'react';
import { sensorService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

export const useAnalytics = (results = 200) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    
    const fetchAnalytics = async () => {
      try {
        if (!data) setLoading(true);
        const response = await sensorService.getAnalytics(results, language);
        if (isMounted) {
          setData(response.data.analytics);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Analytics fetch failed:", err);
          setError(err.response?.data?.message || 'Failed to fetch analytics data');
          setLoading(false);
        }
      } 
    };

    fetchAnalytics();

    // Refresh every 15 seconds for live updates
    const interval = setInterval(fetchAnalytics, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [results, language]);

  return { data, loading, error };
};

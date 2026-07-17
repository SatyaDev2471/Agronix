import { useState, useEffect } from 'react';
import axios from 'axios';

export const useHistoryData = (results = 800) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // We use the analytics endpoint which already fetches and parses ThingSpeak feeds
        const response = await axios.get(`http://localhost:5000/api/analytics?results=${results}`);
        
        if (response.data && response.data.success) {
          setData(response.data);
        } else {
          setError('Failed to fetch historical data');
        }
      } catch (err) {
        console.error("History fetch error:", err);
        setError('Error connecting to IoT server');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [results]);

  return { data, loading, error };
};

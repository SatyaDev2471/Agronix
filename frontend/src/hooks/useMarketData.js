import { useState, useEffect } from 'react';
import { marketService } from '../services/api';

export const useMarketData = (crop = 'Wheat') => {
  const [data, setData] = useState({ dashboard: null, vendors: null, global: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [dashRes, vendorRes, globalRes] = await Promise.all([
          marketService.getDashboard(crop),
          marketService.getVendors(crop),
          marketService.getGlobal(crop)
        ]);
        
        if (isMounted) {
          setData({
            dashboard: dashRes.data,
            vendors: vendorRes.data,
            global: globalRes.data
          });
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to fetch market intelligence data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAll();
  }, [crop]);

  return { data, loading, error };
};

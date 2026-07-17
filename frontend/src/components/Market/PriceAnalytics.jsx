import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './PriceAnalytics.module.css';

const PriceAnalytics = ({ history, forecast, crop }) => {
  const { t } = useLanguage();
  
  // Combine history and forecast data for the chart
  const combinedData = [
    ...history.map(item => ({ ...item, type: 'history' })),
    ...forecast.map(item => ({ date: item.date, predicted_price: item.predicted_price, type: 'forecast' }))
  ];

  const today = history[history.length - 1]?.date;

  return (
    <motion.div 
      className={styles.chartContainerWrapper}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{t(`market.crops.${crop}`) || crop} {t('chart.title') || 'Price & Forecast Comparison'}</h3>
          <p className={styles.subtitle}>{t('chart.subtitle') || 'Historical data combined with AI predictive modeling'}</p>
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.dotHistory}></div> {t('chart.actual_price') || 'Actual Price'}
          </div>
          <div className={styles.legendItem}>
            <div className={styles.dotForecast}></div> {t('chart.ai_forecast') || 'AI Forecast'}
          </div>
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={combinedData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#174E32" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#174E32" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 500 }} 
              dy={15}
              minTickGap={30}
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
              }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 500 }} 
              domain={['auto', 'auto']}
              dx={-10}
              tickFormatter={(val) => `₹${val}`}
            />
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                padding: '12px',
                fontWeight: 600
              }}
              labelFormatter={(val) => new Date(val).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            />
            
            <ReferenceLine 
              x={today} 
              stroke="#9CA3AF" 
              strokeDasharray="3 3" 
              label={{ position: 'top', value: 'TODAY', fill: '#6B7280', fontSize: 11, fontWeight: 700 }} 
            />
            
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#174E32" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              name="Actual Price"
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="predicted_price" 
              stroke="#8b5cf6" 
              strokeWidth={4}
              strokeDasharray="6 6"
              fillOpacity={1} 
              fill="url(#colorForecast)" 
              name="AI Prediction"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PriceAnalytics;

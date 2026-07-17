import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './MarketHero.module.css';

const MarketHero = ({ overview, crop }) => {
  const { t } = useLanguage();
  const isPositive = overview.priceChange > 0;
  const TrendIcon = isPositive ? FiTrendingUp : FiTrendingDown;
  const trendClass = isPositive ? styles.trendPositive : styles.trendNegative;

  return (
    <motion.div 
      className={styles.heroContainer}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.heroTop}>
        <div>
          <h4 className={styles.cropLabel}>
            {t(`market.crops.${crop}`) || crop} {t('hero.market_overview') || 'Market Overview'}
          </h4>
          <div className={styles.priceWrapper}>
            <span className={styles.currency}>₹</span>
            <h1 className={styles.mainPrice}>{overview.currentPrice.toLocaleString()}</h1>
            <span className={styles.unit}>/ {t('hero.quintal') || 'Quintal'}</span>
          </div>
        </div>

        <div className={styles.trendBadgeWrapper}>
          <div className={`${styles.trendBadge} ${trendClass}`}>
            <div className={styles.trendValue}>
              <TrendIcon size={20} />
              <span>{Math.abs(overview.priceChangePercent).toFixed(2)}%</span>
            </div>
          </div>
          <div className={styles.trendSubtext}>
            {isPositive ? '+' : '-'}₹{Math.abs(overview.priceChange)} {t('hero.today') || 'Today'}
          </div>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>{t('hero.highest') || 'Highest Today'}</span>
          <span className={styles.metricValue}>₹{overview.highestToday.toLocaleString()}</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>{t('hero.lowest') || 'Lowest Today'}</span>
          <span className={styles.metricValue}>₹{overview.lowestToday.toLocaleString()}</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>{t('hero.avg_7d') || '7-Day Average'}</span>
          <span className={styles.metricValue}>₹{overview.weeklyAverage.toLocaleString()}</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>{t('hero.avg_30d') || '30-Day Average'}</span>
          <span className={styles.metricValue}>₹{overview.monthlyAverage.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketHero;

import React from 'react';
import { FiGlobe, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './GlobalMarket.module.css';

const GlobalMarket = ({ globalData, crop }) => {
  const { t } = useLanguage();
  return (
    <div className={`premium-card ${styles.globalCard}`}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.iconWrapper}><FiGlobe size={18} /></div>
          <div>
            <h3 className={styles.title}>{t('global.impact')}</h3>
            <p className={styles.subtitle}>{t('global.international_demand')} {t(`market.crops.${crop}`) || crop}</p>
          </div>
        </div>
      </div>

      <div className={styles.listContainer}>
        {globalData.map((data, index) => (
          <div key={index} className={styles.countryRow}>
            <div className={styles.countryInfo}>
              <span className={styles.countryName}>{data.country}</span>
              <span className={styles.demandBadge} data-demand={data.demand.toLowerCase().replace(' ', '-')}>
                {data.demand} {t('global.demand')}
              </span>
            </div>
            
            <div className={styles.priceDiff}>
              {data.trend === 'Up' ? (
                <div className={styles.trendUp}>
                  <FiTrendingUp size={14} /> +{data.priceDiffPercent}%
                </div>
              ) : data.trend === 'Down' ? (
                <div className={styles.trendDown}>
                  <FiTrendingDown size={14} /> {data.priceDiffPercent}%
                </div>
              ) : (
                <div className={styles.trendStable}>
                  {t('hero.market') === 'Market' ? 'Stable' : 'स्थिर'} 
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalMarket;

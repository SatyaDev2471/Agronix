import React from 'react';
import { FiMapPin, FiClock } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './TopBuyingMarkets.module.css';

const TopBuyingMarkets = ({ mandis }) => {
  const { t } = useLanguage();
  return (
    <div className={`premium-card ${styles.marketsCard}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('markets.top_buying')}</h3>
        <p className={styles.subtitle}>{t('markets.nearby_mandis')}</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('markets.market')}</th>
              <th>{t('markets.distance')}</th>
              <th>{t('markets.current_price')}</th>
              <th>{t('markets.last_updated')}</th>
            </tr>
          </thead>
          <tbody>
            {mandis.map((mandi) => (
              <tr key={mandi.id}>
                <td>
                  <div className={styles.mandiName}>{mandi.name}</div>
                  <div className={styles.mandiLocation}>{mandi.district}, {mandi.state}</div>
                </td>
                <td>
                  <div className={styles.iconText}>
                    <FiMapPin size={12} /> {mandi.distance}
                  </div>
                </td>
                <td>
                  <div className={styles.priceHighlight}>₹{mandi.price}</div>
                </td>
                <td>
                  <div className={styles.iconText}>
                    <FiClock size={12} /> {mandi.updated}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopBuyingMarkets;

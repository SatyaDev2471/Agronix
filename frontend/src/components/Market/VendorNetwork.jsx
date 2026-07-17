import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FiPhoneCall, FiMapPin, FiStar } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './VendorNetwork.module.css';

const VendorNetwork = ({ vendors }) => {
  const { t } = useLanguage();
  return (
    <div className={`premium-card ${styles.vendorCard}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('vendors.verified_network')}</h3>
        <p className={styles.subtitle}>{t('vendors.nearby_buyers')}</p>
      </div>

      <Row className="g-4">
        {vendors.map((vendor) => (
          <Col md={4} key={vendor.id}>
            <div className={styles.vendorBox}>
              <div className={styles.vendorHeader}>
                <h4 className={styles.vendorName}>{vendor.name}</h4>
                <div className={styles.ratingBadge}>
                  <FiStar size={12} className={styles.starIcon} />
                  <span>{vendor.rating}</span>
                </div>
              </div>
              
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>{t('vendors.offering')}</span>
                <span className={styles.priceValue}>₹{vendor.buyingPrice} / q</span>
              </div>

              <div className={styles.infoRow}>
                <FiMapPin size={14} className={styles.infoIcon} />
                <span>{vendor.distance}</span>
              </div>
              
              <button className={styles.callBtn}>
                <FiPhoneCall size={16} /> {t('vendors.contact_buyer')}
              </button>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default VendorNetwork;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FiMapPin, FiTruck, FiShoppingBag, FiNavigation } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './GeoSpatialMarkets.module.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const vendorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const mandiIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Mock data representing geo-spatial AI discovered buyers/markets
const marketLocations = [
  { id: 1, type: 'vendor', name: 'AgriCorp Buyers Ltd.', lat: 28.6139, lng: 77.2090, distance: '12 km', priceOffer: '₹2,350/Qtl', crop: 'Wheat' },
  { id: 2, type: 'mandi', name: 'Azadpur APMC Mandi', lat: 28.7373, lng: 77.1770, distance: '24 km', priceOffer: '₹2,280/Qtl', crop: 'Wheat' },
  { id: 3, type: 'vendor', name: 'FreshFarm Exports', lat: 28.5355, lng: 77.3910, distance: '31 km', priceOffer: '₹2,400/Qtl', crop: 'Wheat' },
  { id: 4, type: 'mandi', name: 'Ghazipur Mandi', lat: 28.6271, lng: 77.3271, distance: '18 km', priceOffer: '₹2,300/Qtl', crop: 'Wheat' }
];

const GeoSpatialMarkets = ({ crop }) => {
  const { t } = useLanguage();
  const center = [28.6139, 77.2090]; // Defaulting map center to New Delhi area for demo

  return (
    <motion.div 
      className={styles.mapContainer}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>
          <FiMapPin className={styles.titleIcon} />
          {t('market.nearby_buyers') || 'Nearby Buyers & Mandis'}
        </h3>
        
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <FiTruck className={styles.legendIconVendor} />
            {t('market.private_vendors') || 'Private Vendors'}
          </div>
          <div className={styles.legendItem}>
            <FiShoppingBag className={styles.legendIconMandi} />
            {t('market.govt_mandis') || 'Govt APMC Mandis'}
          </div>
        </div>
      </div>

      <div className={styles.mapWrapper}>
        <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {marketLocations.map(location => (
            <Marker 
              key={location.id} 
              position={[location.lat, location.lng]}
              icon={location.type === 'vendor' ? vendorIcon : mandiIcon}
            >
              <Popup>
                <div className={styles.popupContainer}>
                  <h4 className={styles.popupTitle}>{location.name}</h4>
                  
                  <div className={styles.popupDetail}>
                    <span className={styles.popupLabel}>Buying:</span>
                    <span className={styles.popupValue}>{location.crop}</span>
                  </div>
                  
                  <div className={styles.popupDetail}>
                    <span className={styles.popupLabel}>Offer:</span>
                    <span className={styles.popupValue} style={{ color: location.type === 'vendor' ? '#3B82F6' : '#10B981' }}>
                      {location.priceOffer}
                    </span>
                  </div>
                  
                  <div className={styles.popupDetail}>
                    <span className={styles.popupLabel}>Distance:</span>
                    <span className={styles.popupValue}>{location.distance}</span>
                  </div>
                  
                  <button className={styles.routeBtn}>
                    <FiNavigation size={14} style={{ marginRight: '5px' }} />
                    Get Directions
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  );
};

export default GeoSpatialMarkets;

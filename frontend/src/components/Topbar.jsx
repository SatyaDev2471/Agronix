import React, { useState, useEffect } from 'react';
import { FiBell, FiSearch, FiUser } from 'react-icons/fi';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './Topbar.module.css';

const Topbar = () => {
  const { language, changeLanguage } = useLanguage();
  const [isMotorOn, setIsMotorOn] = useState(false);

  useEffect(() => {
    const checkMotorStatus = async () => {
      try {
        const response = await api.get('/analytics?results=1');
        if (response.data && response.data.success) {
          const latestFeed = response.data.analytics?.rawFeeds?.[0];
          if (latestFeed) {
            const moisture = parseFloat(latestFeed.field1);
            // Assuming motor is ON if moisture drops below optimal threshold (42%)
            setIsMotorOn(moisture < 42);
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest sensor data for Topbar", err);
      }
    };
    checkMotorStatus();
    // Poll every 30 seconds
    const interval = setInterval(checkMotorStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className={styles.topbar}>
      <div className={styles.searchContainer}>
        <FiSearch className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search farm insights, sensors, or AI..." 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.rightSection}>
        <div className={styles.dateDisplay}>
          {currentDate}
        </div>
        
        <select 
          className={styles.langSelect} 
          value={language} 
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="ta">தமிழ்</option>
          <option value="te">తెలుగు</option>
        </select>
        
        <div 
          className={styles.iconButton} 
          title={isMotorOn ? "Motor is switched on" : "Notifications"}
        >
          <FiBell size={20} />
          {isMotorOn && <span className={styles.notificationBadge} style={{ width: '10px', height: '10px', borderRadius: '50%', padding: 0 }}></span>}
        </div>

        <div className={styles.profileSection}>
          <div className={styles.avatar}>
            <FiUser size={18} />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Harsh</span>
            <span className={styles.userRole}>Farm Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

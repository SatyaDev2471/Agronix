import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import FloatingChatbot from '../components/FloatingChatbot';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Topbar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <FloatingChatbot />
    </div>
  );
};

export default MainLayout;

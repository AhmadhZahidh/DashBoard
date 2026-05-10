import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'GameZone Reseller',
    siteTagline: 'Your Premium Gaming Reseller Panel',
    primaryColor: '#7c3aed',
    accentColor: '#10b981',
    maintenanceMode: false,
    whatsappNumber: '923001234567',
    features: { chat: true, notifications: true }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('/api/settings');
      if (data.success) setSettings(data.settings);
    } catch (error) {}
  };

  return (
    <SettingsContext.Provider value={{ settings, fetchSettings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

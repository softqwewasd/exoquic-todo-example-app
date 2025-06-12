"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 4000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '350px',
    }}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const getNotificationStyles = () => {
    const baseStyles = {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      border: '1px solid',
      cursor: 'pointer',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.3s ease-in-out',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    };

    const typeStyles = {
      success: {
        borderColor: '#10b981',
        borderLeftWidth: '4px',
        borderLeftColor: '#10b981',
      },
      info: {
        borderColor: '#3b82f6',
        borderLeftWidth: '4px',
        borderLeftColor: '#3b82f6',
      },
      warning: {
        borderColor: '#f59e0b',
        borderLeftWidth: '4px',
        borderLeftColor: '#f59e0b',
      },
    };

    return { ...baseStyles, ...typeStyles[notification.type] };
  };

  const getIcon = () => {
    const iconStyles = {
      display: 'inline-block',
      marginRight: '8px',
      fontSize: '18px',
    };

    switch (notification.type) {
      case 'success':
        return <span style={{ ...iconStyles, color: '#10b981' }}>✅</span>;
      case 'info':
        return <span style={{ ...iconStyles, color: '#3b82f6' }}>💬</span>;
      case 'warning':
        return <span style={{ ...iconStyles, color: '#f59e0b' }}>⚠️</span>;
      default:
        return <span style={{ ...iconStyles, color: '#6b7280' }}>ℹ️</span>;
    }
  };

  return (
    <div style={getNotificationStyles()} onClick={onClose}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flexShrink: 0 }}>
          {getIcon()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '4px',
            lineHeight: '1.3',
          }}>
            {notification.title}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: '1.4',
            wordWrap: 'break-word',
          }}>
            {notification.message}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#9ca3af',
            marginTop: '6px',
          }}>
            {notification.timestamp.toLocaleTimeString()}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '0',
            lineHeight: '1',
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};
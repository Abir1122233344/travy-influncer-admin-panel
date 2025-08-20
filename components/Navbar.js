import { Building2, User, Bell, Settings, Sun, Moon, CheckCircle, AlertCircle, Info, UserCircle, Shield, HelpCircle, LogOut, Palette, Bell as BellIcon, Globe } from "lucide-react";
import { useDarkMode } from "../lib/useDarkMode";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { isDarkMode, toggleDarkMode, isLoaded } = useDarkMode();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'New user registered',
      message: 'John Doe has joined the platform',
      time: '2 minutes ago',
      icon: CheckCircle,
      isRead: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'System maintenance',
      message: 'Scheduled maintenance in 1 hour',
      time: '15 minutes ago',
      icon: AlertCircle,
      isRead: false
    },
    {
      id: 3,
      type: 'info',
      title: 'New feature available',
      message: 'Dark mode has been enabled',
      time: '1 hour ago',
      icon: Info,
      isRead: false
    }
  ]);
  const notificationRef = useRef(null);
  const settingsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
  };

  // Mark individual notification as read
  const markAsRead = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // View all notifications (redirect to notifications page)
  const viewAllNotifications = () => {
    // Close dropdown first
    setShowNotifications(false);
    // You can implement navigation to a notifications page here
    // For now, we'll just show an alert
    alert('Redirecting to notifications page...');
  };

  // Settings actions
  const handleSettingsAction = (action) => {
    setShowSettings(false);
    switch (action) {
      case 'profile':
        alert('Opening profile settings...');
        break;
      case 'preferences':
        alert('Opening preferences...');
        break;
      case 'security':
        alert('Opening security settings...');
        break;
      case 'notifications':
        alert('Opening notification preferences...');
        break;
      case 'language':
        alert('Opening language settings...');
        break;
      case 'help':
        alert('Opening help center...');
        break;
      case 'logout':
        if (confirm('Are you sure you want to logout?')) {
          alert('Logging out...');
        }
        break;
      default:
        break;
    }
  };

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationBg = (type, isRead) => {
    const baseClasses = isRead 
      ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    
    if (isRead) return baseClasses;
    
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return baseClasses;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-sm transition-all duration-300 ease-out">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-md overflow-hidden">
            <img 
              src="/travy-logo.png" 
              alt="Travy Logo" 
              className="h-full w-full object-cover transition-transform duration-200 group-hover:rotate-3"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">Travy</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">Admin System</span>
          </div>
        </div>
        
        <nav className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800 transition-all duration-200 ease-out hover:scale-105 hover:shadow-sm">
              Admin Dashboard
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              disabled={!isLoaded}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-out focus-ring hover:scale-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isLoaded && (
                isDarkMode ? (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-all duration-200 hover:text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-all duration-200 hover:text-blue-500" />
                )
              )}
            </button>
            
            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-out focus-ring hover:scale-110 active:scale-95 relative"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-all duration-200 hover:text-blue-600 dark:hover:text-blue-400" />
                {/* Notification badge - only show if there are unread notifications */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 transition-all duration-200 ease-out animate-in slide-in-from-top-2">
                  {/* Header */}
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Notifications List */}
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`px-4 py-3 border-l-4 ${getNotificationBg(notification.type, notification.isRead)} hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ease-out cursor-pointer ${
                            !notification.isRead ? 'ring-1 ring-blue-200 dark:ring-blue-800' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium leading-5 ${
                                  notification.isRead 
                                    ? 'text-gray-600 dark:text-gray-400' 
                                    : 'text-gray-900 dark:text-gray-100'
                                }`}>
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                )}
                              </div>
                              <p className={`text-xs mt-1 leading-4 ${
                                notification.isRead 
                                  ? 'text-gray-500 dark:text-gray-500' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      onClick={viewAllNotifications}
                      className="w-full text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 text-center hover:underline"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Settings Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-out focus-ring hover:scale-110 active:scale-95"
              >
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-all duration-200 hover:text-blue-600 dark:hover:text-blue-400" />
              </button>
              
              {/* Settings Dropdown */}
              {showSettings && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 transition-all duration-200 ease-out animate-in slide-in-from-top-2">
                  {/* Header */}
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Settings</h3>
                  </div>
                  
                  {/* Settings Options */}
                  <div className="py-1">
                    {/* Profile Settings */}
                    <button
                      onClick={() => handleSettingsAction('profile')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
                    >
                      <UserCircle className="h-4 w-4 text-gray-500" />
                      Profile Settings
                    </button>
                    
                    {/* Preferences */}
                    <button
                      onClick={() => handleSettingsAction('preferences')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
                    >
                      <Palette className="h-4 w-4 text-gray-500" />
                      Preferences
                    </button>
                    
                    {/* Security */}
                    <button
                      onClick={() => handleSettingsAction('security')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
                    >
                      <Shield className="h-4 w-4 text-gray-500" />
                      Security
                    </button>
                    
                    {/* Notification Preferences */}
                    <button
                      onClick={() => handleSettingsAction('notifications')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
                    >
                      <BellIcon className="h-4 w-4 text-gray-500" />
                      Notifications
                    </button>
                    
                    {/* Language */}
                    <button
                      onClick={() => handleSettingsAction('language')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
                    >
                      <Globe className="h-4 w-4 text-gray-500" />
                      Language
                    </button>
                    
                    {/* Help */}
                    <button
                      onClick={() => handleSettingsAction('help')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
                    >
                      <HelpCircle className="h-4 w-4 text-gray-500" />
                      Help & Support
                    </button>
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  
                  {/* Logout */}
                  <div className="py-1">
                    <button
                      onClick={() => handleSettingsAction('logout')}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center gap-3"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-md">
                <User className="h-4 w-4 text-white transition-transform duration-200 group-hover:rotate-3" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">Admin</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">admin@travy.com</div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

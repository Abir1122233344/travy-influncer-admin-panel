import { useState } from 'react';
import { X, UserCircle, Shield, Bell, Globe, HelpCircle, Palette, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, activeTab = 'profile' }) {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [formData, setFormData] = useState({
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@travy.com',
      phone: '+1 (555) 123-4567',
      avatar: null
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: false,
      showPasswords: false
    },
    preferences: {
      theme: 'system',
      sidebarCollapsed: false,
      compactMode: false,
      animations: true,
      soundEffects: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      securityAlerts: true,
      weeklyReports: true,
      maintenanceUpdates: true
    },
    language: {
      interfaceLanguage: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      timezone: 'UTC-5'
    }
  });

  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setSaved(false);
  };

  const handleSave = (section) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // Here you would typically save to backend
    console.log(`Saving ${section}:`, formData[section]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('profile', 'avatar', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {formData.profile.avatar ? (
              <img 
                src={formData.profile.avatar} 
                alt="Avatar" 
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              formData.profile.firstName.charAt(0) + formData.profile.lastName.charAt(0)
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all duration-200 ease-out hover:scale-110 hover:shadow-lg">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <UserCircle className="h-4 w-4" />
          </label>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Profile Picture
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload a new profile picture. Recommended size: 200x200 pixels.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.profile.firstName}
            onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={formData.profile.lastName}
            onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.profile.email}
            onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={formData.profile.phone}
            onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
          />
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 hover:shadow-md transition-all duration-200 ease-out">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Security Recommendations
          </h4>
        </div>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
          Enable two-factor authentication and use a strong, unique password for enhanced security.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={formData.security.showPasswords ? "text" : "password"}
              value={formData.security.currentPassword}
              onChange={(e) => handleInputChange('security', 'currentPassword', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => handleInputChange('security', 'showPasswords', !formData.security.showPasswords)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 ease-out hover:scale-110"
            >
              {formData.security.showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type={formData.security.showPasswords ? "text" : "password"}
              value={formData.security.newPassword}
              onChange={(e) => handleInputChange('security', 'newPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type={formData.security.showPasswords ? "text" : "password"}
              value={formData.security.confirmPassword}
              onChange={(e) => handleInputChange('security', 'confirmPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-out hover:shadow-md">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Two-Factor Authentication
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add an extra layer of security to your account
            </p>
          </div>
          <button
            onClick={() => handleInputChange('security', 'twoFactorEnabled', !formData.security.twoFactorEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-out hover:scale-105 ${
              formData.security.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                formData.security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </label>
          <select
            value={formData.preferences.theme}
            onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timezone
          </label>
          <select
            value={formData.language.timezone}
            onChange={(e) => handleInputChange('language', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
          >
            <option value="UTC-8">Pacific Time (UTC-8)</option>
            <option value="UTC-7">Mountain Time (UTC-7)</option>
            <option value="UTC-6">Central Time (UTC-6)</option>
            <option value="UTC-5">Eastern Time (UTC-5)</option>
            <option value="UTC+0">UTC</option>
            <option value="UTC+1">Central European Time (UTC+1)</option>
            <option value="UTC+5:30">India Standard Time (UTC+5:30)</option>
            <option value="UTC+8">China Standard Time (UTC+8)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-out hover:shadow-md">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Collapse Sidebar
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Automatically collapse the sidebar for more workspace
            </p>
          </div>
          <button
            onClick={() => handleInputChange('preferences', 'sidebarCollapsed', !formData.preferences.sidebarCollapsed)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-out hover:scale-105 ${
              formData.preferences.sidebarCollapsed ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                formData.preferences.sidebarCollapsed ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-out hover:shadow-md">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Compact Mode
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Reduce spacing for a more compact interface
            </p>
          </div>
          <button
            onClick={() => handleInputChange('preferences', 'compactMode', !formData.preferences.compactMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-out hover:scale-105 ${
              formData.preferences.compactMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                formData.preferences.compactMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-out hover:shadow-md">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Animations
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enable smooth animations and transitions
            </p>
          </div>
          <button
            onClick={() => handleInputChange('preferences', 'animations', !formData.preferences.animations)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-out hover:scale-105 ${
              formData.preferences.animations ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                formData.preferences.animations ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 hover:shadow-md transition-all duration-200 ease-out">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Notification Preferences
          </h4>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
          Choose which notifications you want to receive and how you want to receive them.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(formData.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-out hover:shadow-md">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {key === 'emailNotifications' && 'Receive notifications via email'}
                {key === 'pushNotifications' && 'Receive push notifications in browser'}
                {key === 'marketingEmails' && 'Receive promotional and marketing emails'}
                {key === 'securityAlerts' && 'Get notified about security events'}
                {key === 'weeklyReports' && 'Receive weekly summary reports'}
                {key === 'maintenanceUpdates' && 'Get notified about system maintenance'}
              </p>
            </div>
            <button
              onClick={() => handleInputChange('notifications', key, !value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-out hover:scale-105 ${
                value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLanguageTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Interface Language
          </label>
          <select
            value={formData.language.interfaceLanguage}
            onChange={(e) => handleInputChange('language', 'interfaceLanguage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
            <option value="ru">Русский</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="ar">العربية</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Format
          </label>
          <select
            value={formData.language.dateFormat}
            onChange={(e) => handleInputChange('language', 'dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (UK)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            <option value="DD.MM.YYYY">DD.MM.YYYY (EU)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time Format
          </label>
          <select
            value={formData.language.timeFormat}
            onChange={(e) => handleInputChange('language', 'timeFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
          >
            <option value="12h">12-hour (AM/PM)</option>
            <option value="24h">24-hour</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timezone
          </label>
          <select
            value={formData.language.timezone}
            onChange={(e) => handleInputChange('language', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm"
          >
            <option value="UTC-8">Pacific Time (UTC-8)</option>
            <option value="UTC-7">Mountain Time (UTC-7)</option>
            <option value="UTC-6">Central Time (UTC-6)</option>
            <option value="UTC-5">Eastern Time (UTC-5)</option>
            <option value="UTC+0">UTC</option>
            <option value="UTC+1">Central European Time (UTC+1)</option>
            <option value="UTC+5:30">India Standard Time (UTC+5:30)</option>
            <option value="UTC+8">China Standard Time (UTC+8)</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-all duration-200 ease-out">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Preview
        </h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>Current time: {new Date().toLocaleString()}</p>
          <p>Date format: {new Date().toLocaleDateString()}</p>
          <p>Language: {formData.language.interfaceLanguage === 'en' ? 'English' : 'Other'}</p>
        </div>
      </div>
    </div>
  );

  const renderHelpTab = () => (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 hover:shadow-md transition-all duration-200 ease-out">
        <div className="flex items-center space-x-2">
          <HelpCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
            Need Help?
          </h4>
        </div>
        <p className="text-sm text-green-700 dark:text-green-300 mt-2">
          We're here to help! Check our documentation, FAQs, or contact support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 ease-out cursor-pointer hover:-translate-y-1 hover:scale-[1.02]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Documentation</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Comprehensive guides and tutorials for all features
          </p>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
            View Docs →
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 ease-out cursor-pointer hover:-translate-y-1 hover:scale-[1.02]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">FAQs</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Quick answers to commonly asked questions
          </p>
          <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors duration-200">
            Browse FAQs →
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 ease-out cursor-pointer hover:-translate-y-1 hover:scale-[1.02]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Report Issue</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Found a bug? Report it to our development team
          </p>
          <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-200">
            Report Bug →
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 ease-out cursor-pointer hover:-translate-y-1 hover:scale-[1.02]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Support</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get help from our support team via chat or email
          </p>
          <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors duration-200">
            Contact Us →
          </button>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-all duration-200 ease-out">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Support
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Email Support:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">support@travy.com</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Phone Support:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Response Time:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Within 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 'profile':
        return renderProfileTab();
      case 'security':
        return renderSecurityTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'language':
        return renderLanguageTab();
      case 'help':
        return renderHelpTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-out hover:scale-110"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <nav className="p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-sm ${
                    currentTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderTabContent()}
            
            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {saved && (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Settings saved!</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleSave(currentTab)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

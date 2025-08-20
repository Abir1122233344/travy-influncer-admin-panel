# 🚀 Travy - Referral & Influencer Management Platform

A modern, professional web application built with Next.js and Tailwind CSS for managing referral programs and influencer partnerships.

![Travy Platform](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.9-38B2AC?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)

## ✨ Features

### 🎨 **Professional Design System**
- **Modern UI/UX** with beautiful gradients and animations
- **Dark Mode Support** with smooth theme transitions
- **Responsive Design** that works on all devices
- **Consistent Styling** with Tailwind CSS utility classes
- **Smooth Animations** and hover effects throughout

### 🔐 **Authentication & Authorization**
- **Role-based Access Control** (Admin & Influencer)
- **Secure Login System** with form validation
- **Protected Routes** for different user types
- **Session Management** with localStorage

### 📊 **Dashboard Features**
- **Admin Dashboard** with analytics and user management
- **Influencer Dashboard** for campaign tracking
- **User Management** with search and filtering
- **Real-time Statistics** and performance metrics

### 🛠 **Technical Features**
- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **Lucide React** icons throughout
- **Custom Hooks** for dark mode and authentication
- **Component-based Architecture**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abir1122233344/travy-influncer-admin-panel.git
   cd travy-influncer-admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
travy/
├── components/          # Reusable UI components
│   ├── Card.js         # Card component with animations
│   ├── Layout.js       # Main layout wrapper
│   ├── Navbar.js       # Navigation header
│   ├── Sidebar.js      # Side navigation
│   └── SettingsModal.js # Settings modal
├── lib/                # Utility functions and hooks
│   ├── api.js          # API client for HTTP requests
│   ├── useDarkMode.js  # Dark mode hook
│   └── withAuth.js     # Authentication wrapper
├── pages/              # Next.js pages
│   ├── _app.js         # App wrapper
│   ├── auth/           # Authentication pages
│   ├── admin/          # Admin dashboard pages
│   └── influencer/     # Influencer pages
├── styles/             # Global styles
│   └── globals.css     # Tailwind imports and custom styles
└── public/             # Static assets
```

## 🎯 Available Pages

### **Authentication**
- `/auth/login` - Login page with role selection

### **Admin Dashboard**
- `/admin/dashboard` - Main admin dashboard with analytics
- `/admin/users` - User management interface
- `/admin/influencers` - Influencer management

### **Influencer Dashboard**
- `/influencer/dashboard` - Influencer-specific dashboard

## 🎨 Design System

### **Colors**
- **Primary**: `#2563EB` (Blue-600)
- **Background**: `#F9FAFB` (Gray-50)
- **Text**: `#111827` (Gray-900)
- **Dark Mode**: Full support with smooth transitions

### **Components**
- **Cards**: Rounded corners, shadows, hover animations
- **Buttons**: Primary, secondary, and danger variants
- **Forms**: Input fields with focus states and validation
- **Navigation**: Sticky navbar with blur effects

### **Animations**
- **Hover Effects**: Scale, shadow, and color transitions
- **Page Transitions**: Fade-in animations
- **Loading States**: Skeleton loaders with shimmer
- **Micro-interactions**: Smooth 200ms transitions

## 🛠 Development

### **Available Scripts**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### **Environment Variables**
Create a `.env.local` file for environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🔧 Customization

### **Adding New Pages**
1. Create a new file in the `pages/` directory
2. Import the `Layout` component for consistent styling
3. Use the existing design system components

### **Modifying Styles**
- Global styles are in `styles/globals.css`
- Tailwind configuration in `tailwind.config.js`
- Component-specific styles use Tailwind utility classes

### **Adding Components**
- Place new components in the `components/` directory
- Follow the existing naming conventions
- Use the established design patterns

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with sidebar navigation
- **Tablet**: Adaptive layout with collapsible sidebar
- **Mobile**: Mobile-first design with touch-friendly interactions

## 🌙 Dark Mode

Dark mode is fully supported with:
- **Automatic detection** of system preference
- **Manual toggle** in the navbar
- **Persistent storage** of user preference
- **Smooth transitions** between themes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer**: [Your Name]
- **Design System**: Custom Travy Design System
- **Icons**: [Lucide React](https://lucide.dev/)

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/Abir1122233344/travy-influncer-admin-panel/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with ❤️ using Next.js and Tailwind CSS**

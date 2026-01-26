# 🌤️ Weather Map Application

A modern, interactive weather monitoring application with real-time map visualization, subscription alerts, and payment integration.

![Weather App](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?logo=tailwindcss)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Features](#-key-features)
- [Subscription System](#-subscription-system)
- [Payment System](#-payment-system)
- [API Integration](#-api-integration)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🗺️ Interactive Weather Map
- **Leaflet-based map** with OpenStreetMap tiles
- **Weather layer overlays**: Temperature, Precipitation, Clouds, Wind, Pressure
- **Click-to-fetch** weather data for any location
- **Smooth animations** and flyTo effects
- **Custom map controls**: Zoom, Reset, My Location
- **Time-of-day visual effects**: Color overlays change based on selected time

### 🔍 Search & Discovery
- **City search** with instant results
- **Geocoding** support for location lookup
- **Automatic centering** on search results
- **Weather markers** with detailed popups

### ⏰ Timeline Control
- **Time-based weather visualization** (9 time slots, 3-hour intervals)
- **Play/Pause animation** for automatic time progression
- **Interactive slider** for manual time selection
- **Time-of-day indicators**: Night 🌙, Morning 🌅, Day ☀️, Evening 🌆
- **Dynamic opacity** based on time distance

### 📧 Subscription System
- **Location-based weather alerts** via email
- **Customizable notification frequency**: Hourly, Daily, Weekly
- **Alert type selection**: Temperature, Precipitation, Wind, Severe Weather
- **Subscription management**: Pause, Resume, Delete
- **Real-time alerts** with severity levels (Info, Warning, Severe)

### 💳 Payment & Billing
- **4 Pricing Tiers**: Free, Basic ($4.99), Pro ($9.99), Enterprise ($29.99)
- **Multiple payment methods**: Credit/Debit Cards, PayPal, Cryptocurrency
- **Subscription management**: Upgrade, Downgrade, Cancel, Reactivate
- **Location limits** based on plan (1, 5, 20, or unlimited)
- **Payment history** with transaction tracking
- **Auto-renewal** with monthly billing cycles

### 🎨 Modern UI/UX
- **Responsive design** with Tailwind CSS
- **Dark mode support** for subscription management
- **Smooth transitions** and animations
- **Accessible** with ARIA labels
- **Loading states** and error handling
- **Toast notifications** for user feedback

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.4** - Build tool & dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS

### Mapping
- **Leaflet 1.9.4** - Interactive maps
- **React-Leaflet 5.0.0** - React bindings for Leaflet

### APIs
- **OpenWeatherMap API** - Weather data & map tiles
  - Current weather
  - 5-day forecast
  - Weather map layers

### State Management
- **React Hooks** - useState, useCallback, useEffect, useRef
- **Custom Hooks** - useWeather, useSubscriptions, usePayments, useMap
- **localStorage** - Client-side data persistence

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **OpenWeatherMap API Key** ([Get it here](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Persauder/weather_app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
weather-app/
├── public/                  # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Map/           # Map-related components
│   │   │   ├── WeatherMap.tsx
│   │   │   ├── MapLayers.tsx
│   │   │   └── MapControls.tsx
│   │   ├── Sidebar/       # Sidebar components
│   │   │   ├── SideBar.tsx
│   │   │   ├── LayerButton.tsx
│   │   │   └── LayersList.tsx
│   │   ├── Timeline/      # Timeline components
│   │   │   ├── Timeline.tsx
│   │   │   └── TimelineSlider.tsx
│   │   ├── Search/        # Search components
│   │   │   └── SearchBar.tsx
│   │   ├── Subscription/  # Subscription components
│   │   │   ├── SubscriptionForm.tsx
│   │   │   ├── SubscriptionList.tsx
│   │   │   └── AlertsPanel.tsx
│   │   ├── Payment/       # Payment components
│   │   │   ├── PricingCards.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── AddPaymentMethodForm.tsx
│   │   │   └── SubscriptionManagement.tsx
│   │   ├── Legend/        # Legend components
│   │   │   └── TemperatureScale.tsx
│   │   ├── Loader.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── WeatherDetails.tsx
│   │   └── WeatherPopup.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useWeather.ts
│   │   ├── useSubscriptions.ts
│   │   ├── usePayments.ts
│   │   └── useMap.ts
│   ├── services/          # API services
│   │   └── weatherAPI.ts
│   ├── types/             # TypeScript types
│   │   ├── weather.ts
│   │   ├── subscription.ts
│   │   └── payment.ts
│   ├── constants/         # Constants & config
│   │   └── layers.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🎯 Key Features

### Weather Map

The interactive map displays real-time weather data with multiple overlay layers:

- **Temperature Layer** - Color-coded temperature visualization
- **Precipitation Layer** - Rain and snow coverage
- **Clouds Layer** - Cloud coverage percentage
- **Wind Layer** - Wind speed and direction
- **Pressure Layer** - Atmospheric pressure

Each layer can be toggled on/off and opacity adjusted via the sidebar.

### Timeline Control

Control the time dimension of weather data:

- **9 time slots** covering 24 hours (3-hour intervals)
- **Play/Pause animation** for automatic progression
- **Time-of-day effects**:
  - 🌙 **Night** (8pm-6am): Dark purple overlay
  - 🌅 **Morning** (6am-10am): Orange/warm overlay
  - ☀️ **Day** (10am-6pm): Light blue overlay
  - 🌆 **Evening** (6pm-8pm): Golden overlay

### Search Functionality

Search for any city worldwide:
- Type city name
- Auto-complete suggestions
- Instant weather data fetch
- Map centers on location
- Weather details card appears

---

## 📧 Subscription System

### Features

- **Email notifications** for weather updates
- **Frequency options**: Hourly, Daily, Weekly
- **Alert types**:
  - 📢 All Weather Updates
  - 🌡️ Temperature Changes
  - 🌧️ Precipitation Alerts
  - 💨 Wind Warnings
  - ⚠️ Severe Weather Only

### Management

Access subscription management via the **Sidebar → Subs tab**:

- View all subscriptions
- Pause/Resume individual subscriptions
- Delete subscriptions
- See subscription status (Active/Paused)
- View created date and frequency

### Alerts

View weather alerts in **Sidebar → Alerts tab**:

- Color-coded severity (Info/Warning/Severe)
- Unread counter badge
- Click to mark as read
- Clear all option
- Automatic alert generation (simulated every 30 seconds)

---

## 💳 Payment System

### Pricing Plans

| Plan | Price | Locations | Features |
|------|-------|-----------|----------|
| **Free** | $0/month | 1 | Daily updates, Basic alerts |
| **Basic** | $4.99/month | 5 | Hourly updates, All alerts, SMS |
| **Pro** ⭐ | $9.99/month | 20 | Real-time, API access, Priority support |
| **Enterprise** | $29.99/month | Unlimited | Custom rules, Dedicated support |

### Payment Methods

- 💳 **Credit/Debit Cards** (Visa, Mastercard, Amex)
- 🅿️ **PayPal**
- ₿ **Cryptocurrency** (Bitcoin, Ethereum)

### Subscription Management

Click **"💎 Upgrade Plan"** in the header to:

- View pricing plans
- Select and upgrade to a plan
- Add payment methods
- View payment history
- Cancel/reactivate subscription
- Manage auto-renewal

### Payment Flow

1. Select a plan
2. Choose or add payment method
3. Review order summary
4. Complete payment (2-second processing)
5. Confirmation & plan activation

---

## 🌐 API Integration

### OpenWeatherMap API

The app uses OpenWeatherMap API for:

#### Current Weather
```
GET https://api.openweathermap.org/data/2.5/weather
```
- Temperature, humidity, pressure
- Weather conditions & icons
- Wind speed & direction
- Sunrise/sunset times

#### Weather Forecast
```
GET https://api.openweathermap.org/data/2.5/forecast
```
- 5-day forecast
- 3-hour intervals
- Future weather predictions

#### Map Tiles
```
https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png
```
Available layers:
- `temp_new` - Temperature
- `precipitation_new` - Precipitation
- `clouds_new` - Clouds
- `wind_new` - Wind
- `pressure_new` - Pressure

### API Key Setup

Get your free API key from [OpenWeatherMap](https://openweathermap.org/api):

1. Sign up for an account
2. Navigate to API keys section
3. Generate a new key
4. Add to `.env` file:
   ```
   VITE_OPENWEATHER_API_KEY=your_key_here
   ```

---

## 🧪 Testing

### Manual Testing

1. **Map Interaction**
   - Click anywhere on map
   - Verify weather popup appears
   - Check marker placement

2. **Search**
   - Search for "London"
   - Verify map centers
   - Check weather details

3. **Timeline**
   - Select different time slots
   - Verify color overlay changes
   - Test play/pause animation

4. **Subscriptions**
   - Subscribe to a location
   - Check sidebar counter
   - Verify alerts appear

5. **Payment**
   - Click "Upgrade Plan"
   - Add test card: 4242 4242 4242 4242
   - Complete payment
   - Verify plan upgrade

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Write TypeScript with proper typing
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenWeatherMap** - Weather data & map tiles
- **Leaflet** - Interactive mapping library
- **React** - UI framework
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool

---

## 📞 Contact

**Project Link**: [https://github.com/Persauder/weather_app](https://github.com/Persauder/weather_app)

---

## 🎉 Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 📸 Screenshots

### Main Dashboard
- Interactive weather map with overlays
- Real-time weather data
- Search functionality

### Subscription Management
- Create weather alert subscriptions
- Manage multiple locations
- View and manage alerts

### Payment System
- View pricing plans
- Secure payment processing
- Subscription management

---

## 🔮 Future Enhancements

- [ ] Dark mode for entire app
- [ ] Mobile responsive design improvements
- [ ] Weather radar animations
- [ ] Historical weather data
- [ ] Custom alert thresholds
- [ ] Push notifications
- [ ] Social sharing
- [ ] Weather analytics dashboard
- [ ] Multi-language support
- [ ] Offline mode with service workers

---

**Made with ❤️ by the Weather App Team**

⭐ Star this repo if you find it useful!


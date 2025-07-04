
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Cloud, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudSun, 
  CloudLightning,
  Wind,
  Thermometer, 
  Droplets, 
  Eye,
  Search, 
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

const API_KEY = "your-api-key-here"; // Users will need to replace this

// Weather Icon Component
const WeatherIcon = ({ icon, size = "medium" }: { icon: string; size?: "small" | "medium" | "large" }) => {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 80,
  };

  const iconSize = sizeMap[size];

  const getIcon = () => {
    switch (icon) {
      case "01d":
      case "01n":
        return <Sun size={iconSize} className="text-yellow-400" />;
      case "02d":
      case "02n":
        return <CloudSun size={iconSize} className="text-yellow-300" />;
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return <Cloud size={iconSize} className="text-gray-300" />;
      case "09d":
      case "09n":
        return <CloudDrizzle size={iconSize} className="text-blue-400" />;
      case "10d":
      case "10n":
        return <CloudRain size={iconSize} className="text-blue-500" />;
      case "11d":
      case "11n":
        return <CloudLightning size={iconSize} className="text-yellow-500" />;
      case "13d":
      case "13n":
        return <CloudSnow size={iconSize} className="text-white" />;
      case "50d":
      case "50n":
        return <Wind size={iconSize} className="text-gray-400" />;
      default:
        return <Sun size={iconSize} className="text-yellow-400" />;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getIcon()}
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-white/40 rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  );
};

// Location Search Component
const LocationSearch = ({ onSearch }: { onSearch: (city: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery("");
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-white/60" />
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a city..."
            className="w-full pl-12 pr-24 py-3 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-white/60 rounded-2xl focus:bg-white/20 focus:border-white/40 transition-all duration-300"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <Button
              type="submit"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-none rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Current Weather Component
const CurrentWeather = ({ data }: { data: WeatherData }) => {
  const weather = data.weather[0];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Main Weather Info */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-4 mb-6">
            <WeatherIcon icon={weather.icon} size="large" />
            <div>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white">
                {Math.round(data.main.temp)}°
              </h2>
              <p className="text-xl text-white/80 capitalize">
                {weather.description}
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-2xl sm:text-3xl font-semibold text-white">
              {data.name}, {data.sys.country}
            </h3>
            <p className="text-lg text-white/70">
              Feels like {Math.round(data.main.feels_like)}°
            </p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Thermometer className="text-orange-300" size={24} />
              <span className="text-white/80 font-medium">Temperature</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {Math.round(data.main.temp)}°C
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Droplets className="text-blue-300" size={24} />
              <span className="text-white/80 font-medium">Humidity</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {data.main.humidity}%
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Wind className="text-green-300" size={24} />
              <span className="text-white/80 font-medium">Wind Speed</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {Math.round(data.wind.speed * 3.6)} km/h
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="text-purple-300" size={24} />
              <span className="text-white/80 font-medium">Pressure</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {data.main.pressure} hPa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Forecast Card Component
const ForecastCard = ({ data }: { 
  data: {
    dt: number;
    main: {
      temp: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }
}) => {
  const date = new Date(data.dt * 1000);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const weather = data.weather[0];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
      <h3 className="text-lg font-semibold text-white mb-3">
        {dayName}
      </h3>
      
      <div className="flex justify-center mb-3">
        <WeatherIcon icon={weather.icon} size="medium" />
      </div>
      
      <p className="text-2xl font-bold text-white mb-2">
        {Math.round(data.main.temp)}°
      </p>
      
      <p className="text-sm text-white/70 capitalize">
        {weather.description}
      </p>
    </div>
  );
};

// Main Weather Dashboard Component
export const WeatherDashboard = () => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [city, setCity] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to get your location. Please search for a city.");
        }
      );
    }
  }, []);

  const { data: weatherData, isLoading: isWeatherLoading } = useQuery({
    queryKey: ["weather", coordinates?.lat, coordinates?.lon, city],
    queryFn: async () => {
      let url = "";
      if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      } else if (coordinates) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`;
      }
      
      if (!url) return null;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Weather data not found");
      }
      return response.json() as Promise<WeatherData>;
    },
    enabled: !!(coordinates || city),
  });

  const { data: forecastData, isLoading: isForecastLoading } = useQuery({
    queryKey: ["forecast", coordinates?.lat, coordinates?.lon, city],
    queryFn: async () => {
      let url = "";
      if (city) {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
      } else if (coordinates) {
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`;
      }
      
      if (!url) return null;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Forecast data not found");
      }
      return response.json() as Promise<ForecastData>;
    },
    enabled: !!(coordinates || city),
  });

  const handleCitySearch = (searchCity: string) => {
    setCity(searchCity);
    setCoordinates(null);
  };

  const isLoading = isWeatherLoading || isForecastLoading;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Weather Dashboard
          </h1>
          <p className="text-xl text-white/80">
            Real-time weather forecast for your location
          </p>
        </div>

        <LocationSearch onSearch={handleCitySearch} />

        {isLoading && <LoadingSpinner />}

        {weatherData && !isLoading && (
          <div className="space-y-8">
            <CurrentWeather data={weatherData} />
            
            {forecastData && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  5-Day Forecast
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {forecastData.list
                    .filter((_, index) => index % 8 === 0)
                    .slice(0, 5)
                    .map((forecast, index) => (
                      <ForecastCard key={index} data={forecast} />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {API_KEY === "your-api-key-here" && (
          <div className="bg-red-500/20 backdrop-blur-md rounded-2xl p-6 mt-8 border border-red-300/30">
            <h3 className="text-xl font-semibold text-white mb-2">
              API Key Required
            </h3>
            <p className="text-white/80">
              Please replace "your-api-key-here" in the WeatherDashboard component with your OpenWeather API key.
              Get one free at{" "}
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-200 underline"
              >
                openweathermap.org
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

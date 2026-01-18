import { useWeather } from './hooks/useWeather';
import { SearchBar } from './components/SearchBar';
import { WeatherDetails } from './components/WeatherDetails';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';

function App() {
  const { weather, loading, error, fetchWeather, clearError } = useWeather();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Weather App
        </h1>

        <div className="mb-6">
          <SearchBar onSearch={fetchWeather} isLoading={loading} />
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={clearError} />
          </div>
        )}

        {loading && <Loader />}

        {!loading && weather && <WeatherDetails weather={weather} />}

        {!loading && !weather && !error && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">
              Enter a city name to get weather information
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


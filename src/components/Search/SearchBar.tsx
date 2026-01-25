import { useState, type FormEvent } from 'react';

interface SearchBarProps {
    onSearch: (city: string) => void;
    isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [city, setCity] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedCity = city.trim();
        if (trimmedCity) {
            onSearch(trimmedCity);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !city.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Loading...' : 'Search'}
            </button>
        </form>
    );
}


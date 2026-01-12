export type WeatherResponse = {
    name: string;
    main: Main;
    weather: Weather[];
    wind: Wind;
    sys: Sys;
    coord: Coord;
    visibility: number;
    dt: number;
}

export type Main = {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}

export type Weather = {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export type Wind = {
    speed: number;
    deg: number;
    gust?: number;
}

export type Sys = {
    country: string;
    sunrise: number;
    sunset: number;
}

export type Coord = {
    lon: number;
    lat: number;
}

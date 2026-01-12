export type weatherData = {
    name: string;
    main: main;
    weather: weather[];
    wind: wind;
    sys: sys;
    coord: coord;
    visibility: number;
    dt: number;
}

type main = {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}

type weather = {
    id: number;
    main: string;
    description: string;
    icon: string;
}

type wind = {
    speed: number;
    deg: number;
    gust?: number;
}

type sys = {
    country: string;
    sunrise: number;
    sunset: number;
}
type coord = {
    lon: number;
    lat: number;
}

"use client";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CurrentWeather = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "a80bae8117581f4033e2648887f84295"; // OpenWeather API Key

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setWeather(null);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found! Please try again.");
      }

      const data = await response.json();
      setWeather({
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        condition: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      });
    } catch (err) {
      toast.error(err.message, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim() !== "") {
      fetchWeather();
    } else {
      toast.warning("Please enter a city name!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="pt-[50px]">
      <ToastContainer />

      <div className="shadow-[2px_2px_10px_rgba(255,255,255,0.3),_0_5px_10px_#38f8b6] text-center max-w-[600px] mx-auto p-5">
        <h2 className="text-3xl uppercase font-semibold text-[#43ea87] text-center mb-4">
          Get Weather
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center md:flex-row flex-col"
        >
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city or location"
            className="w-[60%] p-4 bg-gray-300 outline-none"
          />
          <button
            type="submit"
            className="bg-transparent rounded-br-[10px] text-[#43ea87] font-semibold p-4 border-r border-t border-b border-[#43ea87] transition"
          >
            Get Weather
          </button>
        </form>

        {/* Loading Message */}
        {loading && (
          <div className="flex flex-col justify-center items-center gap-5 mt-10">
            <ClipLoader size={50} loading={loading} color="#43ea87" />
            <p className="text-white">{`Fetching ${location} weather...`}</p>
          </div>
        )}

        {/* Weather Display */}
        {weather && (
          <div className="mt-3 p-4 rounded-lg text-center">
            <div className="flex items-center flex-col font-semibold text-[20px] text-gray-300">
              <h3 className="uppercase">{location}</h3>
              <img
                src={weather.icon}
                alt="Weather Icon"
                className="mx-auto w-32 h-32"
              />
              <div className="flex items-center gap-2">
                Condition: <span className="text-3xl">{weather.condition}</span>
              </div>
              <div className="flex items-center gap-2">
                Temperature:{" "}
                <span className="text-3xl">
                  {Math.round(weather.temperature)}°C
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="bg-white p-4 rounded-md">
                <p className="text-gray-600">
                  Feels Like: {Math.round(weather.feelsLike)}°C
                </p>
              </div>
              <div className="bg-white p-4 rounded-md">
                <p className="text-gray-600">
                  Humidity: {Math.round(weather.humidity)}%
                </p>
              </div>
              <div className="bg-white p-4 rounded-md">
                <p className="text-gray-600">
                  Wind Speed: {Math.round(weather.windSpeed)} m/s
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentWeather;

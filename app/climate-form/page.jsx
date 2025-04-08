'use client'
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the toast styles
import { ClipLoader } from "react-spinners";  // For loading spinner

const Home = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return;

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/weather?location=${location}`);
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        setWeatherData(null);
        setPrediction(null);
      } else {
        setWeatherData(data.currentWeather);
        const predictionRes = await fetch("http://localhost:5000/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.currentWeather),
        });
        const predictionData = await predictionRes.json();
        setPrediction(predictionData.prediction);
        toast.success("Weather prediction fetched successfully!");
      }
    } catch (err) {
      toast.error("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-[2px_2px_10px_rgba(255,255,255,0.3),_0_5px_10px_#38f8b6] text-center max-w-[600px] mx-auto p-5">
      <h1 className="text-3xl uppercase font-semibold text-[#43ea87] text-center mb-4">Weather Prediction</h1>
      <form onSubmit={handleSubmit} className="flex items-center justify-center md:flex-row flex-col">
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
          Get Weather Prediction
        </button>
      </form>

      {loading && (
        <div className="flex justify-center items-center mt-4">
          <ClipLoader size={40} color="#43ea87" loading={loading} />
        </div>
      )}

      {weatherData && (
        <div className="text-white text-3xl">
          <h3>Current Weather</h3>
          <p>Temperature: {weatherData.temp}°C</p>
          <p>Feels Like: {weatherData.feelsLike}°C</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Cloud Condition: {weatherData.cloudiness}%</p>
          <p>Description: {weatherData.description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.icon}.png`}
            alt="Weather icon"
            className="weather-icon"
          />
        </div>
      )}

      {prediction && (
        <div className="text-3xl text-white">
          <h3>Predicted Weather</h3>
          <p>{prediction}</p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Home;
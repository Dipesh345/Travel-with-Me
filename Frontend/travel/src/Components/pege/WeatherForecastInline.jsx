import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherForecastInline = ({ city }) => {
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const getTempIcon = (tempC) => {
    if (tempC < 10) return "🥶";
    if (tempC < 25) return "🌤️";
    return "🔥";
  };

  const toCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/weather/", {
          city: city.trim(),
        });
        setForecast(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch weather.");
      } finally {
        setLoading(false);
      }
    };

    if (city?.trim()) fetchForecast();
  }, [city]);

  if (!city) return null;

  return (
    <div className="my-5">
      <h4>🌦️ Weather Forecast for {city}</h4>
      {loading ? (
        <p>Loading forecast...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="d-flex flex-wrap gap-3">
          {forecast?.forecasts?.slice(0, 3).map((item, i) => {
            const tempC = parseFloat(toCelsius(item.temp));
            return (
              <div key={i} className="card p-3" style={{ minWidth: "200px" }}>
                <h6>{item.datetime}</h6>
                <p>
                  {getTempIcon(tempC)} {tempC}°C
                </p>
                <p>{item.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WeatherForecastInline;

import React, { useState } from "react";
import axios from "axios";

export default function WeatherForecast() {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setForecast(null);

    if (!city.trim()) {
      setError("Please enter a city.");
      return;
    }

    setLoading(true);
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

  const getTempIcon = (tempC) => {
    if (tempC < 10) return "🥶";
    if (tempC < 25) return "🌤️";
    return "🔥";
  };

  const toCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

  return (
    <div className="container my-5" style={{ maxWidth: "900px" }}>
      <h2 className="text-center mb-4">🌦️ Weather Forecast</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Get Forecast"}
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {forecast && (
        <>
          <h4 className="text-center mt-4">
            📍 {forecast.city}, {forecast.country}
          </h4>

          <div
            className="d-flex flex-row overflow-auto mt-4 pb-2"
            style={{ gap: "1rem", scrollSnapType: "x mandatory" }}
          >
            {forecast.forecasts.slice(0, 10).map((item, index) => {
              const tempC = parseFloat(toCelsius(item.temp));
              const tempMin = toCelsius(item.temp_min);
              const tempMax = toCelsius(item.temp_max);
              const icon = getTempIcon(tempC);

              return (
                <div
                  key={index}
                  className="card shadow-sm border-0"
                  style={{
                    minWidth: "220px",
                    scrollSnapAlign: "start",
                    flexShrink: 0,
                  }}
                >
                  <div className="card-body">
                    <h6 className="card-title mb-2 text-muted">{item.datetime}</h6>
                    <p className="mb-1">
                      <strong>Temp:</strong> {icon} {tempC}°C
                    </p>
                    <p className="mb-1">
                      <strong>Min/Max:</strong> {tempMin}°C / {tempMax}°C
                    </p>
                    <p className="mb-1 text-capitalize">
                      <strong>Condition:</strong> {item.description}
                    </p>
                    <p className="mb-1">
                      <strong>Humidity:</strong> {item.humidity}%
                    </p>
                    <p className="mb-0">
                      <strong>Wind:</strong> {item.wind_speed} m/s
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

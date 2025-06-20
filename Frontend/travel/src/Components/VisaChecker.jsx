import React, { useState } from "react";
import axios from "axios";

export default function VisaChecker() {
  const [nationality, setNationality] = useState("");
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Explanation about ISO codes
  const isoHelp = (
    <small className="form-text text-muted">
      Use <strong>ISO 3166-1 alpha-2 country codes</strong> (e.g. "NP" for Nepal, "SG" for Singapore).
      <br />
      <a
        href="https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes"
        target="_blank"
        rel="noreferrer"
      >
        See full list here
      </a>
    </small>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!nationality || !destination) {
      setError("Please fill in both nationality and destination.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/visa-checker/", {
        nationality: nationality.toUpperCase().trim(),
        destination: destination.toUpperCase().trim(),
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch visa info.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: 600 }}>
      <h2 className="mb-4 text-center">Visa Checker</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nationality" className="form-label">
            Your Nationality (ISO code)
          </label>
          <input
            id="nationality"
            type="text"
            className="form-control"
            placeholder="E.g. NP"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            maxLength={2}
            required
          />
          {isoHelp}
        </div>

        <div className="mb-3">
          <label htmlFor="destination" className="form-label">
            Destination Country (ISO code)
          </label>
          <input
            id="destination"
            type="text"
            className="form-control"
            placeholder="E.g. SG"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            maxLength={2}
            required
          />
          {isoHelp}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Visa"}
        </button>
      </form>

      {result && (
        <div className="card mt-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">
              Visa Info from{" "}
              <span className="text-primary">{result.passport.name} ({result.passport.code})</span>{" "}
              to{" "}
              <span className="text-primary">{result.destination.name} ({result.destination.code})</span>
            </h5>

            <p>
              <strong>Visa Category: </strong> {result.category.name} ({result.category.code})
            </p>
            <p>
              <strong>Duration Allowed: </strong> {result.dur} days
            </p>
            <p>
              <small className="text-muted">
                Last Updated: {new Date(result.last_updated).toLocaleDateString()}
              </small>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

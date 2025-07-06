import React, { useEffect, useState } from "react";
import axios from "axios";

const VisaCheckerInline = ({ nationality, destination }) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      !nationality ||
      !destination ||
      nationality.length !== 2 ||
      destination.length !== 2
    ) {
      setResult(null);
      setError("");
      return;
    }

    const fetchVisaInfo = async () => {
      setLoading(true);
      setError("");
      setResult(null);
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

    fetchVisaInfo();
  }, [nationality, destination]);

  if (!nationality || !destination) return null;

  return (
    <div className="my-5">
      <h4>🛂 Visa Checker</h4>
      {loading ? (
        <p>Checking visa info...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : result ? (
        <div className="card p-3">
          <h6>
            {result.passport.name} ({result.passport.code}) → {result.destination.name} (
            {result.destination.code})
          </h6>
          <p>
            <strong>Visa Type:</strong> {result.category.name} ({result.category.code})
          </p>
          {result.category.code === "VF" && (
            <p>
              <strong>Allowed Duration:</strong> {result.dur} days
            </p>
          )}
          <small className="text-muted">
            Last Updated: {new Date(result.last_updated).toLocaleDateString()}
          </small>
        </div>
      ) : (
        <p>No visa information available.</p>
      )}
    </div>
  );
};

export default VisaCheckerInline;

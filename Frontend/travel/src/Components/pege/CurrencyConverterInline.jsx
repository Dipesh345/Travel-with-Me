import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CurrencyConverterInline({ fromCurrency, toCurrency }) {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fromCurr = fromCurrency || "USD";
  const toCurr = toCurrency || "USD";

  const handleConvert = async () => {
    setError(null);
    setResult(null);
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/exchange-rate/",
        {
          amount,
          from_currency: fromCurr,
          to_currency: toCurr,
        }
      );
      setResult(response.data.result);
    } catch (err) {
      setError(err.response?.data?.error || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        marginTop: "2rem",
        maxWidth: "320px",
      }}
    >
      <h3>Currency Converter</h3>
      <p>
        From: <strong>{fromCurr}</strong> &nbsp;→&nbsp; To: <strong>{toCurr}</strong>
      </p>
      <input
        type="number"
        placeholder={`Amount in ${fromCurr}`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <button
        onClick={handleConvert}
        disabled={loading}
        style={{ marginTop: "0.5rem", width: "100%" }}
      >
        {loading ? "Converting..." : "Convert"}
      </button>

      {result !== null && (
        <p style={{ marginTop: "1rem" }}>
          Result: <strong>{result}</strong> {toCurr}
        </p>
      )}
      {error && <p style={{ marginTop: "1rem", color: "red" }}>{error}</p>}
    </div>
  );
}

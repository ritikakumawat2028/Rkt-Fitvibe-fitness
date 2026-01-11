import React from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  { name: "Strength Training", description: "Build muscle and strength", price: "₹2,999/month" },
  { name: "Yoga & Flexibility", description: "Improve mobility and mindfulness", price: "₹1,999/month" },
  { name: "HIIT Training", description: "Burn fat fast with intervals", price: "₹2,499/month" },
];

const FitnessPlan = () => {
  const navigate = useNavigate();
  const onSelect = (planName) => {
    // Persist chosen plan locally; enrollment will happen after trainer is selected
    localStorage.setItem("selectedPlan", planName);
    navigate("/trainers");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Select your program</h2>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {plans.map((p) => (
          <div key={p.name} style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <strong>{p.price}</strong>
            <div>
              <button onClick={() => onSelect(p.name)} style={{ marginTop: 8 }}>Choose</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FitnessPlan;
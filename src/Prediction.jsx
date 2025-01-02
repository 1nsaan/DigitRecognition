import React from "react";

const Prediction = ({ prediction, confidence }) => {
  return (
    prediction !== null && (
      <div>
        <h2>Prediction: {prediction}</h2>
        <h3>Confidence: {(confidence * 100).toFixed(2)}%</h3>
      </div>
    )
  );
};

export default Prediction;

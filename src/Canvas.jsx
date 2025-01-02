import React, { useRef, useEffect } from "react";

const Canvas = ({
  onStartDrawing,
  onDraw,
  onStopDrawing,
  onClear,
  onPredict,
  canvasWidth,
  canvasHeight,
  canvasBackgroundColor,
  prediction,
  confidence,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas background color
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }, [canvasWidth, canvasHeight, canvasBackgroundColor]);

  return (
    <div style={styles.canvasWrapper}>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={canvasWidth}
        height={canvasHeight}
        style={styles.canvas}
        onMouseDown={onStartDrawing}
        onMouseMove={onDraw}
        onMouseUp={onStopDrawing}
        onMouseLeave={onStopDrawing}
      />
      <div style={styles.buttonContainer}>
        <button onClick={onClear} style={styles.button}>
          Clear
        </button>
        <button onClick={onPredict} style={styles.button}>
          Predict
        </button>
      </div>
      {prediction !== null && (
        <div style={styles.result}>
          <h2>Prediction: {prediction}</h2>
          <h3>Confidence: {(confidence * 100).toFixed(2)}%</h3>
        </div>
      )}
    </div>
  );
};

const styles = {
  canvasWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  canvas: {
    border: "1px solid black",
    marginBottom: "20px",
    backgroundColor: "black",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
  result: {
    textAlign: "center",
    marginTop: "20px",
  },
};

export default Canvas;

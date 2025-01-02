import React, { useState, useEffect, useRef } from "react";
import Canvas from "./Canvas";


const DigitRecognition = () => {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const canvasWidth = 300; 
  const canvasHeight = 300; 
  const canvasBackgroundColor = "black";

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("tfjs_models/model.json");
        setModel(loadedModel);
        console.log("Model loaded successfully");
      } catch (error) {
        console.error("Error loading the model:", error);
      }
    };

    loadModel();
  }, []);

  const preprocessCanvas = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

 
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

   
    const grayImage = tf.tidy(() => {
      const imgTensor = tf.browser.fromPixels(imageData, 1); // 1 for grayscale
      const resized = tf.image.resizeBilinear(imgTensor, [28, 28]); // Resize to 28x28
      const normalized = resized.div(255.0); // Normalize to [0, 1]
      const batched = normalized.expandDims(0); // Add batch dimension
      return batched;
    });

    return grayImage;
  };

  const handlePredict = async () => {
    if (!model) {
      alert("Model is not loaded yet. Please wait.");
      return;
    }

    const processedImage = preprocessCanvas();
    const predictions = model.predict(processedImage);
    const predictionArray = predictions.dataSync();

    // Find the highest confidence and corresponding digit
    const maxConfidence = Math.max(...predictionArray);
    const predictedDigit = predictionArray.indexOf(maxConfidence);

    setPrediction(predictedDigit);
    setConfidence(maxConfidence);
    tf.dispose(processedImage); // Clean up tensor memory
  };

  const clearCanvas = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    setPrediction(null);
    setConfidence(null);
  };

  const startDrawing = (e) => {
    const canvas = e.target;
    const ctx = canvas.getContext("2d");
    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = e.target;
    const ctx = canvas.getContext("2d");

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
  };

  const isDrawing = useRef(false);

  return (
    <div style={styles.container}>
      <h1>Handwritten Digit Recognition</h1>
      <Canvas
        onStartDrawing={startDrawing}
        onDraw={draw}
        onStopDrawing={stopDrawing}
        onClear={clearCanvas}
        onPredict={handlePredict}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        canvasBackgroundColor={canvasBackgroundColor}
        prediction={prediction}
        confidence={confidence}
      />
    </div>
  );
};
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f9",
    fontFamily: "'Roboto', sans-serif",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
};
export default DigitRecognition;
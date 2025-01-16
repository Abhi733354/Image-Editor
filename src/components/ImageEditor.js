import React, { useEffect, useRef } from "react";
import { Canvas, Circle, Rect, Triangle, Textbox, FabricImage } from "fabric";

const ImageEditor = ({ imageUrl }) => {
  const canvasRef = useRef(null);
  const isCanvasInitialized = useRef(false);

  useEffect(() => {
    if (isCanvasInitialized.current && canvasRef.current) {
      canvasRef.current.dispose();
    }

    const canvas = new Canvas("editor-canvas", {
      width: 800,
      height: 600,
    });

    FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" })
      .then((img) => {
        img.scaleToWidth(800);
        img.set({
          left: 0,
          top: 0,
          selectable: false,
        });
        canvas.add(img);
        canvas.renderAll();
      })
      .catch((error) => {
        console.error("Error loading image:", error);
      });

    canvasRef.current = canvas;
    isCanvasInitialized.current = true;

    return () => {
      if (canvasRef.current) {
        canvasRef.current.dispose();
      }
      isCanvasInitialized.current = false;
    };
  }, [imageUrl]);

  const addText = () => {
    const text = new Textbox("Your Text", {
      left: 50,
      top: 50,
      width: 200,
    });
    canvasRef.current.add(text);
    canvasRef.current.renderAll();
  };

  const addShape = (shape) => {
    let shapeObj;
    switch (shape) {
      case "circle":
        shapeObj = new Circle({
          radius: 50,
          fill: "blue",
          left: 100,
          top: 100,
        });
        break;
      case "rectangle":
        shapeObj = new Rect({
          width: 100,
          height: 50,
          fill: "red",
          left: 150,
          top: 150,
        });
        break;
      case "triangle":
        shapeObj = new Triangle({
          width: 100,
          height: 100,
          fill: "green",
          left: 200,
          top: 200,
        });
        break;
      default:
        break;
    }
    if (shapeObj) {
      canvasRef.current.add(shapeObj);
      canvasRef.current.renderAll();
    }
  };

  const downloadImage = () => {
    const dataURL = canvasRef.current.toDataURL({
      format: "png",
      quality: 1.0,
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "edited-image.png";
    link.click();
  };

  return (
    <div className="container-fluid mt-4 p-4 border rounded">
        <div className="col-12 col-md-12 col-lg-12 text-center mb-4">
          <div className="d-flex flex-wrap justify-content-center justify-content-center gap-2">
            <button className="btn btn-primary" onClick={addText}>
              Add Text
            </button>
            <button
              className="btn btn-success"
              onClick={() => addShape("circle")}
            >
              Add Circle
            </button>
            <button
              className="btn btn-danger"
              onClick={() => addShape("rectangle")}
            >
              Add Rectangle
            </button>
            <button
              className="btn btn-warning"
              onClick={() => addShape("triangle")}
            >
              Add Triangle
            </button>
            <button className="btn btn-info" onClick={downloadImage}>
              Download Image
            </button>
          </div>
        </div>

        <div className="col-12 col-md-12 col-lg-12">
          <div
            className="canvas-container mx-auto border shadow rounded"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "800px",
              overflow: "hidden",
            }}
          >
            <canvas
              id="editor-canvas"
              style={{
                width: "100%",
                height: "auto",
              }}
            ></canvas>
          </div>
        </div>
      </div>
 
  );
};

export default ImageEditor;

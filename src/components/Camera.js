import { useDispatch, useSelector } from "react-redux";
import {
  getActiveTab,
  getCameraStatus,
  getIsFlashing,
  setCameraStatus,
  setAuthError,
  setIsFlashing,
  setScreenshot,
} from "../features/auth/authSlice";
import Webcam from "react-webcam";
import "../css/Camera.css";
import { useEffect, useRef, useState } from "react";
import { Preview } from "./Preview";
import * as faceapi from "face-api.js";
import {
  getFacenetMessage,
  getOutline,
  setFacenetMessage,
  setOutline,
} from "../features/auth/facenetSlice";

import { Typography } from "@mui/material";


export const Camera = () => {
  var camera = false;
  const dispatch = useDispatch();
  const isFlashing = useSelector(getIsFlashing);
  const cameraStatus = useSelector(getCameraStatus);
  const activeTab = useSelector(getActiveTab);
  const message = useSelector(getFacenetMessage);
  const outline = useSelector(getOutline);
  const webcamRef = useRef();
  const containerRef = useRef();
  const canvasRef = useRef();
  const detection = useRef();

  // State to hold the response message
  const [responseMessage, setResponseMessage] = useState("");

  const takeScreenshot = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    dispatch(setCameraStatus("closed"));
    dispatch(setScreenshot(screenshot));
    dispatch(setIsFlashing(true));
  
    if (camera === true) {
      const formData = new FormData();
  
      formData.append("photo", dataURLtoFile(screenshot, "photo.jpg"));
  
      try {
        const apiKey = process.env.REACT_APP_API_KEY;
        const response = await fetch(
          `${apiKey}`,
          {
            method: "POST",
            body: formData,
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to upload image", response);
        }
  
        const data = await response.json();
       
  
     
        setResponseMessage(`${data.name}`);
  
    
        // if(data.name !== 'unknown') {
        //   window.location.href = "https://uztelecom.uz/"; 
        // }
        // else{
          
        // }
      } catch (error) {
        console.error("Error uploading image:", error);
        setResponseMessage("An error occurred while uploading the image.");
      }
    }
  };
  

  // Helper function to convert base64 to file
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleCameraError = () => {
    dispatch(setCameraStatus("closed"));
    const err = {};
    err[activeTab] = {
      serverErr:
        "There was a problem accessing the WEBCAM. Grant permission and reload the page.",
    };
    dispatch(setAuthError(err));
  };

  const handleStreamVideo = async (e) => {
    const err = {};
    err[activeTab] = { serverErr: null };
    dispatch(setAuthError(err));
  
    await faceapi.nets.tinyFaceDetector.loadFromUri(
      "facenet/models/tiny_face_detector"
    );
  
    let counter = 0;
    let countdownStart = 3; // countdown from 4 seconds
    let detectedFace = false; // track continuous detection
  
    detection.current = setInterval(async () => {
      
      const faces = await faceapi.detectAllFaces(
        webcamRef.current.video,
        new faceapi.TinyFaceDetectorOptions()
      );
  
      if (faces.length === 1 && faces[0].score > 0.75) {
        camera = true;
        if (!detectedFace) {
          detectedFace = true; 
        }
  
        counter++;
        let remainingTime = countdownStart - Math.floor(counter / 10);
        dispatch(setOutline("#00ff00"));
        dispatch(
          setFacenetMessage(
            "Stand still for " + remainingTime + " seconds."
          )
        );
  
        if (remainingTime <= 0) {
          takeScreenshot();
          clearInterval(detection.current); // Stop the interval after taking the screenshot
        }
      } else {
        detectedFace = false; // reset if the face is not detected
        counter = 0;
        dispatch(setOutline("#f00000"));
        dispatch(setFacenetMessage("Place the face in the oval."));
      }
    }, 100);
  };
  
  

  useEffect(() => {
    return () => {
      clearInterval(detection.current);
    };
  }, [cameraStatus]);

  return (
    <div
      className="camera-container"
      style={{ backgroundImage: 'url("/images/camera.jpg")' }}
      ref={containerRef}
    >
      {cameraStatus === "opened" && (
        <>
          <Webcam
            className="camera-video"
            id="webcam"
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
            width={'100%'}
            height={'50%'}
            mirrored={true}
            videoConstraints={{ facingMode: "user" }}
            onUserMedia={(e) => handleStreamVideo(e)}
            onUserMediaError={handleCameraError}
          />
          <canvas id="camera-canvas" ref={canvasRef}>
            Your browser does not support the HTML canvas tag.
          </canvas>
          <div className="camera-face-overlay" style={{ borderColor: outline }}>
            <div className="camera-face-message">{message}</div>
          </div>
        </>
      )}
      <Preview containerRef={containerRef} />
      <div
        className="camera-flash"
        style={{
          animation: isFlashing && "flashAnimation 750ms ease-out",
        }}
        onAnimationEnd={() => dispatch(setIsFlashing(false))}
      />
      {responseMessage && <Typography sx={{ fontSize: '20px', color: 'white', padding:'10px'}}>{responseMessage === 'unknown' ? `Rasm mos kelmadi:  ${responseMessage}`: `Rasm mos keldi: ${responseMessage}`}</Typography>}
    </div>
  );
};



import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Typography from '@mui/material/Typography';
import { getCameraStatus, getScreenshot, setCameraStatus, setScreenshot, getActiveSource } from "../features/auth/authSlice";
import { setFacenetMessage, setOutline } from "../features/auth/facenetSlice";

const AddPerson = () => {
    const dispatch = useDispatch();
    const cameraStatus = useSelector(getCameraStatus);
    const screenshot = useSelector(getScreenshot);
    const activeSource = useSelector(getActiveSource);

    // New state for API response message and alert text
    const [apiResponse, setApiResponse] = useState('');
    const [alertText, setAlertText] = useState('');

    const handleCameraOpening = () => {
        dispatch(setCameraStatus('opened'));
        dispatch(setScreenshot(null));
        dispatch(setOutline('#ddd'));
        dispatch(setFacenetMessage('Place the face in the oval.'));
    };

    const handleCameraClosing = () => {
        dispatch(setCameraStatus('closed'));
        dispatch(setScreenshot(null));
        dispatch(setOutline('#ddd'));
        dispatch(setFacenetMessage('Place the face in the oval.'));
    };

    const handleOpenCameraClick = () => {
        // Show prompt to get the description and open the camera
        const text = window.prompt("Ismingizni kiriting: ");
        if (text) {
            setAlertText(text); // Save the description
            handleCameraOpening();
        }
    };

    const captureImage = () => {
        // Logic to capture the image and set it to the screenshot state
        const image = "captured-image"; // Replace with actual image capture logic
        dispatch(setScreenshot(image));

        // After capturing the image, send it to the API along with the alert text
        sendImageToApi(image, alertText);
    };

    const sendImageToApi = (image, description) => {
        const apiKey = 'https://pulse.yasharhtml.xyz/api/add-person/';
        // Logic to send the image and description to the API
        fetch('https://pulse.yasharhtml.xyz/api/add-person/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // Add authorization header if required
            },
            body: JSON.stringify({ image, description }), // Send both image and description
        })
        .then(response => response.json())
        .then(data => {
            console.log('Image uploaded successfully:', data);
            // Update the API response state
            console.log(data)
            setApiResponse('Image uploaded successfully!');
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            // Update the API response state
            setApiResponse('Error uploading image.');
            console.log(error);
        });
    };

    return (
        <div className="wrap-input100-image">
            <Typography>Add Person</Typography>
            {
                activeSource === 'webcam' &&
                <button
                    type="button"
                    className="zoom-out"
                    onClick={() => {
                        if (cameraStatus === 'closed') {
                            handleOpenCameraClick();
                        } else if (screenshot != null) {
                            captureImage();
                        } else {
                            handleCameraClosing();
                        }
                    }}
                >
                    {screenshot != null ? 'Capture new image' : (cameraStatus === 'opened' ? 'Close Camera' : 'Open Camera')}
                </button>
            }
            {/* Display API response message */}
            {apiResponse && <Typography variant="body2">{apiResponse}</Typography>}
        </div>
    );
};

export default AddPerson;

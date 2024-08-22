import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCameraStatus, getScreenshot, setCameraStatus, setScreenshot,  getActiveSource, } from "../features/auth/authSlice"
import { setFacenetMessage, setOutline } from "../features/auth/facenetSlice"

export const PictureControls = () => {

    const dispatch = useDispatch()
    const cameraStatus = useSelector(getCameraStatus)
    const screenshot = useSelector(getScreenshot)
    const activeSource = useSelector(getActiveSource)



    const handleCameraClosing = () => {
        dispatch(setCameraStatus('closed'))
        dispatch(setScreenshot(null))
        dispatch(setOutline('#ddd'))
        dispatch(setFacenetMessage('Place the face in the oval.'))
    }

    const handleCameraOpening = () => {
        dispatch(setCameraStatus('opened'))
        dispatch(setScreenshot(null))
        dispatch(setOutline('#ddd'))
        dispatch(setFacenetMessage('Place the face in the oval.'))
    }





    return(
        <>
        <span className="wrap-image-label">Capture face image</span>
        <div className="wrap-input100-image">
           
            {
                activeSource === 'webcam' &&
                <button
                    type="button"
                    className="zoom-out"
                    onClick={() => cameraStatus === 'closed' ? handleCameraOpening() : handleCameraClosing()}
                >{screenshot != null ? 'Capture new image' : (cameraStatus === 'opened' ? 'Close Camera' : 'Open Camera')}</button>
            }
            
        </div>
        </>
    )
}
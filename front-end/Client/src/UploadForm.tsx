import { ChangeEvent, useState } from "react"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Detection, detectObjects, getProcessedVideo, uploadFile } from "./services/apiService";


interface UploadFileProps {
    videoFile: File | null
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
    onVideoProcessed: (inProcess: boolean) => void
    onVideoOutput: (video: string) => void
    onLastDetections: (detections: Detection[] | null) => void
    inProcess: boolean

}

const UploadForm = ({ videoFile,
    onFileChange,
    onVideoProcessed,
    onVideoOutput,
    onLastDetections,
    inProcess }: UploadFileProps) => {


    const [confidence, setConfidence] = useState<number>(0.7)
    const [iou, setIOU] = useState<number>(0.5)


    const handleConfidenceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const confidenceValue = parseFloat(event.target.value)
        if (isNaN(confidenceValue) || confidenceValue < 0 || confidenceValue > 1) return
        setConfidence(confidenceValue)
        console.log(confidenceValue)
    }

    const handleIOUChange = (event: ChangeEvent<HTMLInputElement>) => {
        const iouValue = parseFloat(event.target.value)
        if (isNaN(iouValue) || iouValue < 0 || iouValue > 1) return
        setIOU(iouValue)
        console.log(iouValue)
    }


    const getLastDetections = async () => {

        try {

            const getLastDeteectionsResponse = await axios.get(`http://localhost:8080/detections`)

            toast.success('success in get the video')

            onVideoProcessed(false)
            if (getLastDeteectionsResponse.data) {
                onLastDetections(getLastDeteectionsResponse.data)
            }

        } catch (error) {
            onVideoProcessed(false)
            toast.error("Error getting the video:" + error)
            throw error

        }
    }

    const handleUpload = async () => {
        try {
            if (!videoFile) return
            onVideoProcessed(true)
            const uploadedVideoPath = await uploadFile(videoFile, confidence, iou)
            if (!uploadedVideoPath) return
            const processedVideoPath = await detectObjects(uploadedVideoPath, confidence, iou)
            if (!processedVideoPath) return
            const videoBlobURL = await getProcessedVideo(processedVideoPath)
            onVideoOutput(videoBlobURL);
            await getLastDetections()
            onVideoProcessed(false)

        } catch (error) {
            onVideoProcessed(false)
            toast.error('Error fetching video: ' + error);

        }
    }


    return (
        <div className="flex place-content-center gap-3 mt-3" >

            <div className="grid grid-cols-4 gap-x-3 min-w-40  w-full">
                <Label className="">Choose the video</Label>
                <Label className="">Confidence</Label>
                <Label className="col-span-2">IOU</Label>
                <Input
                    type="file"
                    onChange={onFileChange}
                    required
                />
                <Input
                    type="number"
                    placeholder="confidence"
                    value={confidence}
                    onChange={handleConfidenceChange}
                    required
                />
                <Input
                    type="number"
                    placeholder="iou"
                    value={iou}
                    onChange={handleIOUChange}
                    required
                />
                <Button onClick={handleUpload} disabled={inProcess} >Detect Objects</Button>
            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    )

}

export default UploadForm
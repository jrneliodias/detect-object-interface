import { ChangeEvent, useState } from "react"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Detection } from "./App";


interface UploadFileProps {
    videoFile: File | null
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
    onUpload: () => void
    onVideoProcessed: (inProcess: boolean) => void
    onVideoOutput: (video: string) => void
    onLastDetections: (detections: Detection[] | null) => void
    inProcess: boolean

}

const UploadForm = ({ videoFile,
    onFileChange,
    onUpload,
    onVideoProcessed,
    onVideoOutput,
    onLastDetections,
    inProcess }: UploadFileProps) => {


    const [confidence, setConfidence] = useState<number | undefined>(0.7)
    const [iou, setIOU] = useState<number | undefined>(0.5)


    const handleConfidenceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const confidenceValue = parseFloat(event.target.value)
        if (isNaN(confidenceValue)) return
        setConfidence(confidenceValue)
        console.log(confidenceValue)
    }

    const handleIOUChange = (event: ChangeEvent<HTMLInputElement>) => {
        const iouValue = parseFloat(event.target.value)
        if (isNaN(iouValue)) return
        setIOU(iouValue)
        console.log(iouValue)
    }

    const uploadFile = async () => {

        try {
            onVideoProcessed(true)
            if (!videoFile || !confidence || !iou) return
            const formData = new FormData();
            formData.append('video', videoFile)

            onUpload()
            const uploadResponse = await axios.post('http://localhost:8080/upload', formData)

            toast.success(uploadResponse.data.message)
            const video_path = uploadResponse.data.video_path
            return video_path


        } catch (error) {
            onVideoProcessed(false)
            toast.error("Error uploading file:" + error)
            throw error

        }
    }

    const detectObjects = async (video_path: string) => {

        try {
            if (!confidence || !iou) return

            const processVideoResponse = await axios.post('http://localhost:8080/detect', {
                video_path: video_path,
                iou: iou.toString(),
                confidence: confidence.toString()
            })
            const processed_video_path = processVideoResponse.data.processed_video_path

            toast.success(processVideoResponse.data.message)
            return processed_video_path



        } catch (error) {
            onVideoProcessed(false)
            toast.error("Error processing the video:" + error)
            throw error

        }
    }
    const getProcessedVideo = async (processed_video_path: string) => {

        try {

            const getProcessVideoResponse = await axios.get(`http://localhost:8080/get-video/${processed_video_path}`, {
                headers: {
                    Accept: 'video/mp4;charset=UTF-8'
                },
                responseType: 'blob'
            })
            if (!(getProcessVideoResponse.data instanceof Blob)) {
                throw new Error('Response data is not of type Blob');
            }

            const videoBlobURL = URL.createObjectURL(new Blob([getProcessVideoResponse.data], { type: "video/mp4" }));


            onVideoOutput(videoBlobURL)



        } catch (error) {
            onVideoProcessed(false)
            toast.error("Error getting the video:" + error)
            throw error

        }
    }
    const getLastDetections = async () => {

        try {

            const getLastDeteectionsResponse = await axios.get(`http://localhost:8080/get-detections`)

            console.log(getLastDeteectionsResponse.data)
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

            const uploadedVideoPath = await uploadFile()
            const processedVideoPath = await detectObjects(uploadedVideoPath)
            await getProcessedVideo(processedVideoPath)
            await getLastDetections()

        } catch (error) {
            console.error('Error fetching video:', error);

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
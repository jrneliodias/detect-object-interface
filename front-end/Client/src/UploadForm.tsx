import { ChangeEvent, useState } from "react"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UploadFileProps {
    videoFile: File | null
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
    onUpload: () => void
    onVideoProcessed: () => void

}

const UploadForm = ({ videoFile, onFileChange, onUpload, onVideoProcessed }: UploadFileProps) => {

    const [outputVideo, setOutputVideo] = useState<string | null>(null);

    const uploadFile = async () => {

        try {
            if (!videoFile) return
            const formData = new FormData();
            formData.append('video', videoFile)
            onUpload()
            const uploadResponse = await axios.post('http://localhost:8080/upload', formData)

            if (uploadResponse.status === 200) {
                onVideoProcessed()
            }
            toast.success(uploadResponse.data.message)
            const video_path = uploadResponse.data.video_path
            console.log(video_path)
            return video_path


        } catch (error) {
            toast.error("Error uploading file:" + error)
            throw error

        }
    }

    const detectObjects = async (video_path: string) => {

        try {

            const processVideoResponse = await axios.post('http://localhost:8080/detect', {
                video_path: video_path
            })
            const processed_video_path = processVideoResponse.data.processed_video_path
            console.log(processed_video_path)

            toast.success(processVideoResponse.data.message)
            return processed_video_path



        } catch (error) {
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
            toast.success('success in get the video')
            setOutputVideo(videoBlobURL)


        } catch (error) {
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

        } catch (error) {
            console.error('Error fetching video:', error);

        }
    }


    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100px", placeContent: "center space-between", marginTop: "20px" }}>
            <input type="file" onChange={onFileChange} />
            <button onClick={handleUpload}>Upload</button>

            {outputVideo && (
                <div>
                    <h2>Video</h2>
                    {/* Use the videoBlob to display the video */}
                    <video controls>
                        <source src={outputVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
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
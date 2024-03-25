import { ChangeEvent } from "react"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UploadFileProps {
    videoFile: File | null
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
    onUpload: () => void

}

const UploadForm = ({ videoFile, onFileChange, onUpload }: UploadFileProps) => {



    const handleUpload = async () => {
        if (!videoFile) return
        const formData = new FormData();
        formData.append('video', videoFile)
        onUpload()

        try {
            const response = await await axios.post('http://localhost:8080/upload', formData)


            toast.success(response.data.message)
        } catch (error) {
            toast.error("Error uploading file:" + error)
            console.log("Error uploading file:", error)

        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100px", placeContent: "center space-between", marginTop: "20px" }}>
            <input type="file" onChange={onFileChange} />
            <button onClick={handleUpload}>Upload</button>

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
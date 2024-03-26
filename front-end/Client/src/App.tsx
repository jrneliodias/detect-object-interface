// import { useEffect, useState } from 'react'
// import axios from 'axios'
import { ChangeEvent, useState } from 'react'
import './App.css'
import UploadForm from './UploadForm'
import VideoCanvas from './components/videocanvas'

function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoURL, setVideoURL] = useState<string | undefined>(undefined);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedVideo = event.target.files[0]
      setVideoFile(selectedVideo)
      const videoObjectURL = URL.createObjectURL(selectedVideo)
      setVideoURL(videoObjectURL)
    }
  }

  const handleUpload = () => {
    if (!videoFile) return;
    console.log('Vídeo selecionado:', videoFile);
  };

  return (
    <>
      <h2>AI Object Detection</h2>
      {videoURL && <VideoCanvas videoPath={videoURL} />}



      <UploadForm videoFile={videoFile} onFileChange={handleFileChange} onUpload={handleUpload} />
    </>
  )
}

export default App
// import { useEffect, useState } from 'react'
// import axios from 'axios'
import { ChangeEvent, useState } from 'react'
import './App.css'
import UploadForm from './UploadForm'
import VideoPlayer from './components/videoplayer'

function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoURL, setVideoURL] = useState<string | undefined>(undefined);
  const [videoUploaded, setVideoUploaded] = useState<boolean>(false);
  const [outputVideo, setOutputVideo] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedVideo = event.target.files[0]
      setVideoFile(selectedVideo)
      const videoObjectURL = URL.createObjectURL(selectedVideo)
      setVideoURL(videoObjectURL)
    }
  }

  const handleVideoProcessed = () => {
    setVideoUploaded(true)
    console.log(videoUploaded)

  };
  const handleUpload = () => {
    if (!videoFile) return;


  };

  const handleVideoOutput = (videoURL: string) => {
    setOutputVideo(videoURL)
  }
  return (
    <div className='main-app'>
      <h1 className='text-2xl font-bold'>AI Object Detection</h1>

      <UploadForm videoFile={videoFile}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
        onVideoProcessed={handleVideoProcessed}
        onVideoOutput={handleVideoOutput} />

      <div className="videos-container">
        {videoURL && <VideoPlayer videoPath={videoURL} />}
        {outputVideo && <VideoPlayer videoPath={outputVideo} />}
      </div>


    </div>
  )
}

export default App
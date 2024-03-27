// import { useEffect, useState } from 'react'
// import axios from 'axios'
import { ChangeEvent, useState } from 'react'
import './App.css'
import UploadForm from './UploadForm'
import VideoPlayer from './components/videoplayer'
import DetectTable from './components/detect-table'
import { SkeletonVideo } from './components/skeleton-video'

function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoURL, setVideoURL] = useState<string | undefined>(undefined);
  const [outputVideo, setOutputVideo] = useState<string | null>(null);
  const [inProcess, setInProcess] = useState<boolean>(false)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedVideo = event.target.files[0]
      setVideoFile(selectedVideo)
      const videoObjectURL = URL.createObjectURL(selectedVideo)
      setVideoURL(videoObjectURL)
    }
  }

  const handleVideoProcessed = (inProcess: boolean) => {
    setInProcess(inProcess)

  };
  const handleUpload = () => {
    if (!videoFile) return;


  };

  const handleVideoOutput = (videoURL: string) => {
    setOutputVideo(videoURL)
  }
  return (
    <main className='w-9/12 flex flex-col mx-auto gap-5'>
      <h1 className='text-2xl font-bold'>AI Object Detection</h1>

      <UploadForm videoFile={videoFile}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
        onVideoProcessed={handleVideoProcessed}
        onVideoOutput={handleVideoOutput}
        inProcess={inProcess} />

      <div className="flex gap-5 justify-evenly">
        {videoURL && <VideoPlayer videoPath={videoURL} />}
        {inProcess && <SkeletonVideo />}
        {outputVideo && !inProcess && <VideoPlayer videoPath={outputVideo} />}
      </div>

      <DetectTable />


    </main>
  )
}

export default App
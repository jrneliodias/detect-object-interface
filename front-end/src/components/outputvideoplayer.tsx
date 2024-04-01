import { useEffect, useRef, useState } from 'react'

interface OutputVideoPlayerProps {
    videoProcessed: boolean
}
const OutputVideoPlayer = ({ videoProcessed }: OutputVideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [videoLoaded, setVideoLoaded] = useState(false);

    useEffect(() => {
        if (videoProcessed) {
            fetchVideoFromServer()
        }
    }, [videoProcessed])

    const fetchVideoFromServer = () => {
        const videoURL = 'http://localhost:8080/get-video'
        fetch(videoURL)
            .then(response => response.blob())
            .then(blob => {

                const videoObjectURL = URL.createObjectURL(blob)
                if (videoRef.current) {
                    videoRef.current.src = videoObjectURL;
                    setVideoLoaded(true)
                }
            })
            .catch(error => {
                console.log('Erro ao obter o video:', error)
            })
    }
    return (
        <div>
            {videoLoaded && (
                <div>
                    <h3>Displaying Processed Video</h3>
                    <video ref={videoRef} controls autoPlay width={'100%'}></video>
                </div>
            )}
        </div>
    )
}

export default OutputVideoPlayer
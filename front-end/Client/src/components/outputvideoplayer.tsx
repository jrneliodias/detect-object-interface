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
            <h3>Displaying Processed Video</h3>
            {videoLoaded ? (
                <video ref={videoRef} controls autoPlay></video>
            ) : (
                <p>Carregando Video...</p>
            )}
        </div>
    )
}

export default OutputVideoPlayer
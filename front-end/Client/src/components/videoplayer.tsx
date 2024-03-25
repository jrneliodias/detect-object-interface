import ReactPlayer from 'react-player'

interface videoplayerProps {
    videoPath: string | null
}

const VideoPlayer = ({ videoPath }: videoplayerProps) => {

    return (
        <div>

            {videoPath && (<ReactPlayer
                width={'100%'}
                style={{ maxWidth: '900px' }}
                url={videoPath}
                controls />)
            }
        </div>
    )
}

export default VideoPlayer
import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

interface VideoCanvasProps {
    videoPath: string | undefined;
}

const VideoCanvas = ({ videoPath }: VideoCanvasProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas>();

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Check if the canvas and video elements exist
        if (!canvas || !video) {
            return;
        }

        // Type guard to ensure getContext exists before calling it
        if (!(canvas instanceof HTMLCanvasElement)) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        // Set up Fabric.js
        const fabricCanvas = new fabric.Canvas(canvas);
        fabricCanvas.selection = false; // Disable selection

        fabricCanvasRef.current = fabricCanvas;

        // Cleanup function
        return () => {
            fabricCanvas.dispose();
        };

    }, []);


    return (
        <div className="video-canvas-container">

            <canvas ref={canvasRef} width="640" height="360"></canvas>
            <video ref={videoRef} className="video-element" controls autoPlay width="640" height="360">
                <source src={videoPath} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoCanvas;

import React, { useState } from 'react';
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';


const VideoProcessor: React.FC = () => {
    const [inputFile, setInputFile] = useState<File | null>(null);
    const [outputFile, setOutputFile] = useState<Blob | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setInputFile(file || null);
    };

    const processVideo = () => {
        if (!inputFile) return;

        const reader = new FileReader();
        reader.onload = () => {
            const inputBuffer = Buffer.from(reader.result as ArrayBuffer);
            if (!inputBuffer) {
                return
            }
            const stream = new Readable();
            stream.push(inputBuffer);
            stream.push(null);
            // Comando ffmpeg para sobrepor o retângulo em cada frame
            const command = ffmpeg(stream)
                .complexFilter([
                    {
                        filter: 'drawbox',
                        options: {
                            x: 100,
                            y: 100,
                            width: 200,
                            height: 100,
                            color: 'red',
                            t: 'fill'
                        },
                        inputs: '0:v',
                        outputs: 'overlayed_video'
                    }
                ])
            // Redireciona a saída do ffmpeg para um fluxo de gravação
            const writeStream = command.pipe();

            // Lê os dados do fluxo de gravação para obter o buffer do vídeo processado
            const chunks: Buffer[] = [];
            writeStream.on('data', (chunk: Buffer) => {
                chunks.push(chunk);
            });

            writeStream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const blob = new Blob([buffer], { type: 'video/mp4' });
                setOutputFile(blob);
            });

            // Lidar com erros
            writeStream.on('error', (err) => {
                console.error('Erro ao processar o vídeo:', err);
            });
        };
        reader.readAsArrayBuffer(inputFile);
    };

    const downloadVideo = () => {
        if (!outputFile) return;

        const url = window.URL.createObjectURL(outputFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'processed_video.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <input type="file" accept="video/mp4" onChange={handleFileChange} />
            <button onClick={processVideo}>Processar Vídeo</button>
            {outputFile && (
                <div>
                    <video controls>
                        <source src={URL.createObjectURL(outputFile)} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <button onClick={downloadVideo}>Baixar Vídeo</button>
                </div>
            )}
        </div>
    );
};

export default VideoProcessor;

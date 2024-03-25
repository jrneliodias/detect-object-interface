const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();

// Configuração do multer para upload de arquivos
const upload = multer({ dest: 'uploads/' });

// Rota para upload de vídeo
app.post('/upload', upload.single('video'), (req, res) => {
    const videoPath = req.file.path;
    const framesDir = 'frames';

    // Cria o diretório para armazenar os frames
    if (!fs.existsSync(framesDir)) {
        fs.mkdirSync(framesDir);
    }

    // Comando ffmpeg para extrair os frames do vídeo
    const cmd = `ffmpeg -i ${videoPath} ${framesDir}\\frame-%03d.jpg`;

    // Executa o comando ffmpeg
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error extracting frames');
            return;
        }

        // Lê os frames do diretório
        const frames = fs.readdirSync(framesDir);

        // Retorna os frames para o cliente
        res.json({ frames });
    });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

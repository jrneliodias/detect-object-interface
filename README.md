# Como executar o sistema

## Instalando as dependências

### Front-end (opcional pois está no docker-compose)

```bash
cd front-end
npm install
```

### Back-end

```bash
cd ai_model
python -m venv venv
venv\Scripts\Activate
pip install -r requirements.txt
```

### Utilizando docker-compose

Para o front-end e o banco de dados

```bash
docker-compose up -d
```

Depois de criar o banco de dados, essa é a string conection:

```bash
'postgresql://postgres:postgres2024@localhost/ai-detection'
```

Deve rodar a migration inicial e rodar o servidor

```bash
cd ai_model
python postgres\db\client.py
python app.py
```

### Apresentação do projeto
[Video de apresentação](https://youtu.be/caQDQw47jpM)


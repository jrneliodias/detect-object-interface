# Objects Detections AI


O sistema é dividdo em três áreas distintas: Frontend, Backend e banco de dados, cada uma desempenhando um papel fundamental no funcionamento do projeto. Vamos dar uma olhada nas tecnologias que utilizamos em cada uma delas:

No frontend, optei por:

-React com Vite para uma experiência de desenvolvimento ágil.
-Shadcn Ui para componentes visuais consistentes e modernos.
-Tailwind CSS para facilitar a estilização e o design responsivo.
-ViTest para testes automatizados e garantia de qualidade.

Para o Backend, escolhi:

- Python como linguagem principal devido à sua versatilidade e poder.
- Flask como framework web, oferecendo uma estrutura leve e flexível.
- Pytest para testes unitários e de integração, garantindo a estabilidade do sistema.
- SQL Alchemy para a comunicação eficiente com o banco de dados e manipulação de dados.
- E, é claro, YOLOv8 para a detecção de objetos com precisão e rapidez.

No banco de dados, utilizamos:

- Docker para criar ambientes isolados e facilitar a implantação.
- Postgres SQL para armazenar e gerenciar os dados de forma eficiente e confiável.
- Este projeto representou um verdadeiro desafio para mim, pois tive que lidar com diferentes tecnologias e arquiteturas, além de aprender a integrá-las de forma coesa. Desde a estruturação do frontend e do backend até a comunicação com o banco de dados, cada etapa foi uma oportunidade para aprimorar meus conhecimentos em arquitetura de software e práticas de Clean Code.

Além disso, a experiência de trabalhar com Flask para construir uma API robusta e eficiente, juntamente com a integração de um modelo de IA como uma ferramenta no processo, foi extremamente enriquecedora. Aprendi muito sobre como gerenciar erros, planejar rotas e garantir uma comunicação eficaz entre o servidor e o cliente.

Não posso deixar de mencionar minha jornada com Docker, onde adquiri habilidades para criar imagens personalizadas e gerenciar ambientes de desenvolvimento de forma eficiente, utilizando o docker-compose.


## Como executar o sistema

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


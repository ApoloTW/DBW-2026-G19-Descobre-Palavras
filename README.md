----------------------------------------------------------------------------------------------------------------
DBW-2026-G19-Descobre-Palavras

Projeto DBW 2025/2026

Grupo 19
Integrantes:

José Miguel Farinha Fernandes - 2172622

Juan Agustin Gomes Olim - 2030418

Link do protótipo do projeto:
https://safe-strain-34583542.figma.site/
------------------------------------------------------------------------------------------------------------------

Como vamos trabalhar
React (Frontend: Responsável por toda a visualização do site. Utilizar o mínimo possível de JavaScript para que o site seja leve. Criar o formulário de login. Quando o utilizador clica no botão, o React recolhe o e-mail e a password através do useState.

JavaScript (Mensageiro): A partir do React, envia os dados para o servidor Node.js.

Node.js + Express (Backend): Recebe os dados do frontend. Utiliza a biblioteca Mongoose para comunicar facilmente com o MongoDB.

MongoDB (Base de Dados): Armazena o documento do utilizador (em formato JSON), por exemplo: { "email": "user@mail.com", "password": "hash_seguro" }

Apenas serão guardados na base de dados:
Dados de login (password hash)
Imagem de perfil
Cor de fundo do site
Pontuação (com data e quantidade de palavras completadas)
Tempo gasto


Endpoints da API
| Endpoint        | Método | Descrição                        |
| --------------- | ------ | -------------------------------- |
| `/login`        | POST   | Autenticar utilizador            |
| `/register`     | POST   | Criar novo utilizador            |
| `/user/profile` | GET    | Obter avatar, cor e preferências |
| `/user/profile` | PUT    | Atualizar perfil                 |
| `/user/stats`   | GET    | Obter estatísticas do jogo       |
| `/user/stats`   | POST   | Guardar progresso/pontuação      |






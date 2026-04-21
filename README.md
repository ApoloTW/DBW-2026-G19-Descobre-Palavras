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
React-Frontend: Responsável por toda a visualização do site. Utilizar o mínimo possível de JavaScript para que o site seja leve. Criar o formulário de login. Quando o utilizador clica no botão, o React recolhe o e-mail e a password através do useState.

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


Diagramas de Sequência


Diagrama /Home  
<img width="780" height="700" alt="DiagramaHome" src="https://github.com/user-attachments/assets/a55b66aa-56f3-4fd4-aa49-b2a77426c26f" /> 
  
Diagrama /SinglePlayer  
<img width="1020" height="1390" alt="DiagramaSinglePlayer" src="https://github.com/user-attachments/assets/85129c92-0141-4399-b18c-258d49e94b5d" /> 
  
Diagrama /MultiPlayer  
<img width="1020" height="1450" alt="DiagramaMultiPlayer" src="https://github.com/user-attachments/assets/a1b2950b-52a0-4ec7-aa20-74e5dd1e802e" />  

Diagrama Play
<img width="1243" height="601" alt="Play" src="https://github.com/user-attachments/assets/1f3094dd-a0f0-4d2b-b2e1-b44adefb7a88" />

Diagrama Login
<img width="1082" height="991" alt="Login_LoginRegister" src="https://github.com/user-attachments/assets/a79e7e7f-559f-43b5-9ef8-c8590e17b60b" />

Diagrama Register
<img width="1092" height="1111" alt="Register_RegisterLogin" src="https://github.com/user-attachments/assets/186230f3-deae-4e60-b496-d846fc971eaa" />

Diagrama AboutUs
<img width="1081" height="321" alt="AboutUs" src="https://github.com/user-attachments/assets/401bd875-7970-4df3-9005-8c58d4bcd71e" />

Diagrama Perfil
<img width="1122" height="1911" alt="Perfil" src="https://github.com/user-attachments/assets/e299d2b7-01c1-4324-89ec-c0ab86844f18" />

Diagrama Ranking
<img width="1121" height="871" alt="Ranking" src="https://github.com/user-attachments/assets/20fb74da-80c2-4eaa-b03c-52b0f254e6d0" />

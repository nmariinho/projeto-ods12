# EcoDescarte - Sistema de Gerenciamento de Pontos de Coleta

## 🎯 Sobre o Projeto
Plataforma desenvolvida para apoiar o descarte consciente de resíduos, alinhada ao **ODS 12 (Consumo e Produção Responsável)** da ONU. O sistema permite localizar, cadastrar e gerenciar pontos de coleta de materiais recicláveis, incentivando práticas sustentáveis na comunidade.

## 🚀 Como rodar o projeto
1. **Backend:** Abra a pasta `backend`, instale as dependências (`npm install`) e execute: `node server.js`
2. **Frontend:** Abra a pasta `frontend`, instale as dependências (`npm install`) e execute: `npm run dev`
3. Acesse o endereço indicado no terminal (geralmente `http://localhost:5173`).

---

## 📝 Documentação da API (Swagger/OpenAPI)

### Pontos de Coleta
- **GET `/api/pontos`**
  - **Descrição:** Retorna a lista de todos os pontos de coleta cadastrados.
  - **Resposta:** `200 OK` (Array de objetos de pontos).

- **POST `/api/pontos`**
  - **Descrição:** Cadastra um novo ponto de coleta.
  - **Parâmetros de entrada:** `{ "nome": "String", "cep": "String", "endereco": "String", "tipoResiduo": "String" }`
  - **Resposta:** `201 Created` (Objeto criado).

- **PUT `/api/pontos/:id`**
  - **Descrição:** Atualiza os dados de um ponto de coleta específico pelo ID.
  - **Parâmetros de entrada:** `{ "nome": "String", "cep": "String", "endereco": "String", "tipoResiduo": "String" }`
  - **Resposta:** `200 OK` (Objeto atualizado).

- **DELETE `/api/pontos/:id`**
  - **Descrição:** Remove um ponto de coleta da base de dados.
  - **Resposta:** `204 No Content`.

### Usuários
- **POST `/api/usuarios`**
  - **Descrição:** Realiza o cadastro de um novo usuário.
- **POST `/api/usuarios/login`**
  - **Descrição:** Autentica o usuário no sistema.
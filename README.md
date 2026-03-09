# Devocionais API

API simples para **seleção de devocionais** baseada em **temas** e **sentimentos** predefinidos.  
O objetivo é fornecer um endpoint capaz de retornar devocionais apropriados de acordo com a seleção do usuário.

O desenvolvimento deste projeto tem foco na **simplicidade, escalabilidade e segurança básica para APIs REST**.

---

## 📌 Funcionalidades

- Seleção de devocionais por **tema** e **sentimento**
- Estrutura simples para expansão de novos devocionais
- API RESTful
- Proteções básicas de segurança

---

## 🛠 Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **MongoDB** (banco NoSQL)
- **Helmet** – proteção de headers HTTP
- **CORS** – controle de acesso entre origens
- **Express Rate Limit** – proteção contra abuso da API

---

## 🏗 Arquitetura

A API segue uma arquitetura simples baseada em camadas:

```
src
├── config
├── models
├── routes
└── app.js

```

**Fluxo da requisição**

```

Request → Route → Config → MongoDB → Response

````

---

## 📡 Endpoints

### Listar todos os devocionais

```
GET /api/
```

### Buscar devocional informando os parâmetros theme e mood.

```
GET /api/src?theme=<theme>&mood=<mood>
```

Exemplo:

```
GET /api/src?theme=paz&mood=reflexivo
```

---

## 📄 Estrutura de um Devocional

Exemplo de documento armazenado no MongoDB:

```json
{
  "message": {
    "_id": "...",
    "themes": {
      "amor": [
        {
          "moods": {
            "ansioso": [
              {
                "txt": "Amor em meio à ansiedade..."
              }
            ],
            ...
          }
          ...
        }
      ]
      ...
    }
    ...
  },
  "ip": "::1"
}
```

Exemplo de requisição impresso na tela:

```json
{
    "message": "A Reflexão sobre o Caminho da Paz...",
    "ip": "::1"
}
```

---

## 🔒 Segurança

Esta API implementa algumas boas práticas de segurança:

* **Helmet** para proteção de headers HTTP
* **CORS** configurado para controle de acesso
* **Rate Limit** para evitar abuso da API
* Estrutura preparada para futuras melhorias (JWT, autenticação, etc.)

---

## 🚀 Melhorias Futuras

* Autenticação com **JWT**
* Sistema de **recomendação de devocionais**
* Cache com **Redis**
* Testes automatizados
* Deploy em **Docker**
* Versionamento de API

---

## 📜 Licença

Este projeto está sob a licença **MIT**.

---

## ✝️ Motivação

Este projeto faz parte de uma iniciativa em construir ferramentas tecnológicas para auxiliar o acesso a conteúdos devocionais personalizados e edificantes.

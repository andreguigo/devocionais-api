require('dotenv').config();

const mongoose = require('mongoose');

module.exports = async function connectDB() {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Banco de dados conectado com sucesso'))
    .catch(() => console.error('Erro de conexão com o banco de dados'));
};
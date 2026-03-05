const helmet = require('helmet');
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const corsOptions = require('./config/cors');

const connectDB = require('./config/mongoose');
const devotionalsRoute = require('./routes/devotionals');

const app = express();

connectDB();

app.set('trust proxy', 1);

app.use(helmet());

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
});

app.use('/api', limiter);

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', devotionalsRoute);

app.use('/', (_, res) => res.json({ message: 'Bem vindo a API de Devocionais' }));

module.exports = app;
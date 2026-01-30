const helmet = require('helmet');
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const corsOptions = require('./src/config/cors');

const connectDB = require('./src/config/mongoose');
const devotionalsRoute = require('./src/routes/devotionals');

const app = express();
const PORT = process.env.PORT;

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

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

module.exports = app;
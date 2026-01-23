const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/mongoose');
const devotionalsRoute = require('./src/routes/devotionals');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', devotionalsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

module.exports = app;
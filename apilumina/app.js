require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Devotional = require('./models/Devotional');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('ongoDB connect'))
  .catch(err => console.error('Connect error:', err.message));

app.post('/api', async (req, res) => {
  try {
    const data = req.body;

    const themesMap = new Map();

    for (const [themeKey, themeValue] of Object.entries(data.themes || {})) {
      const moodsMap = new Map();
      for (const [moodKey, moodValue] of Object.entries(themeValue.moods || {})) {
        moodsMap.set(moodKey, moodValue);
      }
      themesMap.set(themeKey, { moods: moodsMap });
    }

    const news = await Devotional.create({ themes: themesMap });
    res.status(201).json({ message: news });
  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: 'Error creating content', detalhe: err.message });
  }
});

app.get('/api', async (req, res) => {
	try {
		const devotionals = await Devotional.find();
		res.status(200).json({ message: devotionals });
	} catch (err) {
		res.status(500).json({ erro: 'Error', detail: err.message });
	}
});

app.get('/api/src', async (req, res) => {
  const { theme, mood } = req.query;

  if (!theme || !mood) {
    return res.status(400).json({ erro: 'Enter the parameters theme e mood. ex: /api/src?theme=<theme>&mood=<mood>' });
  }

  try {
		const devotionals = await Devotional.findOne();
		const themesMap = devotionals?.themes;

		const arrayMood = themesMap?.get(theme)?.[0]?.moods?.get(mood);

		if (!Array.isArray(arrayMood) || arrayMood.length === 0) {
			return res.status(404).json({ message: 'Specified content not found' });
		}

		const randomIndex = Math.floor(Math.random() * arrayMood.length);
		const txtMood = arrayMood[randomIndex]?.txt;

		return res.status(200).json({ message: txtMood });
  } catch (err) {
    res.status(500).json({ erro: 'Error when searching for content', detalhe: err.message });
  }
});

// app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
module.exports = app;
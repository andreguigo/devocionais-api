require('dotenv').config();

const router = require('express').Router();
const { verifyToken } = require('../middleware/authJwt');
const Devotional = require('../models/Devotional');

router.post('/', [verifyToken], async (req, res) => {
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
    res.status(400).json({ erro: 'Error creating content', detalhe: err.message });
  }
});

router.get('/', [verifyToken], async (req, res) => {
	try {
		const devotionals = await Devotional.find();

    const randomIndex = Math.floor(Math.random() * devotionals.length);
		const devotionalDocument = devotionals[randomIndex];
		
    res.status(200).json({ message: devotionalDocument });
	} catch (err) {
		res.status(500).json({ erro: 'Error', detail: err.message });
	}
});

router.get('/src', [verifyToken], async (req, res) => {
  const { theme, mood } = req.query;

  if (!theme || !mood) {
    return res.status(400).json({ erro: 'Enter the parameters theme e mood. ex: /api/src?theme=<theme>&mood=<mood>' });
  }

  try {
		const devotionals = await Devotional.find();

    const randomIndex = Math.floor(Math.random() * devotionals.length);
		const devotionalDocument = devotionals[randomIndex];
    
		const moodsMapped = devotionalDocument?.themes?.get(theme)?.[0]?.moods?.get(mood);
    
		if (!Array.isArray(moodsMapped) || moodsMapped.length === 0) {
      return res.status(404).json({ message: 'Specified content not found' });
		}
    
    const txtMapped = moodsMapped?.map(item => item.txt).toString();
		return res.status(200).json({ message: txtMapped });
  } catch (err) {
    res.status(500).json({ erro: 'Error when searching for content', detalhe: err.message });
  }
});

module.exports = router;
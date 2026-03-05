require('dotenv').config();

const router = require('express').Router();
const Devotional = require('../models/Devotional');

router.post('/', async (req, res) => {
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
    res.status(400).json({ erro: 'Error creating content' });
  }
});

router.get('/', async (req, res) => {
	try {
		const devotionals = await Devotional.find();

    const randomIndex = Math.floor(Math.random() * devotionals.length);
		const devotionalDocument = devotionals[randomIndex];
		
    res.status(200).json({ message: devotionalDocument, ip: req.ip });
	} catch (err) {
		res.status(500).json({ erro: 'Erro interno do servidor' });
	}
});

router.get('/src', async (req, res) => {
  const { theme, mood } = req.query;

  if (!theme || !mood) {
    return res.status(400).json({ erro: 'Informe os parâmetros theme e mood. ex: /api/src?theme=<theme>&mood=<mood>' });
  }

  try {
		const devotionals = await Devotional.find();

    const randomIndex = Math.floor(Math.random() * devotionals.length);
		const devotionalDocument = devotionals[randomIndex];
    
		const moodsMapped = devotionalDocument?.themes?.get(theme)?.[0]?.moods?.get(mood);
    
		if (!Array.isArray(moodsMapped) || moodsMapped.length === 0) {
      return res.status(404).json({ message: 'Conteúdo especificado não encontrado' });
		}
    
    const txtMapped = moodsMapped?.map(item => item.txt).toString();
		return res.status(200).json({ message: txtMapped, ip: req.ip });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao pesquisar conteúdo' });
  }
});

module.exports = router;
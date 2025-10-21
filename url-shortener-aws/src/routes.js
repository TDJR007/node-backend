const express = require('express')
const pool = require('./db')
const { generateRandomWords } = require('./utils')

const router = express.Router()

// Health route for AWS ALB
router.get('/', (req, res) => {
    res.sendStatus(200)
})

// Route to shorten a URL
router.post('/shorten', async (req, res) => {
    try {
      const { originalUrl } = req.body;
      if (!originalUrl) return res.status(400).json({ error: 'URL is required' });
  
      let shortPath;
      let maxTries = 5; // Avoid infinite loops
      let tries = 0;
      let exists;
  
      do {
        shortPath = generateRandomWords(); 
        exists = await pool.query('SELECT 1 FROM urls WHERE short_path = $1 LIMIT 1', [shortPath]);
        tries++;
      } while (exists.rowCount > 0 && tries < maxTries);
  
      if (tries === maxTries && exists.rowCount > 0) {
        console.error('❌ Could not generate unique short path after', maxTries, 'tries');
        return res.status(500).json({ error: 'Failed to generate unique short URL' });
      }
  
      const insertResult = await pool.query(
        'INSERT INTO urls (short_path, original_url) VALUES ($1, $2) RETURNING id',
        [shortPath, originalUrl]
      );
  
      console.log(`✅ URL shortened: ${originalUrl} -> ${shortPath}, id: ${insertResult.rows[0].id}`);
  
      return res.json({ shortUrl: `/go/${shortPath}` });
  
    } catch (err) {
      console.error('❌ Error in /shorten route:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

// Route to redirect
router.get('/go/:path', async (req, res) => {
    const { path } = req.params
    const result = await pool.query('SELECT original_url FROM urls WHERE short_path = $1', [path])

    if (result.rowCount === 0) { return res.status(404).json({ error: 'URL not found' }) }

    res.redirect(result.rows[0].original_url)
})

module.exports = router

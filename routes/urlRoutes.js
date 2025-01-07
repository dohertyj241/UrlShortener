const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');
const urlModel = require('../models/urlModel');

// Post /api/shorten
router.post('/shorten', async (req, res) => {
    try{
        const { originalUrl } = req.body;

        if(!originalUrl || !originalUrl.startsWith('http')){
            return res.status(400).json({ error: 'Invalid URL' });
        }

        let existing = await urlModel.findOne({ originalUrl });
        if(existing){
            return res.json({ shortUrl: `${req.headers.host}/${existing.shortId}` });
        }

        const shortId = nanoid.nanoid(7);

        const newUrl = await urlModel.create({ originalUrl, shortId });

        return res.json({
            shortUrl: `${req.headers.host}/${newUrl.shortId}`,
        });

    } catch(error){
        console.error("Error creating short Url", error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get /:shortId
router.get('/:shortId', async (req, res) => {
    try{
        const { shortId } = req.params;

        const urlDoc = await urlModel.findOne({ shortId });
        if(!urlDoc){
            return res.status(404).json({ error: 'Url not found' });
        }

        return res.redirect(urlDoc.originalUrl);
    } catch (error) {
        console.error('Error redirecting:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
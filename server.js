const express = require('express');
const fs = require('fs').promises; // Use promises for async file operations
const cors = require('cors'); // Add CORS support
const app = express();

const PORT = process.env.PORT || 3000; // Use Render's PORT env variable

app.use(cors());
app.use(express.json());

app.get('/api/track', async (req, res) => {
    const { lat, lon, acc } = req.query;
    const timestamp = new Date().toISOString();

    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Invalid or missing coordinates' });
    }

    const accuracy = isNaN(acc) || acc === undefined ? 'unknown' : acc;
    const log = `[${timestamp}] Location: ${lat},${lon} Accuracy: ${accuracy}`;
    console.log(log);

    try {
        await fs.appendFile('gps_log.txt', log + '\n');
        res.status(200).json({ message: 'OK' });
    } catch (error) {
        console.error(`Error writing to gps_log.txt: ${error.message}`);
        res.status(500).json({ error: 'Server error while saving log' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 GPS Tracker Server running on port ${PORT}`);
});
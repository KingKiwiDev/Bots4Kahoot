const express = require('express');
const path = require('path');
const { startBots } = require('./spam');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.post('/start-bots', async (req, res) => {
    const { pin, name, bots } = req.body;
    let logs = [];
    await startBots(pin, name, bots, (msg) => logs.push(msg));
    res.json({ message: logs.join('\n') });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
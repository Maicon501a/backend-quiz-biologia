const express = require('express');
const cors = require('cors');
const { createScoresTable, addScore, getTopScores } = require('./db'); // Importa as funções do banco de dados

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint para enviar uma nova pontuação
app.post('/api/scores', async (req, res) => {
    const { name, score, difficulty, date, time, lives } = req.body;

    if (!name || score === undefined || !difficulty) {
        return res.status(400).json({ message: 'Nome, pontuação e dificuldade são obrigatórios.' });
    }

    try {
        const newRecord = await addScore(name, parseInt(score), difficulty, date || new Date().toISOString(), time || 0, lives || 0);
        res.status(201).json({ message: 'Pontuação salva com sucesso!', record: newRecord });
    } catch (error) {
        console.error('Erro ao salvar pontuação:', error);
        res.status(500).json({ message: 'Erro ao salvar pontuação.' });
    }
});

// Endpoint para obter as 10 melhores pontuações
app.get('/api/scores', async (req, res) => {
    try {
        const records = await getTopScores();
        res.status(200).json(records);
    } catch (error) {
        console.error('Erro ao buscar top scores:', error);
        res.status(500).json({ message: 'Erro ao buscar top scores.' });
    }
});

// Iniciar o servidor e criar a tabela de scores
app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    await createScoresTable(); // Garante que a tabela seja criada ao iniciar o servidor
});
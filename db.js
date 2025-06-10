const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Necessário para Render, se não estiver usando certificado CA
    }
});

const createScoresTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS scores (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                score INTEGER NOT NULL,
                difficulty VARCHAR(50) NOT NULL,
                date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                time INTEGER DEFAULT 0,
                lives INTEGER DEFAULT 0
            );
        `);
        console.log('Tabela de scores verificada/criada com sucesso.');
    } catch (err) {
        console.error('Erro ao criar a tabela de scores:', err);
    }
};

const addScore = async (name, score, difficulty, date, time, lives) => {
    try {
        const res = await pool.query(
            'INSERT INTO scores(name, score, difficulty, date, time, lives) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, score, difficulty, date, time, lives]
        );
        return res.rows[0];
    } catch (err) {
        console.error('Erro ao adicionar pontuação:', err);
        throw err;
    }
};

const getTopScores = async () => {
    try {
        const res = await pool.query(
            'SELECT name, score, difficulty, date, time, lives FROM scores ORDER BY score DESC LIMIT 10'
        );
        return res.rows;
    } catch (err) {
        console.error('Erro ao buscar top scores:', err);
        throw err;
    }
};

module.exports = {
    pool,
    createScoresTable,
    addScore,
    getTopScores
};
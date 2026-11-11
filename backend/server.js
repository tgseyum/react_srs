import express from "express"
import pool from './config/db.js'
const app = express();

app.use(express.json());

app.get('/api/courses', async (req, res) => {
    try {
        const [courses] = await pool.execute('SELECT * FROM courses');
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Database error' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
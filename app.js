import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS for GitHub Pages
app.use(cors({
    origin: ['https://kalspas0528.github.io', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ status: 'success', message: 'API is working' });
});

// Workout endpoints
app.get('/api/workouts', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('workouts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/workouts', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('workouts')
            .insert([req.body]);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error adding workout:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('CORS enabled for:', ['https://kalspas0528.github.io', 'http://localhost:3000']);
});

